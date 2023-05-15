import { RouteHandler } from "./../serve.ts";
import { Middleware } from "./middleware.ts";

type Method = "GET" | "POST" | "PATCH" | "DELETE";

export const GET: Middleware = makeMiddlewareForMethod("GET");
export const POST: Middleware = makeMiddlewareForMethod("POST");
export const PATCH: Middleware = makeMiddlewareForMethod("PATCH");
export const DELETE: Middleware = makeMiddlewareForMethod("DELETE");

type methodHandlers = {
  GET?: RouteHandler;
  POST?: RouteHandler;
  PATCH?: RouteHandler;
  DELETE?: RouteHandler;
};

export function handleMethods(
  handlers: methodHandlers,
): Middleware {
  return function (fallback: RouteHandler): RouteHandler {
    return function (req, params, route) {
      const matchedHandler = handlers[req.method as Method];
      if (matchedHandler) {
        return matchedHandler(req, params, route);
      }
      return fallback(req, params, route);
    };
  };
}

function makeMiddlewareForMethod(
  method: Method,
): Middleware {
  return function (next: RouteHandler): RouteHandler {
    return function (req, params, route) {
      if (req.method === method) {
        return next(req, params, route);
      }
      return new Response("Method not allowed", { status: 405 });
    };
  };
}
