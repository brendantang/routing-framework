import {type RouteHandler } from "./../serve.ts"
export type Middleware = (next: RouteHandler) => RouteHandler;
