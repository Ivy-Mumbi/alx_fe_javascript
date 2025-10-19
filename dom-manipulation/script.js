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
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  // ✅ DOM Update
  quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
}

// ✅ Function: Show Random Quote (wrapper for displayRandomQuote)
function showRandomQuote() {
  displayRandomQuote();
}

// ✅ Function: Add new quote to array and update DOM
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (!quoteText || !quoteCategory) {
    alert("Please enter both quote text and category.");
    return;
  }

  // ✅ Add quote to the quotes array
  quotes.push({ text: quoteText, category: quoteCategory });

  // ✅ Clear form inputs
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // ✅ Update category dropdown dynamically if new
  const existingCategories = Array.from(categorySelect.options).map(opt => opt.value.toLowerCase());
  if (!existingCategories.includes(quoteCategory.toLowerCase())) {
    const newOption = document.createElement("option");
    newOption.value = quoteCategory;
    newOption.textContent = quoteCategory;
    categorySelect.appendChild(newOption);
  }

  alert("Quote added successfully!");
}

// ✅ Event listener: Trigger quote display on button click
newQuoteBtn.addEventListener("click", showRandomQuote);

// ✅ Event listener: Trigger quote addition on form button click
addQuoteBtn.addEventListener("click", addQuote);

// ✅ Initial quote display on load
showRandomQuote();

