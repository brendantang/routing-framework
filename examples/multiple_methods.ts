import { handleMethods, serve } from "./../mod.ts";

const routes = {
  "/multipleMethods": handleMethods({
    "GET": () => {
      return new Response("Hello from the GET handler");
    },
    "POST": () => {
      return new Response("Hello from the POST handler");
    },
  })(
    () => {
      return new Response("Hello from the fallback handler", { status: 405 });
    },
  ),
};

await serve(routes);
