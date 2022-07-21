import { serve , RouteHandler} from "./mod.ts";

const helloHandler: RouteHandler = (req, connInfo, params) => {
  const name = params["name"]
  return new Response("Hello " + name);
};


const routes = {
  "/hello/:name": helloHandler,
  "/world": (req) => {
    return new Response("world");
  },
  "/err": (req) => {
    throw "Intentional error!"
    return new Response("You won't see this");
  },
};

await serve(routes);
