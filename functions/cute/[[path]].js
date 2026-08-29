const COOKIE_NAME = "gp_epi";
const CONDITION_COOKIE = `${COOKIE_NAME}=conditioned`;

function redirect(request, pathname, cookie) {
  const location = new URL(pathname, request.url).toString();
  const headers = { Location: location };

  if (cookie) {
    headers["Set-Cookie"] = cookie;
  }

  return new Response(null, {
    status: 302,
    headers,
  });
}

function isConditioned(request) {
  const cookie = request.headers.get("Cookie") || "";

  return cookie
    .split(";")
    .some((item) => item.trim() === CONDITION_COOKIE);
}

async function serveAsset(context, request, additionalHeaders = {}) {
  const original = await context.env.ASSETS.fetch(request);
  const headers = new Headers(original.headers);

  for (const [name, value] of Object.entries(additionalHeaders)) {
    headers.set(name, value);
  }

  return new Response(original.body, {
    status: original.status,
    statusText: original.statusText,
    headers,
  });
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const pathname = url.pathname.toLowerCase();

  if (pathname === "/cute/lovebugs.htm") {
    return redirect(context.request, "/cute/lovebug.htm");
  }

  if (
    pathname === "/cute/sweetpea.htm" ||
    pathname === "/cute/sweetpeas.htm"
  ) {
    return redirect(
      context.request,
      "/cute/pi.htm",
      `${CONDITION_COOKIE}; Path=/cute; Max-Age=60; HttpOnly; Secure; SameSite=Lax`
    );
  }

  if (pathname === "/cute/pi.htm" && isConditioned(context.request)) {
    url.pathname = "/cute/pi-conditioned.htm";

    return serveAsset(context, url, {
      // Consume the cookie after showing the conditioned version once.
      "Set-Cookie":
        `${COOKIE_NAME}=; Path=/cute; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
      "Cache-Control": "private, no-store",
    });
  }

  if (pathname === "/cute/pi.htm") {
    return serveAsset(context, context.request, {
      "Cache-Control": "private, no-store",
    });
  }

  return context.env.ASSETS.fetch(context.request);
}
