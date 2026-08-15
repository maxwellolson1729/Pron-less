(function () {
  const captcha = document.getElementById("captcha");
  const grid = document.getElementById("captcha-grid");
  const instruction = document.getElementById("captcha-instruction");
  const message = document.getElementById("captcha-message");
  const verify = document.getElementById("captcha-verify");
  const continueButton = document.getElementById("captcha-continue");
  const refresh = document.getElementById("captcha-refresh");
  const audio = document.getElementById("captcha-audio");
  const info = document.getElementById("captcha-info");

  const imageTiles = [
    { src: "glove.jpg", name: "glove" },
    { src: "book.jpg", name: "book" },
    { src: "hare.jpg", name: "hare" },
    { src: "orange.jpg", name: "orange" },
    { src: "dog.jpg", name: "dog" },
    { src: "stone.jpg", name: "stone" },
    { src: "key.jpg", name: "key" },
    { src: "train.jpg", name: "train" },
    { src: "moon.jpg", name: "moon" }
  ];

  const correctSelection = [0, 2, 3, 5, 7];
  let stage = 1;
  let retryStartedAt = 0;
  let transitionPending = false;

  function makeTile(index, image) {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "captcha-tile";
    tile.dataset.index = String(index);
    tile.setAttribute("aria-pressed", "false");

    if (image) {
      const img = document.createElement("img");
      img.src = image.src;
      img.alt = image.name;
      tile.appendChild(img);
      tile.setAttribute("aria-label", "Select image " + (index + 1));
    } else {
      tile.setAttribute("aria-label", "Select square " + (index + 1));
    }

    tile.addEventListener("click", function () {
      if (transitionPending || verify.classList.contains("captcha-hidden")) {
        return;
      }

      const selected = tile.classList.toggle("selected");
      tile.setAttribute("aria-pressed", String(selected));
      clearMessage();
      updateActionLabel();
    });

    return tile;
  }

  function renderCableChallenge() {
    stage = 1;
    transitionPending = false;
    grid.innerHTML = "";
    grid.className = "captcha-grid cable-grid";
    instruction.textContent =
      "Select all squares containing the cable connected to the red plug.";
    verify.classList.remove("captcha-hidden");
    continueButton.classList.add("captcha-hidden");
    clearMessage();

    for (let index = 0; index < 9; index += 1) {
      grid.appendChild(makeTile(index));
    }

    updateActionLabel();
  }

  function renderWordChallenge() {
    stage = 2;
    transitionPending = false;
    grid.innerHTML = "";
    grid.className = "captcha-grid";
    instruction.textContent =
      "Select all images that survive losing their head.";
    verify.classList.remove("captcha-hidden");
    continueButton.classList.add("captcha-hidden");
    clearMessage();

    imageTiles.forEach(function (image, index) {
      grid.appendChild(makeTile(index, image));
    });

    updateActionLabel();
    retryStartedAt = performance.now();
  }

  function selectedIndices() {
    return Array.from(grid.querySelectorAll(".captcha-tile.selected"))
      .map(function (tile) {
        return Number(tile.dataset.index);
      })
      .sort(function (a, b) {
        return a - b;
      });
  }

  function clearSelections() {
    grid.querySelectorAll(".captcha-tile.selected").forEach(function (tile) {
      tile.classList.remove("selected");
      tile.setAttribute("aria-pressed", "false");
    });

    updateActionLabel();
  }

  function updateActionLabel() {
    verify.textContent = selectedIndices().length === 0 ? "SKIP" : "VERIFY";
  }

  function clearMessage() {
    message.textContent = "";
    message.classList.remove("success");
  }

  function showError(text) {
    message.textContent = text;
    message.classList.remove("success");
  }

  function selectionsMatch(selected, correct) {
    return selected.length === correct.length && selected.every(function (value, index) {
      return value === correct[index];
    });
  }

  verify.addEventListener("click", function () {
    if (transitionPending) {
      return;
    }

    if (stage === 1) {
      transitionPending = true;
      showError("Humanity not detected. Try again.");

      window.setTimeout(function () {
        renderWordChallenge();
      }, 1400);

      return;
    }

    const elapsed = performance.now() - retryStartedAt;

    if (elapsed < 10000) {
      showError("Suspiciously fast. Robots are fast... try again.");
      clearSelections();
      retryStartedAt = performance.now();
      return;
    }

    const selected = selectedIndices();

    if (!selectionsMatch(selected, correctSelection)) {
      showError("Humanity not detected. Try again.");
      clearSelections();
      retryStartedAt = performance.now();
      return;
    }

    message.textContent = "Verification complete. You may be human.";
    message.classList.add("success");
    verify.classList.add("captcha-hidden");
    continueButton.classList.remove("captcha-hidden");
  });

  refresh.addEventListener("click", function () {
    if (stage === 1) {
      renderCableChallenge();
    } else {
      renderWordChallenge();
    }
  });

  audio.addEventListener("click", function () {
    alert("Audio challenge unavailable. Please use the image challenge.");
  });

  info.addEventListener("click", function () {
    alert("Select every square that matches the instruction, then click VERIFY.");
  });

  renderCableChallenge();
})();
