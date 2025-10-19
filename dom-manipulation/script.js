// -- Existing quotes and DOM references --
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Inspiration" },
  { text: "Don’t let yesterday take up too much of today.", category: "Motivation" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categorySelect = document.getElementById("categorySelect");
const addQuoteFormContainer = document.getElementById("addQuoteFormContainer");
const syncNotification = document.getElementById("syncNotification");
const manualSyncBtn = document.getElementById("manualSyncBtn");

// -- Local Storage Load & Save --
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    try {
      quotes = JSON.parse(storedQuotes);
    } catch (e) {
      console.error("Error parsing quotes from localStorage:", e);
    }
  }
  populateCategorySelect();
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// -- Category Select Population --
function populateCategorySelect() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categorySelect.innerHTML = '<option value="all">All</option>';
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}
function populateCategories() { populateCategorySelect(); }

// -- Create Add Quote Form --
function createAddQuoteForm() {
  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";
  quoteInput.style.marginRight = "10px";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";
  categoryInput.style.marginRight = "10px";

  const addButton = document.createElement("button");
  addButton.id = "addQuoteButton";
  addButton.textContent = "Add Quote";

  addButton.addEventListener("click", addQuote);

  addQuoteFormContainer.appendChild(quoteInput);
  addQuoteFormContainer.appendChild(categoryInput);
  addQuoteFormContainer.appendChild(addButton);
}

// -- Filter Quotes by Category --
function filterQuote() {
  const selectedCategory = categorySelect.value;
  return selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());
}

// -- Display Random Quote --
function displayRandomQuote() {
  const filteredQuotes = filterQuote();
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<em>No quotes available in this category.</em>";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `"<em>${quote.text}</em>" — <strong>${quote.category}</strong>`;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}
function categoryFilter() { displayRandomQuote(); }

// -- Show Last Viewed Quote --
function showLastQuoteFromSession() {
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    try {
      const quote = JSON.parse(last);
      quoteDisplay.innerHTML = `"<em>${quote.text}</em>" — <strong>${quote.category}</strong>`;
    } catch (e) {
      console.error("Error parsing last quote:", e);
    }
  }
}

// -- Add New Quote --
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategorySelect();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added successfully!");
}

// -- Export / Import JSON (existing code omitted here for brevity) --
// You can keep your existing exportQuotesToJson() and importFromJsonFile() functions here.

// -----------------------
// -- SIMULATED SERVER SYNC --
// -----------------------

// Mock server URL (replace with real URL if available)
const SERVER_URL = "https://my-json-server.typicode.com/typicode/demo/posts"; 
// NOTE: The above URL is just a placeholder and won't really store quotes.

// Helper: simulate fetching quotes from server
async function fetchQuotesFromServer() {
  // Simulate server GET request for quotes data
  // Replace with actual API call in production
  // Here we simulate with a Promise of a static array after delay:
  return new Promise(resolve => {
    setTimeout(() => {
      // Example server data (could be different from local)
      const serverData = [
        { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
        { text: "New server quote example!", category: "Server" }
      ];
      resolve(serverData);
    }, 1000);
  });
}

// Sync local quotes with server, server data takes precedence
async function syncWithServer(showNotification = true) {
  try {
    const serverQuotes = await fetchQuotesFromServer();

    // Merge local quotes with server quotes
    // Server quotes take precedence, so remove any local duplicates matching server
    const merged = [...serverQuotes];

    quotes.forEach(localQuote => {
      // Check if localQuote exists in serverQuotes (by text+category)
      const existsOnServer = serverQuotes.some(sq => 
        sq.text === localQuote.text && sq.category === localQuote.category
      );
      if (!existsOnServer) {
        merged.push(localQuote);
      }
    });

    // Check if quotes changed
    const localString = JSON.stringify(quotes);
    const mergedString = JSON.stringify(merged);

    if (localString !== mergedString) {
      quotes = merged;
      saveQuotes();
      populateCategorySelect();
      if (showNotification) showSyncNotification("Quotes updated from server.");
    } else {
      if (showNotification) showSyncNotification("No updates from server.");
    }
  } catch (error) {
    console.error("Error syncing with server:", error);
    if (showNotification) showSyncNotification("Failed to sync with server.", true);
  }
}

// Display sync notification messages
let notificationTimeout;
function showSyncNotification(message, isError = false) {
  clearTimeout(notificationTimeout);
  syncNotification.textContent = message;
  syncNotification.style.color = isError ? "red" : "green";
  syncNotification.style.display = "block";
  notificationTimeout = setTimeout(() => {
    syncNotification.style.display = "none";
  }, 5000);
}

// Periodic sync every 30 seconds
setInterval(() => {
  syncWithServer(false);
}, 30000);

// Manual sync button listener
manualSyncBtn.addEventListener("click", () => {
  syncWithServer();
});

// --------------------
// Initialization
// --------------------
loadQuotes();
createAddQuoteForm();
showLastQuoteFromSession();
newQuoteBtn.addEventListener("click", displayRandomQuote);

// Start with initial sync
syncWithServer(false);

