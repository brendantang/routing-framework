import { ServeInit, stdServe } from "./deps.ts";

import { applyMiddlewares, Middleware } from "./middleware/middleware.ts";
import { logger } from "./middleware/logger.ts";

export type RouteHandler = (
  req: Request,
  params: RouteParams,
  route: string,
) => Response | Promise<Response>;

export interface Routes {
  [path: string]: RouteHandler;
}
export type RouteParams = Record<string, string | undefined>;

export function serve(
  routes: Routes,
  middlewares: Middleware[] = [logger],
  onNotFound: RouteHandler = default404Handler,
  options: ServeInit = defaultServeOptions,
): Promise<void> {
  return stdServe(
    handle(routes, middlewares, onNotFound),
    options,
  );
}

export function handle(
  routes: Routes,
  middlewares: Middleware[] = [logger],
  onNotFound: RouteHandler,
) {
  const handler = async (
    req: Request,
  ): Promise<Response> => {
    const { pathname } = new URL(req.url);
    for (const route of Object.keys(routes)) {
      const pattern = new URLPattern({ pathname: route });
      if (pattern.test({ pathname })) {
        const params = pattern.exec({ pathname })?.pathname.groups || {};
        const handlerWithMiddlewares = applyMiddlewares(
          middlewares,
          routes[route],
        );
        const response = await handlerWithMiddlewares(
          req,
          params,
          route,
        );
        return response;
      }
    }
    return applyMiddlewares(middlewares, onNotFound)(req, {}, "");
  };
  return handler;
}

export const defaultErrorHandler = (err: unknown) => {
  console.error("An error was thrown while routing a request: ", err);
  return new Response("Internal Server Error", { status: 500 });
};

export const default404Handler: RouteHandler = () => {
  return new Response("Page not found", { status: 404 });
};

export const defaultServeOptions = { port: 8000, onError: defaultErrorHandler };
