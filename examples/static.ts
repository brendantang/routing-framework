import { GET, serve } from "./../mod.ts";
import { file, files } from "../mod.ts";

const routes = {
  // Serve a directory of files
  "/assets/:filename+": GET(
    files(`${Deno.cwd()}/examples/public/`, "filename"),
  ),
  // Serve just one file
  "/hi": GET(file(`${Deno.cwd()}/examples/public/hello.md`)),
};

serve(routes);
