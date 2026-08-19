export async function onRequest(context) {
  const url = new URL(context.request.url);

  // Redirect the tempting Level 8 wrong answer to a hint image.
  if (url.pathname === "/madfire/screen8.zip") {
    return Response.redirect(
      new URL("/madfire/notquite.jpg", context.request.url),
      302
    );
  }

  const protectedPages = {
    "/madfire/index.htm": {
      username: context.env.LEVEL4_USERNAME,
      password: context.env.LEVEL4_PASSWORD,
      realm: "Level 4"
    },

    "/madfire/sconce.htm": {
      username: context.env.LEVEL5_USERNAME,
      password: context.env.LEVEL5_PASSWORD,
      realm: "Level 5"
    },

    "/madfire/turbo.htm": {
      username: context.env.LEVEL6_USERNAME,
      password: context.env.LEVEL6_PASSWORD,
      realm: "Level 6"
    },

    "/madfire/persia.htm": {
      username: context.env.LEVEL7_USERNAME,
      password: context.env.LEVEL7_PASSWORD,
      realm: "Level 7"
    },

    "/finalfolder/level8.htm": {
      username: context.env.LEVEL8_USERNAME,
      password: context.env.LEVEL8_PASSWORD,
      realm: "Level 8"
    },

    "/madfire/10.htm": {
      username: context.env.LEVEL9_USERNAME,
      password: context.env.LEVEL9_PASSWORD,
      realm: "Level 9"
    },

    "/madfire/candlestick.htm": {
      username: context.env.LEVEL11_USERNAME,
      password: context.env.LEVEL11_PASSWORD,
      realm: "Level 11"
    },
   
    "/serendipity/vermeer.htm": {
      username: context.env.LEVEL16_USERNAME,
      password: context.env.LEVEL16_PASSWORD,
      realm: "Level 16"
    },
    
    "/spooky/island.htm": {
      username: context.env.LEVEL20_USERNAME,
      password: context.env.LEVEL20_PASSWORD,
      realm: "Level 20"
    },

    "/spooky/banana.htm": {
      username: context.env.LEVEL22_USERNAME,
      password: context.env.LEVEL22_PASSWORD,
      realm: "Level 22"
    },
  };

  const protectedPage = protectedPages[url.pathname];

  // Allow pages and files that aren't listed above.
  if (!protectedPage) {
    return context.next();
  }

  const authorization =
    context.request.headers.get("Authorization");

  if (!authorization?.startsWith("Basic ")) {
    return requestPassword(protectedPage.realm);
  }

  try {
    const encoded = authorization.substring(6);
    const decoded = atob(encoded);
    const separator = decoded.indexOf(":");

    if (separator === -1) {
      return requestPassword(protectedPage.realm);
    }

    const username = decoded.substring(0, separator);
    const password = decoded.substring(separator + 1);

    if (
      username === protectedPage.username &&
      password === protectedPage.password
    ) {
      return context.next();
    }
  } catch (error) {
    // Invalid authorization information
  }

  return requestPassword(protectedPage.realm);
}

function requestPassword(realm) {
  return new Response("Authorization Required", {
    status: 401,
    headers: {
      "WWW-Authenticate":
        `Basic realm="${realm}", charset="UTF-8"`,

      "Content-Type":
        "text/plain; charset=UTF-8"
    }
  });
}

