import {
  serve as stdServe,
  ServeInit,
  ConnInfo
} from "https://deno.land/std@0.149.0/http/server.ts";
export type { ConnInfo } from "https://deno.land/std@0.149.0/http/server.ts";
import { logger } from "./logger.ts"


export type RouteHandler = (
  req: Request,
  connInfo: ConnInfo,
  params: RouteParams,
) => Response | Promise<Response>;

export interface Routes {
  [path: string]: RouteHandler;
}
export type RouteParams = Record<string,string>

export function serve(
  routes: Routes,
  options: ServeInit = defaultServeOptions,
): void {
  stdServe(async (req: Request, connInfo: ConnInfo): Promise<Response> => {
    const { search, pathname } = new URL(req.url);
    for (const route of Object.keys(routes)) {
      const pattern = new URLPattern({ pathname: route });
      if (pattern.test({ pathname })) {
        const params = pattern.exec({ pathname })?.pathname.groups || {};
        const response = await logger(routes[route])(req, connInfo, params);
        return response;
      }
    }

    throw ("No route pattern matched");
  }, options);
}

export const defaultErrorHandler = (err: unknown) => {
  console.error("An error was thrown while serving a request: ", err);
  return new Response("Internal Server Error", { status: 500 });
};

export const defaultServeOptions = { port: 8000, onError: defaultErrorHandler };


