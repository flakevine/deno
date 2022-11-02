import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import { RoutesObject, createRouter } from './lib/index.ts'

serve((req) => {
  const routes: RoutesObject = {
    "/": (req) => new Response("Index"),
    "/about": (req) => new Response("About"),
    "/user": {
      "/:id": (req, data) => new Response("User with some id " + data?.params.id)
    }
  }

  const router = createRouter(routes)
  return router.handleRequest(req);
})