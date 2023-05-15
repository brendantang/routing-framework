import { GET, json, POST, RouteHandler, serve } from "./../mod.ts";

const helloHandler: RouteHandler = (_req, params) => {
  const name = params["name"];
  return new Response("Hello " + name);
};

const routes = {
  "/hello/:name": GET(helloHandler),
  "/world": () => {
    return new Response("world");
  },
  "/echo": POST(async function (
    req: Request,
  ) {
    const body = await req.text();
    return json({ youSaid: body });
  }),
  "/err": () => {
    throw "Intentional error!";
    return new Response("You won't see this");
  },
};

await serve(routes);
