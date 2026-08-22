const LEVEL_34_HTML = `<html>
<head>
  <title>Well, that's empty</title>
</head>
<body bgcolor="#ffffff" text="#000000">
<center>
  <img src="/stuff/restricted/34/Restricted.jpg" width="600" height="600" border="0" alt="">
</center>

<!-- No letters left? Backspace still works -->
</body>
</html>`;

export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.pathname === "/backto/.htm") {
    return new Response(LEVEL_34_HTML, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=UTF-8"
      }
    });
  }

  return context.next();
}
