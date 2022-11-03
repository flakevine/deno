import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import { RoutesObject, createRouter, TemplateEngine } from './lib/index.ts'
const HTML_HEADERS = { headers: { 'Content-Type': 'text/html' } }

serve((req) => {
  const routes: RoutesObject = {
    "/": async (req) => {
      const templateEngine = new TemplateEngine();
      const html = await Deno.readTextFile("home.html")
      return new Response(templateEngine.render(html, {
        zimbas: "teste",
        props: 'passei por props',
        user: 'viktor'
      }), HTML_HEADERS)
    },
    "/about": (req) => new Response("About"),
    "/user": {
      "/:id": (req, data) => new Response("User with some id " + data?.params.id)
    }
  }

  const router = createRouter(routes);
  return router.handleRequest(req);
})