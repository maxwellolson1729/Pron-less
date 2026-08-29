const CONDITION_COOKIE = "gp_epi=conditioned";

function redirect(request, pathname, cookie) {
  const location = new URL(pathname, request.url).toString();
  const headers = { Location: location };
  if (cookie) headers["Set-Cookie"] = cookie;
  return new Response(null, { status: 302, headers });
}

function isConditioned(request) {
  const cookie = request.headers.get("Cookie") || "";
  return cookie.split(";").some((item) => item.trim() === CONDITION_COOKIE);
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const pathname = url.pathname.toLowerCase();

  if (pathname === "/cute/lovebugs.htm") {
    return redirect(context.request, "/cute/lovebug.htm");
  }

  if (pathname === "/cute/sweetpea.htm" || pathname === "/cute/sweetpeas.htm") {
    return redirect(
      context.request,
      "/cute/pi.htm",
      `${CONDITION_COOKIE}; Path=/cute; Max-Age=31536000; HttpOnly; Secure; SameSite=Lax`,
    );
  }

  if (pathname === "/cute/pi.htm" && isConditioned(context.request)) {
    url.pathname = "/cute/pi-conditioned.htm";
    return context.env.ASSETS.fetch(url);
  }

  return context.env.ASSETS.fetch(context.request);
}
