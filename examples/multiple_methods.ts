import { handleMethods, RouteHandler, serve } from "./../mod.ts";

const helloHandler: RouteHandler = (_req, _connInfo, params) => {
  const name = params["name"];
  return new Response("Hello " + name);
};

const routes = {
  "/multipleMethods": handleMethods(
    new Map()
      .set("GET", () => {
        return new Response("Hello from the GET handler");
      })
      .set("POST", () => {
        return new Response("Hello from the POST handler");
      }),
  )(
    () => {
      return new Response("Hello from the fallback handler", { status: 405 });
    },
  ),
};

await serve(routes);
