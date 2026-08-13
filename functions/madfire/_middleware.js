export async function onRequest(context) {
  const authorization =
    context.request.headers.get("Authorization");

  if (!authorization?.startsWith("Basic ")) {
    return requestPassword();
  }

  try {
    const encoded = authorization.substring(6);
    const decoded = atob(encoded);
    const separator = decoded.indexOf(":");

    const username = decoded.substring(0, separator);
    const password = decoded.substring(separator + 1);

    if (
      username === context.env.PUZZLE_USERNAME &&
      password === context.env.PUZZLE_PASSWORD
    ) {
      return context.next();
    }
  } catch (error) {
    // Invalid authorization information
  }

  return requestPassword();
}

function requestPassword() {
  return new Response("Authorization Required", {
    status: 401,

    headers: {
      "WWW-Authenticate":
        'Basic realm="Level 4", charset="UTF-8"',

      "Content-Type":
        "text/plain; charset=UTF-8"
    }
  });
}
