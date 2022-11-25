import { handle, Routes } from "./mod.ts";
import { assertEquals } from "./test_deps.ts";

const routes: Routes = {
  "/hello": () => {
    return new Response("World");
  },
  "/foo": () => {
    return new Response("bar");
  },
};

const assertResponse = async (
  path: string,
  method: string,
  status: number,
  body?: string,
) => {
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

const handler = handle(routes);
Deno.test("serve", async (t) => {
  await t.step("handle the correct route", async () => {
    await assertResponse("/hello", "GET", 200, "World");
    await assertResponse("/foo", "GET", 200, "bar");
  });
});
