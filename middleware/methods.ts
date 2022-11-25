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
    return function (req, params) {
      const matchedHandler = handlers.get(req.method as Method);
      if (matchedHandler) {
        return matchedHandler(req, params);
      }
      return fallback(req, params);
    };
  };
}

function makeMiddlewareForMethod(
  method: Method,
): Middleware {
  return function (next: RouteHandler): RouteHandler {
    return function (req, params) {
      if (req.method === method) {
        return next(req, params);
      }
      return new Response("Method not allowed", { status: 405 });
    };
  };
}
