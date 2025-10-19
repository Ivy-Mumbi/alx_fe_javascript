// Initial quotes array
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Inspiration" },
  { text: "Don’t let yesterday take up too much of today.", category: "Motivation" }
];

// Reference to DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteButton");
const categorySelect = document.getElementById("categorySelect");

// Function to display a random quote
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
}

// Function to add a new quote
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (!quoteText || !quoteCategory) {
    alert("Please enter both quote text and category.");
    return;
  }

  // Add to quotes array
  quotes.push({ text: quoteText, category: quoteCategory });

  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Add new category to dropdown if not already present
  const existingCategories = Array.from(categorySelect.options).map(opt => opt.value.toLowerCase());
  if (!existingCategories.includes(quoteCategory.toLowerCase())) {
    const newOption = document.createElement("option");
    newOption.value = quoteCategory;
    newOption.textContent = quoteCategory;
    categorySelect.appendChild(newOption);
  }

  alert("Quote added successfully!");
}

// Attach event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);

// Initial load
showRandomQuote();
