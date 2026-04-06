<script>
    const creators = [
      { key: "frameforge", name: "FrameForge" },
      { key: "pixelbrew", name: "PixelBrew" },
      { key: "creator001", name: "Creator001" },
      { key: "atlascollective", name: "AtlasCollective" },
      { key: "echoverse", name: "Echoverse" },
      { key: "urbanflux", name: "UrbanFlux" },
      { key: "motiondistrict", name: "MotionDistrict" },
      { key: "wordhaven", name: "WordHaven" }
    ];

    const recentCreators = ["frameforge", "pixelbrew"];

    const searchInput = document.getElementById("searchInput");
    const searchOverlay = document.getElementById("searchOverlay");
    const recentResults = document.getElementById("recentResults");
    const suggestionResults = document.getElementById("suggestionResults");
    const cards = document.querySelectorAll(".search-card");

    function buildResultItem(creator, showArrow = false) {
      return `
        <a href="profile.html?creator=${creator.key}" class="overlay-result">
          <span>${creator.name}</span>
          ${showArrow ? '<i class="fa-solid fa-arrow-left overlay-arrow"></i>' : ""}
        </a>
      `;
    }

    function renderOverlayResults(query = "") {
      const trimmedQuery = query.trim().toLowerCase();

      if (trimmedQuery === "") {
        const recentMatches = creators.filter((creator) =>
          recentCreators.includes(creator.key)
        );

        const suggestionMatches = creators.filter(
          (creator) => !recentCreators.includes(creator.key)
        );

        recentResults.innerHTML = recentMatches
          .map((creator) => buildResultItem(creator, true))
          .join("");

        suggestionResults.innerHTML = suggestionMatches
          .map((creator) => buildResultItem(creator, false))
          .join("");
      } else {
        const filtered = creators.filter((creator) =>
          creator.name.toLowerCase().includes(trimmedQuery)
        );

        recentResults.innerHTML = "";
        suggestionResults.innerHTML = filtered
          .map((creator) => buildResultItem(creator, false))
          .join("");

        if (filtered.length === 0) {
          suggestionResults.innerHTML = '<p class="no-results">No matching creators</p>';
        }
      }
    }

    function filterCards(query = "") {
      const trimmedQuery = query.trim().toLowerCase();

      cards.forEach((card) => {
        const creatorName = card.dataset.name.toLowerCase();
        const isMatch = creatorName.includes(trimmedQuery);
        card.style.display = trimmedQuery === "" || isMatch ? "block" : "none";
      });
    }

    function openOverlay() {
      searchOverlay.classList.remove("hidden");
      renderOverlayResults(searchInput.value);
    }

    function closeOverlay() {
      searchOverlay.classList.add("hidden");
    }

    searchInput.addEventListener("focus", function () {
      openOverlay();
    });

    searchInput.addEventListener("input", function () {
      renderOverlayResults(searchInput.value);
      filterCards(searchInput.value);
      openOverlay();
    });

    document.addEventListener("click", function (event) {
      const clickedInsideBar = event.target.closest(".search-bar-row");
      const clickedInsideOverlay = event.target.closest(".search-overlay");

      if (!clickedInsideBar && !clickedInsideOverlay) {
        closeOverlay();
      }
    });
  </script>
