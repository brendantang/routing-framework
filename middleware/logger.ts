import { cyan, formatTime, green, red, yellow } from "./../deps.ts";
import { ConnInfo, RouteHandler, RouteParams } from "./../mod.ts";

export function logger(next: RouteHandler): RouteHandler {
  return async function (
    req: Request,
    connInfo: ConnInfo,
    params: RouteParams,
  ): Promise<Response> {
    const userAgent = req.headers.get("User-Agent");
    const ip = getIp(connInfo);
    const path = new URL(req.url).pathname;
    const startTime = performance.now();
    console.log(
      prefixWithTime(
        new Date(),
        `Starting ${req.method} "${path}" for ${ip} ${userAgent}`,
      ),
    );
    const response = await next(req, connInfo, params);
    const endTime = performance.now();

    const responseTime = endTime - startTime;
    const status: number = response.status;
    const logString = prefixWithTime(
      new Date(),
      `Completed ${String(status)} in ${responseTime}`,
    );

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

function getIp(connInfo: ConnInfo) {
  if (connInfo.remoteAddr.transport === "tcp") {
    return connInfo.remoteAddr.hostname;
  }
}

function prefixWithTime(t: Date, s: string): string {
  return `[${formatTime(t, "MM-dd-yyyy hh:mm:ss.SSS")}] ${s}`;
}
