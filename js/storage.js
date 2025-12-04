
const JOURNAL_STORAGE_KEY = "journalEntries";

// Retrieve entries
function getStoredEntries() {
  const raw = localStorage.getItem(JOURNAL_STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Save entries
function setStoredEntries(entries) {
  localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries));
}


function renderEntries() {
  const container = document.getElementById("saved-entries");
  if (!container) return;

  const entries = getStoredEntries();
  container.innerHTML = "";

  if (entries.length === 0) {
    container.textContent = "No saved entries yet.";
    return;
  }

  entries.forEach((entry) => {
    const div = document.createElement("div");
    div.className = "entry";

    const title = document.createElement("h4");
    title.textContent = `Week ${entry.week}: ${entry.title}`;

    const date = document.createElement("small");
    date.textContent = `Saved on: ${new Date(entry.date).toLocaleString()}`;

    const content = document.createElement("p");
    content.textContent = entry.content;

    div.appendChild(title);
    div.appendChild(date);
    div.appendChild(content);

    container.appendChild(div);
  });
}


function saveJournalEntry(entry) {
  const entries = getStoredEntries();
  entries.push(entry);
  setStoredEntries(entries);
  renderEntries();
}

document.addEventListener("DOMContentLoaded", renderEntries);
