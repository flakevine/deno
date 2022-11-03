type RenderData = { [key: string]: any }

type Component = { name: string, proplist: string[] }

export const html = (htmlString: string, ...values: unknown[]) => 'oi';

export class TemplateEngine {
    private html: string;
    
    constructor() {
        this.html = ''
    }
    
    insertVariables(data: RenderData) {
        for (const key in data) {
            const variable = data[key];
            this.html = this.html.replaceAll(`{${key}}`, this.getRenderStrategy(variable))
        }
    }

    getRenderStrategy(variable: any) {
        const renderStrategies = {
            'object': (variable: any) => JSON.stringify(variable),
            'string': (variable: any) => variable,
            'number': (variable: any) => variable,
            'boolean': (variable: any) => variable,
            'bigint': (variable: any) => variable,
            'symbol': (variable: any) => variable,
            'undefined': (variable: any) => variable,
            'null': (variable: any) => variable,
            'function': (variable: any) => variable.toString()
        }

        return renderStrategies[typeof variable](variable);
    }

    getComponents() {
        const compCount = this.html.split('@component').length - 1
        const components: Component[] = [];

        for (let i=0; i < compCount; i++ ) {
            const arr = this.html.split('@component ')[1].split('\n')[0].split(' ');

            const proplist = arr[1].match(/{(.*?)}/)![1].split(',');

            components.push({ name: arr[0], proplist });

            this.html = this.html.replace('@component', '@import');
        }

        return components;
    }

    renderServerComponents(data: RenderData) {
        const components = this.getComponents();

        components.forEach(async (comp) => {
            const component = await Deno.readTextFile('components/' + comp.name + '.html');
            const componentData: any = {};

            comp.proplist.forEach(prop => componentData[prop] = data[prop])

            const htmlResult = new TemplateEngine().render(component, componentData);

            console.log(htmlResult)

            console.log(`@import ${comp.name} {${comp.proplist.map(p => (p+',')).join('').slice(0, -1)}}`)

            this.html = this.html.replace(`@import ${comp.name} {${comp.proplist.map(p => (p+',')).join('').slice(0, -1)}}`, htmlResult)
        })
    }

    render(html: string, data: RenderData) {
        this.html = html;
        this.renderServerComponents(data);
        this.insertVariables(data)
        return this.html
    }
}