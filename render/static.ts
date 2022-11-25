import { type RouteHandler } from "../serve.ts";

export function files(
  rootPath: string,
  paramName: string,
  responseInit?: ResponseInit,
): RouteHandler {
  return filesWithFallback(rootPath, paramName, fileDoesNotExist, responseInit);
}

export function filesWithFallback(
  rootPath: string,
  paramName: string,
  fallback: RouteHandler,
  responseInit?: ResponseInit,
): RouteHandler {
  return async function (req, params) {
    // Use the request pathname as filepath
    const filepath = decodeURIComponent(params[paramName]);

    // Try opening the file
    let file;
    try {
      const fullPath = rootPath + filepath;
      file = await Deno.readFile(fullPath);
    } catch {
      // If the file cannot be opened, serve the fallback handler
      return await fallback(req, params);
    }

    // Build and send the response
    return new Response(file, responseInit);
  };
}

export function file(
  rootPath: string,
  responseInit?: ResponseInit,
): RouteHandler {
  return fileWithFallback(rootPath, fileDoesNotExist, responseInit);
}

export function fileWithFallback(
  filePath: string,
  fallback: RouteHandler,
  responseInit?: ResponseInit,
): RouteHandler {
  return async function (req, params) {
    // Try opening the file
    let file;
    try {
      file = await Deno.readFile(filePath);
    } catch {
      // If the file cannot be opened, serve the fallback handler
      return await fallback(req, params);
    }

    // Build and send the response
    return new Response(file, responseInit);
  };
}

function fileDoesNotExist() {
  return new Response("File does not exist", { status: 404 });
}
