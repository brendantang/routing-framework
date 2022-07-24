import { basicAuth, GET, RouteHandler, serve } from "./../mod.ts";

const protectedHandler: RouteHandler = function () {
  return new Response("Welcome to the protected area of the site");
};

const notAuthenticated: RouteHandler = function () {
  return new Response("Could not log you in with the credentials provided");
};

const users = {
  brendan: "some_password",
};

const routes = {
  "/protected": GET(basicAuth(users, notAuthenticated)(protectedHandler)),
};

serve(routes);
