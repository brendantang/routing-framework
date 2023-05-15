import { type RouteHandler } from "./../serve.ts";
export type Middleware = (next: RouteHandler) => RouteHandler;

export function applyMiddlewares(
  middlewares: Middleware[],
  handler: RouteHandler,
): RouteHandler {
  return middlewares.reduce(
    function (handler_, middleware) {
      return (middleware(handler_));
    },
    handler,
  );
}
