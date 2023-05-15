import { type RouteHandler } from "../serve.ts";
import { serveFile } from "../deps.ts";

export function files(
  directory: string,
  paramName = "filepath",
): RouteHandler {
  return async function (req, params) {
    // Use the request pathname as filepath
    const filepath = decodeURIComponent(params[paramName] || "");
    return await serveFile(req, directory + "/" + filepath);
  };
}

export function file(
  path: string,
): RouteHandler {
  return async function (req) {
    return await serveFile(req, path);
  };
}
