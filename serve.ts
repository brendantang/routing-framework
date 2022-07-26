import { ConnInfo, ServeInit, stdServe } from "./deps.ts";

import { Middleware } from "./middleware/middleware.ts";
import { logger } from "./middleware/logger.ts";

export type RouteHandler = (
  req: Request,
  params: RouteParams,
) => Response | Promise<Response>;

export interface Routes {
  [path: string]: RouteHandler;
}
export type RouteParams = Record<string, string>;

export function serve(
  routes: Routes,
  middlewares: Middleware[] = [logger],
  options: ServeInit = defaultServeOptions,
): Promise<void> {
  return stdServe(
    handle(routes, middlewares),
    options,
  );
}

export function handle(
  routes: Routes,
  middlewares: Middleware[] = [logger],
) {
  const handler = async (
    req: Request,
  ): Promise<Response> => {
    const { pathname } = new URL(req.url);
    for (const route of Object.keys(routes)) {
      const pattern = new URLPattern({ pathname: route });
      if (pattern.test({ pathname })) {
        const params = pattern.exec({ pathname })?.pathname.groups || {};
        const handlerWithMiddlewares = middlewares.reduce(
          function (previous, current) {
            return (current(previous));
          },
          routes[route],
        );
        const response = await handlerWithMiddlewares(
          req,
          params,
        );
        return response;
      }
    }
    throw ("No route pattern matched");
  };
  return handler;
}

export const defaultErrorHandler = (err: unknown) => {
  console.error("An error was thrown while routing a request: ", err);
  return new Response("Internal Server Error", { status: 500 });
};

export const defaultServeOptions = { port: 8000, onError: defaultErrorHandler };
