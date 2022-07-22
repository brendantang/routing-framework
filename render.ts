export function json(
  body: typeof JSON.stringify,
  responseInit?: ResponseInit,
) {
  const init = responseInit || {}
  const headers  = new Headers(init.headers)
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type","application/json; charset=utf-8")
  }
  init.headers = headers
  return new Response(
    JSON.stringify(body),
    init,
  );
}
