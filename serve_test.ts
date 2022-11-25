import { handle, Middleware, RouteHandler, Routes } from "./mod.ts";
import { assertEquals } from "./test_deps.ts";

const assertResponse = async (
  routes: Routes,
  middlewares: Middleware[],
  path: string,
  method: string,
  status: number,
  body?: string,
) => {
  const handler = handle(routes, middlewares);

  const response = await handler(
    new Request(`http://localhost${path}`, { method }),
  );
  assertEquals(
    status,
    response.status,
  );
  if (body) {
    const got = await response.text();
    assertEquals(
      body,
      got,
    );
  }
};

Deno.test("serve", async (t) => {
  await t.step("handle", async (t) => {
    const routes: Routes = {
      "/hello": () => {
        return new Response("World");
      },
      "/foo": () => {
        return new Response("bar");
      },
    };
    await t.step("the correct routes", async () => {
      await assertResponse(routes, [], "/hello", "GET", 200, "World");
      await assertResponse(routes, [], "/foo", "GET", 200, "bar");
    });
    await t.step("middlewares in the correct order", async () => {
      const unauthorized: Middleware = (_next: RouteHandler) => {
        return (_req, _params) => {
          return new Response("Unauthorized", { status: 401 });
        };
      };
      await assertResponse(
        routes,
        [unauthorized],
        "/hello",
        "GET",
        401,
        "Unauthorized",
      );
    });
  });
});
