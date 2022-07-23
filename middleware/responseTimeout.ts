import { Middleware } from "./middleware.ts";
import { RouteHandler } from "../serve.ts";

const TimeoutErr = "server took too long to respond";
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
      const promise = new Promise<Response>((resolve, reject) => {
        setTimeout(() => {
          reject(TimeoutErr);
        }, millis);

        const response = next(req, connInfo, params);

        if (response instanceof Promise) {
          response.then(resolve);
        } else {
          resolve(response);
        }
      });

      try {
        return await promise;
      } catch (e) {
        if (e === TimeoutErr) {
          return fallback(req, connInfo, params);
        }
        throw e;
      }
    };
  };
}
