
const dateParagraph = document.getElementById("current-date");

if (dateParagraph) {
  const today = new Date();
  dateParagraph.textContent = "Today's date: " + today.toDateString();
}


const themeToggleButton = document.getElementById("theme-toggle");

function applySavedTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    if (themeToggleButton) themeToggleButton.textContent = "Light mode";
  } else {
    document.body.classList.remove("dark-theme");
    if (themeToggleButton) themeToggleButton.textContent = "Dark mode";
  }
}

applySavedTheme();

if (themeToggleButton) {
  themeToggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    const isDark = document.body.classList.contains("dark-theme");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeToggleButton.textContent = isDark ? "Light mode" : "Dark mode";
  });
}


if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .then(reg => console.log("Service Worker registered:", reg.scope))
      .catch(err => console.log("Service Worker registration failed:", err));
  });
}
