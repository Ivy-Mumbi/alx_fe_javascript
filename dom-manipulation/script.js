// Initial quotes array
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Inspiration" },
  { text: "Don’t let yesterday take up too much of today.", category: "Motivation" }
];

// Reference to DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categorySelect = document.getElementById("categorySelect");
const addQuoteFormContainer = document.getElementById("addQuoteFormContainer");

// ✅ Function to create the Add Quote form dynamically
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
  addButton.innerHTML = "Add Quote";

  // Event listener for the button
  addButton.addEventListener("click", addQuote);

  // Append to container
  addQuoteFormContainer.appendChild(quoteInput);
  addQuoteFormContainer.appendChild(categoryInput);
  addQuoteFormContainer.appendChild(addButton);
}

// ✅ Function: Logic to select a random quote
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

  // Update DOM
  quoteDisplay.innerHTML = `"<em>${quote.text}</em>" — <strong>${quote.category}</strong>`;
}

// ✅ Wrapper
function showRandomQuote() {
  displayRandomQuote();
}

// ✅ Add quote to array and update DOM
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (!quoteText || !quoteCategory) {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text: quoteText, category: quoteCategory });

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  const existingCategories = Array.from(categorySelect.options).map(opt => opt.value.toLowerCase());
  if (!existingCategories.includes(quoteCategory.toLowerCase())) {
    const newOption = document.createElement("option");
    newOption.value = quoteCategory;
    newOption.innerHTML = quoteCategory;
    categorySelect.appendChild(newOption);
  }

  alert("Quote added successfully!");
}

// ✅ Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);

// ✅ On page load
createAddQuoteForm();    // ← Build form dynamically
showRandomQuote();       // ← Display a quote
