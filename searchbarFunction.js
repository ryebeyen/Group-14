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

/* mobile search */
const searchInput = document.getElementById("searchInput");
const searchOverlay = document.getElementById("searchOverlay");
const recentResults = document.getElementById("recentResults");
const suggestionResults = document.getElementById("suggestionResults");
const cards = document.querySelectorAll(".search-card");

/* desktop search */
const desktopSearchInput = document.getElementById("desktopSearchInput");
const desktopSearchOverlay = document.getElementById("desktopSearchOverlay");
const desktopRecentResults = document.getElementById("desktopRecentResults");
const desktopSuggestionResults = document.getElementById("desktopSuggestionResults");

/* desktop bell */
const desktopBellBtn = document.getElementById("desktopBellBtn");
const desktopNotificationOverlay = document.getElementById("desktopNotificationOverlay");

function buildResultItem(creator, showArrow = false) {
  return `
    <a href="profile.html?creator=${creator.key}" class="overlay-result">
      <span>${creator.name}</span>
      ${showArrow ? '<i class="fa-solid fa-arrow-left overlay-arrow"></i>' : ""}
    </a>
  `;
}

function renderOverlayResults(query = "", recentContainer, suggestionContainer) {
  if (!recentContainer || !suggestionContainer) return;

  const trimmedQuery = query.trim().toLowerCase();

  if (trimmedQuery === "") {
    const recentMatches = creators.filter((creator) =>
      recentCreators.includes(creator.key)
    );

    const suggestionMatches = creators.filter(
      (creator) => !recentCreators.includes(creator.key)
    );

    recentContainer.innerHTML = recentMatches
      .map((creator) => buildResultItem(creator, true))
      .join("");

    suggestionContainer.innerHTML = suggestionMatches
      .map((creator) => buildResultItem(creator, false))
      .join("");
  } else {
    const filtered = creators.filter((creator) =>
      creator.name.toLowerCase().includes(trimmedQuery)
    );

    recentContainer.innerHTML = "";

    if (filtered.length === 0) {
      suggestionContainer.innerHTML =
        '<p class="no-results">No matching creators</p>';
    } else {
      suggestionContainer.innerHTML = filtered
        .map((creator) => buildResultItem(creator, false))
        .join("");
    }
  }
}

function filterCards(query = "") {
  if (!cards.length) return;

  const trimmedQuery = query.trim().toLowerCase();

  cards.forEach((card) => {
    const creatorName = card.dataset.name.toLowerCase();
    const isMatch = creatorName.includes(trimmedQuery);
    card.style.display = trimmedQuery === "" || isMatch ? "block" : "none";
  });
}

function openOverlay(overlay, input, recentContainer, suggestionContainer) {
  if (!overlay || !input) return;
  overlay.classList.remove("hidden");
  renderOverlayResults(input.value, recentContainer, suggestionContainer);
}

function closeOverlay(overlay) {
  if (!overlay) return;
  overlay.classList.add("hidden");
}

/* mobile search events */
if (searchInput && searchOverlay) {
  searchInput.addEventListener("focus", function () {
    openOverlay(searchOverlay, searchInput, recentResults, suggestionResults);
  });

  searchInput.addEventListener("input", function () {
    renderOverlayResults(searchInput.value, recentResults, suggestionResults);
    filterCards(searchInput.value);
    openOverlay(searchOverlay, searchInput, recentResults, suggestionResults);
  });
}

/* desktop search events */
if (desktopSearchInput && desktopSearchOverlay) {
  desktopSearchInput.addEventListener("focus", function () {
    openOverlay(
      desktopSearchOverlay,
      desktopSearchInput,
      desktopRecentResults,
      desktopSuggestionResults
    );
  });

  desktopSearchInput.addEventListener("input", function () {
    renderOverlayResults(
      desktopSearchInput.value,
      desktopRecentResults,
      desktopSuggestionResults
    );

    openOverlay(
      desktopSearchOverlay,
      desktopSearchInput,
      desktopRecentResults,
      desktopSuggestionResults
    );
  });
}

/* notification bell */
if (desktopBellBtn && desktopNotificationOverlay) {
  desktopBellBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    desktopNotificationOverlay.classList.toggle("hidden");
  });
}

/* click outside */
document.addEventListener("click", function (event) {
  const clickedInsideBar = event.target.closest(".search-bar-row");
  const clickedInsideOverlay = event.target.closest(".search-overlay");

  const clickedInsideDesktopSearch = event.target.closest(".desktop-search-wrapper");
  const clickedInsideDesktopOverlay = event.target.closest(".desktop-search-overlay");

  const clickedInsideBell = event.target.closest("#desktopBellBtn");
  const clickedInsideNotificationOverlay = event.target.closest("#desktopNotificationOverlay");

  if (!clickedInsideBar && !clickedInsideOverlay) {
    closeOverlay(searchOverlay);
  }

  if (!clickedInsideDesktopSearch && !clickedInsideDesktopOverlay) {
    closeOverlay(desktopSearchOverlay);
  }

  if (
    desktopNotificationOverlay &&
    !clickedInsideBell &&
    !clickedInsideNotificationOverlay
  ) {
    desktopNotificationOverlay.classList.add("hidden");
  }
});
