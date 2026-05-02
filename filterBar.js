const ACCOUNT_DATA = [
    { title: "frameforge", category: "film"    },
    { title: "pixelbrew", category: "art"    },
    { title: "creator001", category: "music" },
    { title: "atlascollective", category: "travel"  },
    { title: "echoverse", category: "music"    },
    { title: "urbanflux", category: "fashion"    },
    { title: "motiondistrict", category: "film" },
    { title: "wordhaven", category: "music"    },
];

const resultContainer= document.querySelector(".website-home");

function filterItems(category) {
  const items = document.querySelectorAll("[data-category]");
  items.forEach(item => {
    const match = category === "all" || item.dataset.category === category;
    item.style.display = match ? "block" : "none";
  });
}

const filterButtons = document.querySelectorAll("[data-filter]");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    filterItems(button.dataset.filter);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  filterItems("all");
});





