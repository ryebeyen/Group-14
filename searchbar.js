const Search = (() => {
  // Config might not need cos selector is hardcoded
  // EDIT: nope still need it 
  const CONFIG = {
    inputSelectors: [
      'input[class="mobile-search"]',
      'input[name="search"]',
      'input[name="q"]',
      'input[id*="search"]',
      'input[placeholder*="search" i]',
    ],
    minQueryLength: 2,
    debounceDelay: 300,       
    maxResults: 10,
    overlayId: "search-overlay",
    activeClass: "search-overlay--active",
  };

  let inputEl = null;
  let overlayEl = null;
  let debounceTimer = null;
  let currentQuery = "";

  async function fetchData(query) {    

    const ACCOUNT_DATA = [
      { title: "frameforge", category: "add later"    },
      { title: "pixelbrew", category: "add later"    },
      { title: "creator001", category: "add later" },
      { title: "atlascollective", category: "add later"  },
      { title: "echoverse", category: "add later"    },
      { title: "urbanflux", category: "add later"    },
      { title: "motiondistrict", category: "add later" },
      { title: "wordhaven", category: "add later"    },
    ];

    const q = query.toLowerCase();
    return ACCOUNT_DATA.filter(
      (item) =>
        item.title.toLowerCase().includes(q));
    }

  // Find input
  function findInput() {
      return searchElement = document.querySelector(".mobile-search");
    }

  // Validate
  const VALIDATION = {

    validate(value) {
      if (!value || value.trim().length === 0) return null; 
      if (value.trim().length < 2)
        return `Enter at least 2 characters.`;
      if (/[<>]/.test(value)) return "Invalid characters detected.";
      return null; 
    },

    setError(message) {
      inputElement.setAttribute("aria-invalid", "true");
      inputElement.classList.add("search-input--error");

      let errElement = document.getElementById("search-error");
      if (!errElement) {
        errElement = document.createElement("span");
        errElement.id = "search-error";
        errElement.setAttribute("role", "alert");
        errElement.className = "search-error-message";
        inputElement.insertAdjacentElement("afterend", errElement);
      }
      errElement.textContent = message;
    },

    clearError() {
      inputElement.removeAttribute("aria-invalid");
      inputElement.classList.remove("search-input--error");
      const errElement = document.getElementById("search-error");
      if (errElement) errElement.textContent = "";
    },
  };

  // Create overlay
  const Overlay = {
    create() {
      if (document.getElementById(searchElement)) return;

      overlayElement = document.createElement("div");
      overlayElement.id = "searchbarOverlay";
      overlayElement.className = "search-overlay";
      overlayElement.setAttribute("role", "listbox");
      overlayElement.setAttribute("aria-label", "Search results");
      overlayElement.style.backgroundColor = "white";
      overlayElement.style.borderRadius = "10px";
      overlayElement.style.padding = "20px";
      overlayElement.style.transform = "translateX(-30px)";
      overlayElement.hidden = true;

      // Position relative to input's nearest positioned ancestor
      const anchor = inputElement.closest("[style*='position'], header, nav, form") || document.body;
      anchor.appendChild(overlayElement);

      // Close on outside click
      document.addEventListener("click", (e) => {
        if (!overlayElement.contains(e.target) && e.target !== inputElement) {
          this.hide();
        }
      });

      // Keyboard navigation
      inputElement.addEventListener("keydown", this.handleKeydown.bind(this));
    },

    show() {
      overlayElement.hidden = false;
      overlayElement.classList.add("search-overlay-active");
      inputElement.setAttribute("aria-expanded", "true");
      this.reposition();
    },

    hide() {
      if (!overlayElement) return;
      overlayElement.hidden = true;
      overlayElement.classList.remove("search-overlay-active");
      inputElement.setAttribute("aria-expanded", "false");
    },

    reposition() {
      const rect = inputElement.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      overlayElement.style.position = "absolute";
      overlayElement.style.top = `${rect.bottom + scrollY}px`;
      overlayElement.style.left = `${rect.left + scrollX}px`;
      overlayElement.style.width = `${Math.max(rect.width, 320)}px`;
    },

    showLoading() {
      this.show();
      overlayElement.innerHTML = `<div class="search-overlay__loading" aria-live="polite">Searching…</div>`;
    },

    showError(message) {
      this.show();
      overlayElement.innerHTML = `<div class="search-overlay__error" role="alert">${escapeHtml(message)}</div>`;
    },

    showEmpty(query) {
      this.show();
      overlayElement.innerHTML = `
        <div class="search-overlay__empty">
          No results for <strong>"${escapeHtml(query)}"</strong>
        </div>`;
    },

    populate(results, query) {
      this.show();

      const limited = results.slice(0, 10);
      const grouped = groupByCategory(limited);

      let html = `<ul class="search-overlay__list" role="listbox">`;

      for (const [category, items] of Object.entries(grouped)) {
        html += `<li style="list-style-type: none;" class="search-overlay__group-label" role="presentation">Accounts for ${escapeHtml(category)}</li>`;
        for (const item of items) {
          html += `
            <li class="search-overlay__item" role="option" tabindex="-1">
              <a class="search-overlay__link" href="profileDAMANI.html">
                <span class="search-overlay__title">${highlight(item.title, query)}</span>
              </a>
            </li>`;
        }
      }

      html += `</ul>`;
      overlayElement.innerHTML = html;
    },

    handleKeydown(e) {
      if (overlayElement.hidden) return;
      const items = Array.from(overlayElement.querySelectorAll(".search-overlay__item"));
      const focused = overlayElement.querySelector(".search-overlay__item--focused");
      let idx = items.indexOf(focused);

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          idx = idx < items.length - 1 ? idx + 1 : 0;
          setFocus(items, idx);
          break;
        case "ArrowUp":
          e.preventDefault();
          idx = idx > 0 ? idx - 1 : items.length - 1;
          setFocus(items, idx);
          break;
        case "Enter":
          if (focused) {
            focused.querySelector("a")?.click();
          }
          break;
        case "Escape":
          this.hide();
          inputEl.focus();
          break;
      }
    },
  };

  // Search handler
  async function handleInput(e) {
    const raw = e.target.value;
    const query = raw.trim();

    // Validate
    const error = VALIDATION.validate(raw);
    if (error) {
      VALIDATION.setError(error);
      Overlay.hide();
      return;
    }
    VALIDATION.clearError();

    // Nothing typed yet
    if (query.length === 0) {
      Overlay.hide();
      currentQuery = "";
      return;
    }

    // Avoid redundant searches
    if (query === currentQuery) return;
    currentQuery = query;

    // Debounce
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      Overlay.showLoading();
      try {
        const results = await fetchData(query);
        if (results.length === 0) {
          Overlay.showEmpty(query);
        } else {
          Overlay.populate(results, query);
        }
      } catch (err) {
        console.error("[Search] Fetch error:", err);
        Overlay.showError("Something went wrong. Please try again.");
      }
    }, 300);
  }

  //Utilities 
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }

  function highlight(text, query) {
    const escaped = escapeHtml(text);
    const safeQ = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return escaped.replace(
      new RegExp(`(${safeQ})`, "gi"),
      '<mark class="search-highlight">$1</mark>'
    );
  }

  function groupByCategory(items) {
    return items.reduce((acc, item) => {
      const cat = item.category || "Results";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});
  }

  function setFocus(items, idx) {
    items.forEach((inputElement) => inputElement.classList.remove("search-overlay__item--focused"));
    if (items[idx]) {
      items[idx].classList.add("search-overlay__item--focused");
      items[idx].querySelector("a")?.focus();
    }
  }

  //Public Init
  function init(options = {}) {
    // Allow callers to override defaults
    Object.assign(CONFIG, options);

    inputElement = findInput();
    if (!inputElement) {
      console.warn("[Search] No search input found. Provide a custom selector via options.inputSelectors.");
      return;
    }

    // Accessibility setup
    inputElement.setAttribute("autocomplete", "off");
    inputElement.setAttribute("aria-autocomplete", "list");
    inputElement.setAttribute("aria-expanded", "false");
    inputElement.setAttribute("aria-controls", "searchbarOverlay");

    Overlay.create();

    inputElement.addEventListener("input", handleInput);
    inputElement.addEventListener("focus", (e) => {
      if (inputElement.value.trim().length >= 2) {
        Overlay.show();
      }
    });

    window.addEventListener("resize", () => {
      if (!overlayElement?.hidden) Overlay.reposition();
    });

    console.info("[Search] Initialized on:", inputElement);
  }

  return { init };
})();

// Auto-init on startup
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => Search.init());
} else {
  Search.init();
}