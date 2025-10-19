// -----------------------------
// Initial Quotes
// -----------------------------
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Inspiration" },
  { text: "Don’t let yesterday take up too much of today.", category: "Motivation" }
];

// -----------------------------
// DOM Elements
// -----------------------------
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categorySelect = document.getElementById("categorySelect");
const addQuoteFormContainer = document.getElementById("addQuoteFormContainer");

// -----------------------------
// Load and Save Quotes (Local Storage)
// -----------------------------
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    try {
      quotes = JSON.parse(storedQuotes);
    } catch (e) {
      console.error("Failed to parse stored quotes:", e);
    }
  }
  populateCategorySelect();
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// -----------------------------
// Populate Category Select Dropdown
// -----------------------------
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

// ✅ Alias for populateCategorySelect
function populateCategories() {
  populateCategorySelect();
}

// -----------------------------
// Create Add Quote Form
// -----------------------------
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

// -----------------------------
// Filter Quotes by Category
// -----------------------------
function filterQuote() {
  const selectedCategory = categorySelect.value;

  return selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());
}

// -----------------------------
// Display Random Quote
// -----------------------------
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

// ✅ Alias for displayRandomQuote
function categoryFilter() {
  displayRandomQuote();
}

// -----------------------------
// Show Last Viewed Quote (Session Storage)
// -----------------------------
function showLastQuoteFromSession() {
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    try {
      const quote = JSON.parse(last);
      quoteDisplay.innerHTML = `"<em>${quote.text}</em>" — <strong>${quote.category}</strong>`;
    } catch (e) {
      console.error("Failed to parse last quote:", e);
    }
  }
}

// -----------------------------
// Add New Quote
// -----------------------------
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

// -----------------------------
// Export Quotes to JSON File
// -----------------------------
function exportQuotesToJson() {
  const json = JSON.stringify(quotes, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// -----------------------------
// Import Quotes from JSON File
// -----------------------------
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error("Invalid format");

      imported.forEach(q => {
        if (q.text && q.category) {
          quotes.push(q);
        }
      });

      saveQuotes();
      populateCategorySelect();
      alert("Quotes imported successfully!");
    } catch (error) {
      alert("Error importing quotes. Ensure the file format is correct.");
    }
  };

  reader.readAsText(file);
}

// -----------------------------
// Initialization
// -----------------------------
loadQuotes();
createAddQuoteForm();
showLastQuoteFromSession();

newQuoteBtn.addEventListener("click", displayRandomQuote);

