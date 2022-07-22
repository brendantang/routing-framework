import { RouteHandler } from "./../serve.ts";
import { Middleware } from "./middleware.ts"

export const GET: Middleware = makeMiddlewareForMethod("GET");
export const POST: Middleware = makeMiddlewareForMethod("POST");
export const PATCH: Middleware = makeMiddlewareForMethod("PATCH");
export const DELETE: Middleware = makeMiddlewareForMethod("DELETE");

function makeMiddlewareForMethod(
  method: "GET" | "POST" | "PATCH" | "DELETE",
): Middleware {
  return function (next: RouteHandler) {
    return function (req, connInfo, params) {
      if (req.method === method) {
        return next(req, connInfo, params);
      }
      return new Response("Method not allowed", { status: 405 });
    };
  };
}
