import { Middleware } from "./middleware.ts";
import { RouteHandler } from "../serve.ts";
import secureCompare from "https://deno.land/x/secure_compare@1.0.0/mod.ts";

export function basicAuth(
  users: Record<string, string>,
  unauthorizedHandler: RouteHandler,
): Middleware {
  return function (authorizedHandler: RouteHandler): RouteHandler {
    return function (req, params) {
      const authHeader = req.headers.get("authorization");
      if (authHeader) {
        const match = authHeader.match(/^Basic\s+(.*)$/);
        if (match) {
          const [username, password] = atob(match[1]).split(":");

          const expectedPassword = users[username];
          if (expectedPassword && secureCompare(password, expectedPassword)) {
            return authorizedHandler(req, params);
          }
        }
      }

      return unauthorizedHandler(req, params);
    };
  };
}
