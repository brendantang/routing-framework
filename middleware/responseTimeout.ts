import { Middleware } from "./middleware.ts";
import { RouteHandler } from "../serve.ts";

export function timeoutAfter(millis: number): Middleware {
  return timeoutWithFallbackAfter(millis, function (req) {
    console.error(
      `Server timed out after ${
        millis / 1000
      } seconds handling ${req.method} request to ${req.url}`,
    );
    return new Response("The server took too long to respond to your request.");
  });
}
export function timeoutWithFallbackAfter(
  millis: number,
  fallback: RouteHandler,
): Middleware {
  return function (next: RouteHandler): RouteHandler {
    return async function (req, connInfo, params): Promise<Response> {
      const resp = await Promise.race(
        [
          next(req, connInfo, params),
          new Promise<Response>((resolve, _reject) => {
            setTimeout(() => {
              resolve(fallback(req, connInfo, params));
            }, millis);
          }),
        ],
      );
      return resp;
    };
  };
}
