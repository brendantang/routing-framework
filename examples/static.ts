import { GET,   serve } from "./../mod.ts";
import { files } from "../mod.ts"


const routes = {
  "/assets/:filename+": GET(files(`${Deno.cwd()}/examples/public/`, "filename" )),
};

await serve(routes);
