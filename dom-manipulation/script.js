// -----------------------------
// Quotes Data
// -----------------------------
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Inspiration" },
  { text: "Don’t let yesterday take up too much of today.", category: "Motivation" }
];

// -----------------------------
// DOM References
// -----------------------------
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categorySelect = document.getElementById("categorySelect");
const addQuoteFormContainer = document.getElementById("addQuoteFormContainer");

// -----------------------------
// Load & Save Quotes (Local Storage)
// -----------------------------
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    quotes = JSON.parse(stored);
  }
  populateCategorySelect();
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// -----------------------------
// Populate Category Dropdown
// -----------------------------
function populateCategorySelect() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categorySelect.innerHTML = '<option value="all">All</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

// -----------------------------
// Create Add Quote Form Dynamically
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
// Display Random Quote
// -----------------------------
function displayRandomQuote() {
  const selectedCategory = categorySelect.value;

  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "<em>No quotes available in this category.</em>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const quote = filtered[randomIndex];

  // Display
  quoteDisplay.innerHTML = `"<em>${quote.text}</em>" — <strong>${quote.category}</strong>`;

  // Save to sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// -----------------------------
// Show Last Quote from Session Storage
// -----------------------------
function showLastQuoteFromSession() {
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const quote = JSON.parse(last);
    quoteDisplay.innerHTML = `"<em>${quote.text}</em>" — <strong>${quote.category}</strong>`;
  }
}

// -----------------------------
// Add Quote
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
// Export to JSON
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
// Import from JSON
// -----------------------------
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error("Invalid file structure");

      imported.forEach(q => {
        if (q.text && q.category) quotes.push(q);
      });

      saveQuotes();
      populateCategorySelect();
      alert("Quotes imported successfully!");
    } catch (error) {
      alert("Error importing JSON file. Please check the format.");
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

