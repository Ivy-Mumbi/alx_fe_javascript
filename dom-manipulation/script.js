/* script.js
   - Adds localStorage persistence for quotes
   - sessionStorage used for last viewed quote
   - Implements JSON import/export with validation
*/

const STORAGE_KEY = 'dqg_quotes_v1'; // localStorage key
const LAST_VIEWED_KEY = 'dqg_last_viewed_v1'; // sessionStorage key

// Default starter quotes (only used if none in localStorage)
const starterQuotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Inspiration" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Wisdom" }
];

let quotes = []; // main in-memory array

// DOM refs
const quoteDisplay = document.getElementById('quoteDisplay');
const categorySelect = document.getElementById('categorySelect');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteSection = document.getElementById('addQuoteSection');
const exportBtn = document.getElementById('exportJson');
const importFileInput = document.getElementById('importFile');
const showAllBtn = document.getElementById('showAll');

// --- Initialization ---
function init() {
  loadQuotesFromStorage();
  populateCategories();
  createAddQuoteForm();
  attachEventListeners();
  restoreLastViewedQuote();
}

// --- Storage helpers ---
function saveQuotesToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
  } catch (err) {
    console.error('Failed to save quotes to localStorage:', err);
  }
}

function loadQuotesFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Validate items loosely: objects with text + category
        quotes = parsed.filter(q => q && typeof q.text === 'string' && typeof q.category === 'string');
        return;
      }
    }
  } catch (err) {
    console.warn('Could not parse stored quotes, falling back to defaults.', err);
  }
  // fallback
  quotes = [...starterQuotes];
  saveQuotesToLocalStorage();
}

function saveLastViewedToSession(quoteObj) {
  try {
    sessionStorage.setItem(LAST_VIEWED_KEY, JSON.stringify(quoteObj));
  } catch (err) {
    console.warn('Could not save last viewed quote to sessionStorage', err);
  }
}

function getLastViewedFromSession() {
  try {
    const raw = sessionStorage.getItem(LAST_VIEWED_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

// --- UI population ---
function populateCategories() {
  const uniqueCats = [...new Set(quotes.map(q => q.category))].sort((a,b)=> a.localeCompare(b));
  // If no categories (shouldn't happen), show a placeholder
  categorySelect.innerHTML = '';
  if (uniqueCats.length === 0) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = '-- no categories --';
    categorySelect.appendChild(opt);
    return;
  }
  uniqueCats.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });
}

// --- Quote display ---
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filtered = selectedCategory ? quotes.filter(q => q.category === selectedCategory) : quotes.slice();
  if (filtered.length === 0) {
    quoteDisplay.textContent = 'No quotes found for this category.';
    return;
  }
  const idx = Math.floor(Math.random() * filtered.length);
  const q = filtered[idx];
  quoteDisplay.textContent = `"${q.text}" — ${q.category}`;
  saveLastViewedToSession(q);
}

function showAllQuotes() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = 'No quotes available.';
    return;
  }
  // Display all in a single scrollable block (simple approach)
  const wrapper = document.createElement('div');
  wrapper.style.textAlign = 'left';
  wrapper.style.maxHeight = '260px';
  wrapper.style.overflowY = 'auto';
  wrapper.style.width = '100%';
  wrapper.style.boxSizing = 'border-box';

  quotes.forEach((q, i) => {
    const p = document.createElement('p');
    p.style.margin = '10px 0';
    p.textContent = `${i+1}. "${q.text}" — ${q.category}`;
    wrapper.appendChild(p);
  });

  quoteDisplay.innerHTML = '';
  quoteDisplay.appendChild(wrapper);
}

// --- Add Quote Form (created dynamically) ---
function createAddQuoteForm() {
  const container = document.createElement('div');

  const quoteInput = document.createElement('input');
  quoteInput.id = 'newQuoteText';
  quoteInput.type = 'text';
  quoteInput.placeholder = 'Enter a new quote';
  quoteInput.style.width = '40%';

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.type = 'text';
  categoryInput.placeholder = 'Enter quote category';
  categoryInput.style.width = '20%';

  const addBtn = document.createElement('button');
  addBtn.textContent = 'Add Quote';
  addBtn.addEventListener('click', addQuote);

  container.appendChild(quoteInput);
  container.appendChild(categoryInput);
  container.appendChild(addBtn);

  addQuoteSection.appendChild(container);
}

// --- Add quote logic ---
function addQuote() {
  const textEl = document.getElementById('newQuoteText');
  const catEl = document.getElementById('newQuoteCategory');
  const newText = (textEl.value || '').trim();
  const newCategory = (catEl.value || '').trim();

  if (!newText || !newCategory) {
    alert('Please provide both quote text and category.');
    return;
  }

  const newObj = { text: newText, category: newCategory };
  // Prevent exact duplicate (text + category)
  const exists = quotes.some(q => q.text === newObj.text && q.category === newObj.category);
  if (exists) {
    alert('This exact quote already exists.');
    return;
  }

  quotes.push(newObj);
  saveQuotesToLocalStorage();
  populateCategories();
  textEl.value = '';
  catEl.value = '';

  alert('Quote added and saved locally.');
}

// --- JSON Export ---
function exportQuotesAsJson() {
  try {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const now = new Date();
    const fname = `quotes_export_${now.toISOString().slice(0,19).replace(/[:T]/g,'-')}.json`;

    const a = document.createElement('a');
    a.href = url;
    a.download = fname;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Export failed', err);
    alert('Could not export quotes. See console for details.');
  }
}

// --- JSON Import ---
function importFromJsonFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onerror = () => {
    alert('Failed to read file.');
  };
  reader.onload = (evt) => {
    try {
      const content = evt.target.result;
      const parsed = JSON.parse(content);
      if (!Array.isArray(parsed)) {
        alert('Invalid format: JSON root must be an array of quote objects.');
        return;
      }

      // Normalize and validate incoming items
      const valid = parsed
        .filter(item => item && typeof item.text === 'string' && typeof item.category === 'string')
        .map(item => ({ text: item.text.trim(), category: item.category.trim() }));

      if (valid.length === 0) {
        alert('No valid quotes found in the file.');
        return;
      }

      // Merge: add only unique (text+category) items
      let added = 0;
      valid.forEach(inQ => {
        const exists = quotes.some(q => q.text === inQ.text && q.category === inQ.category);
        if (!exists) {
          quotes.push(inQ);
          added++;
        }
      });

      if (added > 0) {
        saveQuotesToLocalStorage();
        populateCategories();
      }

      alert(`Import complete. ${added} new quote(s) added.`);
    } catch (err) {
      console.error('Error parsing import file:', err);
      alert('Failed to parse JSON file. Ensure it is valid JSON and matches the expected structure.');
    } finally {
      importFileInput.value = ''; // reset file input
    }
  };

  reader.readAsText(file);
}

// --- Event wiring ---
function attachEventListeners() {
  newQuoteBtn.addEventListener('click', showRandomQuote);
  exportBtn.addEventListener('click', exportQuotesAsJson);
  importFileInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) importFromJsonFile(file);
  });
  showAllBtn.addEventListener('click', showAllQuotes);
}

// --- Restore last viewed (sessionStorage) ---
function restoreLastViewedQuote() {
  const last = getLastViewedFromSession();
  if (last && last.text && last.category) {
    quoteDisplay.textContent = `Last viewed: "${last.text}" — ${last.category}`;
  } else {
    quoteDisplay.textContent = 'Click “Show New Quote” to begin — or add/import quotes.';
  }
}

// --- Run ---
init();
