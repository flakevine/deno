type RenderData = { [key: string]: any }

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

    render(html: string, data: RenderData) {
        this.html = html;
        this.insertVariables(data)
        return this.html
    }
}