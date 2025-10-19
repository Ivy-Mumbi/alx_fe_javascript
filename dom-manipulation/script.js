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

// ✅ Function: Logic to select a random quote from array (based on category)
function displayRandomQuote() {
  const selectedCategory = categorySelect.value;

  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<em>No quotes available in this category.</em>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  // ✅ DOM Update using innerHTML with formatting
  quoteDisplay.innerHTML = `"<em>${quote.text}</em>" — <strong>${quote.category}</strong>`;
}

// ✅ Function: Show Random Quote (wrapper for displayRandomQuote)
function showRandomQuote() {
  displayRandomQuote();
}

// ✅ Function: Add new quote to array and update DOM
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  i
