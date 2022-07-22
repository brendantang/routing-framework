import { RouteHandler } from "./../serve.ts";
import { Middleware } from "./middleware.ts";

type Method = "GET" | "POST" | "PATCH" | "DELETE";

export const GET: Middleware = makeMiddlewareForMethod("GET");
export const POST: Middleware = makeMiddlewareForMethod("POST");
export const PATCH: Middleware = makeMiddlewareForMethod("PATCH");
export const DELETE: Middleware = makeMiddlewareForMethod("DELETE");

type methodHandlers = Map<Method, RouteHandler>;

export function handleMethods(
  handlers: methodHandlers,
): Middleware {
  return function (fallback: RouteHandler): RouteHandler {
    return function (req, connInfo, params) {
      const matchedHandler = handlers.get(req.method);
      if (matchedHandler) {
        return matchedHandler(req, connInfo, params);
      }
      return fallback(req, connInfo, params);
    };
  };
}

function makeMiddlewareForMethod(
  method: Method,
): Middleware {
  return function (next: RouteHandler): RouteHandler {
    return function (req, connInfo, params) {
      if (req.method === method) {
        return next(req, connInfo, params);
      }
      return new Response("Method not allowed", { status: 405 });
    };
  };
}
