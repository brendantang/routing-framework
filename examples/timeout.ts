import { json, RouteHandler, serve, timeoutAfter } from "./../mod.ts";

const handlerThatTakesFiveSeconds: RouteHandler = async () => {
  const body = await new Promise<string>((resolve, _reject) => {
    setTimeout(
      () => {
        resolve("The server should time out before you see this response!");
      },
      5000,
    );
  }).then((message) => {
    return message;
  });
  return new Response(body);
};

const routes = {
  "/should_timeout": timeoutAfter(1000)(handlerThatTakesFiveSeconds),
};

serve(routes);
