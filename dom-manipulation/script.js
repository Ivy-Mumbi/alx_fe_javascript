// Retrieve existing quotes or initialize default ones
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
  { text: "Don’t watch the clock; do what it does. Keep going.", category: "Motivation" },
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

// Show random quote (filtered by category if selected)
function showRandomQuote() {
  let selectedCategory = localStorage.getItem('selectedCategory') || 'all';
  let filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(q => q.category === selectedCategory);
  
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" — (${quote.category})`;

  // Save last viewed quote to sessionStorage
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

newQuoteButton.addEventListener("click", showRandomQuote);

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
  populateCategories(); // refresh categories if new added
}

// Add new quote dynamically
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

// Populate category dropdown dynamically
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category from localStorage
  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory) {
    categoryFilter.value = savedCategory;
  }
}

// Filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem('selectedCategory', selectedCategory);
  showRandomQuote();
}

// JSON export
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

// JSON import
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

// On page load
window.onload = function () {
  populateCategories();

  // Restore last viewed quote (from session)
  const lastQuote = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
  if (lastQuote) {
    quoteDisplay.textContent = `"${lastQuote.text}" — (${lastQuote.category})`;
  } else {
    showRandomQuote();
  }
};
