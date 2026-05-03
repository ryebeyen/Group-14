const popupBackdrop = document.getElementById("popupBackdrop");
const popupBox = document.getElementById("popupBox");
const popupMessage = document.getElementById("popupMessage");
const popupClose = document.getElementById("popupClose");

    let popupMode = "loading";

    function isOnlyNumbers(value) {
      return /^\d+$/.test(value);
    }

    function showPopup(message, mode) {
      popupMode = mode;
      popupMessage.innerHTML = message;
      popupBackdrop.classList.remove("hidden");
      popupClose.classList.toggle("hidden", mode === "loading");

      popupBox.classList.remove("loading-popup", "error-popup", "success-popup");

      if (mode === "loading") popupBox.classList.add("loading-popup");
      else if (mode === "error") popupBox.classList.add("error-popup");
      else if (mode === "success") popupBox.classList.add("success-popup");
    }

    function hidePopup() {
      popupBackdrop.classList.add("hidden");
    }

    function validateInputs() {
      const cardValue = cardNumber.value.trim();
      const cvvValue = cvv.value.trim();
      const zipValue = zipCode.value.trim();

      return (
        /^\d{16}$/.test(cardValue) &&
        /^\d{3}$/.test(cvvValue) &&
        /^\d{5}$/.test(zipValue)
      );
    }

    function runLoadingThenResult() {
      const loadingFrames = [
        "Please wait a moment...",
        "Please wait a moment...<br><br>—",
        "Please wait a moment...<br><br>——",
        "Please wait a moment...<br><br>———",
        "Please wait a moment...<br><br>————"
      ];

      let frameIndex = 0;
      showPopup(loadingFrames[0], "loading");

      const interval = setInterval(() => {
        frameIndex++;
        if (frameIndex < loadingFrames.length) {
          popupMessage.innerHTML = loadingFrames[frameIndex];
        } else {
          clearInterval(interval);

          if (validateInputs()) {
            showPopup("Thank you for your purchase.", "success");
          } else {
            showPopup("Sorry please complete the above requirements.", "error");
          }
        }
      }, 200);
    }

    confirmBtn.addEventListener("click", runLoadingThenResult);

    popupBackdrop.addEventListener("click", function (e) {
      if (e.target === popupBackdrop && popupMode !== "loading") {
        hidePopup();
      }
    });

    popupClose.addEventListener("click", hidePopup);