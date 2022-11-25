import { handle, Routes } from "./mod.ts";
import { assertEquals } from "./test_deps.ts";

const routes: Routes = {
  "/hello": () => {
    return new Response("World");
  },
};

const handler = handle(routes);
Deno.test("serve", async (t) => {
  await t.step("handle", async () => {
    const response = await handler(new Request("http://localhost/hello"));
    const body = await response.text();
    assertEquals(
      "World",
      body,
    );
  });
});
