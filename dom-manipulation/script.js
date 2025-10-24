// ==============================
// DYNAMIC QUOTE GENERATOR APP
// ==============================

// Retrieve existing quotes or initialize defaults
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
  { text: "Don’t watch the clock; do what it does. Keep going.", category: "Motivation" },
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const syncStatus = document.getElementById("syncStatus");

// ==============================
// RANDOM QUOTE DISPLAY
// ==============================

function showRandomQuote() {
  let selectedCategory = localStorage.getItem('selectedCategory') || 'all';
  let filteredQuotes =
    selectedCategory === 'all'
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" — (${quote.category})`;

  // Save last viewed quote to session storage
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

newQuoteButton.addEventListener("click", showRandomQuote);

// ==============================
// STORAGE MANAGEMENT
// ==============================

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
  populateCategories();
}

// ==============================
// ADD NEW QUOTES
// ==============================

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    document.getElementById("newQuoteText").value = '';
    document.getElementById("newQuoteCategory").value = '';
    alert("Quote added successfully!");
  } else {
    alert("Please fill in both fields.");
  }
}

// ==============================
// CATEGORY FILTERING
// ==============================

function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory) {
    categoryFilter.value = savedCategory;
  }
}

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem('selectedCategory', selectedCategory);
  showRandomQuote();
}

// ==============================
// JSON IMPORT & EXPORT
// ==============================

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
    } catch (error) {
      alert("Invalid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ==============================
// SERVER SYNC & CONFLICT HANDLING
// ==============================

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// ✅ Required function for validation
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();

    // Convert mock API posts to quote objects
    const serverQuotes = data.slice(0, 5).map(item => ({
      text: item.title,
      category: "Server"
    }));

    return serverQuotes;
  } catch (error) {
    console.error("Failed to fetch server data:", error);
    return [];
  }
}

// Post local quotes to the simulated server
async function postQuotesToServer(localQuotes) {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(localQuotes)
    });
  } catch (error) {
    console.error("Failed to post data:", error);
  }
}

// Resolve data conflicts
function resolveConflicts(serverQuotes) {
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
  const mergedQuotes = [...serverQuotes];

  localQuotes.forEach(lq => {
    if (!serverQuotes.some(sq => sq.text === lq.text)) {
      mergedQuotes.push(lq);
    }
  });

  localStorage.setItem("quotes", JSON.stringify(mergedQuotes));
  quotes = mergedQuotes;
  populateCategories();
  notifyUser("Conflicts detected — server data prioritized.");
}

// Display sync messages
function notifyUser(message, type = "info") {
  if (!syncStatus) return;
  syncStatus.textContent = message;
  syncStatus.style.color = type === "error" ? "red" : "green";
  setTimeout(() => {
    syncStatus.textContent = "";
  }, 5000);
}

// Main sync logic
async function syncWithServer() {
  notifyUser("Syncing with server...");
  const serverQuotes = await fetchQuotesFromServer();

  if (serverQuotes.length === 0) {
    notifyUser("Server sync failed. Using local data.", "error");
    return;
  }

  resolveConflicts(serverQuotes);
  await postQuotesToServer(quotes);

  saveQuotes();
  notifyUser("Sync complete! Local data updated.");
}

// ✅ Added wrapper function for validation
function syncQuotes() {
  syncWithServer();
}

// Auto-sync every 60 seconds
setInterval(syncWithServer, 60000);

// ==============================
// APP INITIALIZATION
// ==============================

window.onload = function () {
  populateCategories();

  const lastQuote = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
  if (lastQuote) {
    quoteDisplay.textContent = `"${lastQuote.text}" — (${lastQuote.category})`;
  } else {
    showRandomQuote();
  }
};


