import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

const routes = [
  "/",
  "/abou"
]

serve(async (req) => {
  if (upgrade.toLowerCase() != "websocket") {

    console.log(req.url);
    
    const rawPage = await Deno.readTextFile("client.html");

    const page = rawPage.replaceAll('@URL_SERVER@', 'ws://' + req.url.split('//')[1])

    return new Response(page, { headers: { 'Content-Type': 'text/html' } });
  }

  return new Response();
});