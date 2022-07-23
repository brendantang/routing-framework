import { json, RouteHandler, serve, timeoutAfter } from "./../mod.ts";

const handlerThatTakesFiveSeconds: RouteHandler = async () => {
  const body = await new Promise<string>((resolve, _reject) => {
    setTimeout(
      () => {
        resolve("This response takes 5 seconds to serve!");
      },
      5000,
    );
  }).then((message) => {
    return message;
  });
  return new Response(body);
};

const routes = {
  "/should_timeout": timeoutAfter(100)(handlerThatTakesFiveSeconds),
  "/should_not_timeout": timeoutAfter(10000)(handlerThatTakesFiveSeconds),
  "/sync_handler": timeoutAfter(10000)(function () {
    return new Response("Synchronoous handler");
  }),
};

serve(routes);
