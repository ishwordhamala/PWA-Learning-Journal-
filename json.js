
const API_BASE = "https://ishwor2316248.pythonanywhere.com";
//const API_BASE = "http://127.0.0.1:5000"//
// DOM references
const jsonContainer = document.getElementById("json-reflections");
const jsonCount = document.getElementById("json-count");
const filterInput = document.getElementById("filter-week");
const filterButton = document.getElementById("filter-button");
const clearFilterButton = document.getElementById("clear-filter");


let lastLoadedReflections = [];


async function loadJsonReflections(filterWeek = null) {
  if (!jsonContainer || !jsonCount) return;

  jsonContainer.textContent = "Loading reflections...";

  try {
    let url = `${API_BASE}/api/reflections`;
    if (filterWeek) {
      url += `?week=${encodeURIComponent(filterWeek)}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    lastLoadedReflections = data;

    jsonContainer.innerHTML = "";

    if (data.length === 0) {
      jsonContainer.textContent = "No reflections found.";
      jsonCount.textContent = "";
      return;
    }

    jsonCount.textContent = `Total reflections loaded: ${data.length}`;

    data.forEach((entry, index) => {
      const div = document.createElement("div");
      div.className = "entry";

      const title = document.createElement("h4");
      title.textContent = `Week ${entry.week}: ${entry.title}`;

      const date = document.createElement("small");
      if (entry.date) {
        date.textContent = `Saved on: ${new Date(entry.date).toLocaleString()}`;
      }

      const content = document.createElement("p");
      content.textContent = entry.content;

      // Extra Week 6 feature: delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.type = "button";
      deleteBtn.addEventListener("click", () => {
        deleteReflection(index);
      });

      div.appendChild(title);
      if (entry.date) div.appendChild(date);
      div.appendChild(content);
      div.appendChild(deleteBtn);

      jsonContainer.appendChild(div);
    });
  } catch (error) {
    console.error(error);
    jsonContainer.textContent = "Could not load reflections from backend.";
    jsonCount.textContent = "";
  }
}


async function deleteReflection(index) {
  const confirmDelete = confirm("Are you sure you want to delete this reflection?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`${API_BASE}/api/reflections/${index}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Delete failed");
    }

    loadJsonReflections(filterInput ? filterInput.value : null);
  } catch (error) {
    console.error(error);
    alert("Could not delete the reflection.");
  }
}


document.addEventListener("DOMContentLoaded", () => {
  if (jsonContainer) {
    loadJsonReflections();
  }
});

if (filterButton && filterInput) {
  filterButton.addEventListener("click", () => {
    const weekValue = filterInput.value;
    if (weekValue) {
      loadJsonReflections(weekValue);
    } else {
      loadJsonReflections();
    }
  });
}

if (clearFilterButton && filterInput) {
  clearFilterButton.addEventListener("click", () => {
    filterInput.value = "";
    loadJsonReflections();
  });
}
