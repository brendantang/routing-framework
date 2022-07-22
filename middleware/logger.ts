import { cyan, formatTime, green, red, yellow } from "./../deps.ts";
import { ConnInfo, RouteHandler, RouteParams } from "./../mod.ts";

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
      formatTime(new Date(Date.now()), "MM-dd-yyyy hh:mm:ss.SSS")
    }] ${req.method} ${req.url} ${String(status)} ${userAgent}`;

    const logWithColor = status >= 500
      ? `${red(logString)}`
      : status >= 400
      ? `${yellow(logString)}`
      : status >= 300
      ? `${cyan(logString)}`
      : status >= 200
      ? `${green(logString)}`
      : `${red(logString)}`;

    console.log(logWithColor);

    return response;
  };
}
