<script>
  function passwordPrompt() {
    const username = prompt("Username:");
    const password = prompt("Password:");

    if (
      username?.toLowerCase() === "power" &&
      password?.toLowerCase() === "bank"
    ) {
      window.location.href = "/work/level5.htm";
    } else {
      alert("Incorrect username or password.");
    }
  }
</script>
