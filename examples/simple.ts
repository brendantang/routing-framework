import { GET, POST, RouteHandler, serve } from "./../mod.ts";

const helloHandler: RouteHandler = (_req, _connInfo, params) => {
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
    return new Response(body);
  }),
  "/err": () => {
    throw "Intentional error!";
    return new Response("You won't see this");
  },
};

await serve(routes);
