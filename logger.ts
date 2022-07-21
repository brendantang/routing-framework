import {
  cyan,
  green,
  red,
  yellow,
} from "https://deno.land/std@0.53.0/fmt/colors.ts";
import { format } from "https://deno.land/std/datetime/mod.ts";
import { ConnInfo, RouteHandler, RouteParams } from "./mod.ts";

export function logger(next: RouteHandler): RouteHandler {
  return async function (
    req: Request,
    _connInfo: ConnInfo,
    params: RouteParams,
  ): Promise<Response> {
    const response = await next(req, _connInfo, params);
    const userAgent = req.headers.get("User-Agent");
    const status: number = response.status;
    const logString = `[${
      format(new Date(Date.now()), "MM-dd-yyyy hh:mm:ss.SSS")
    }] ${req.method} ${req.url} ${String(status)} ${userAgent}`;

    const _color = status >= 500
      ? console.log(`${red(logString)}`) // red
      : status >= 400
      ? console.log(`${yellow(logString)}`) // yellow
      : status >= 300
      ? console.log(`${cyan(logString)}`) // cyan
      : status >= 200
      ? console.log(`${green(logString)}`) // green
      : console.log(`${red(logString)}`);

    return response;
  };
}
