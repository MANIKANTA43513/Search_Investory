// ── DOM references ──
const qInput       = document.getElementById('q');
const categoryInput= document.getElementById('category');
const minInput     = document.getElementById('minPrice');
const maxInput     = document.getElementById('maxPrice');
const statusBar    = document.getElementById('statusBar');
const errorBox     = document.getElementById('errorBox');
const resultsSection = document.getElementById('resultsSection');
const resultCount  = document.getElementById('resultCount');
const resultsBody  = document.getElementById('resultsBody');
const noResults    = document.getElementById('noResults');

// ── Handle Search ──
async function handleSearch() {
  clearUI();
  showStatus('Searching inventory…');

  // Build query string
  const params = new URLSearchParams();
  const q        = qInput.value.trim();
  const category = categoryInput.value.trim();
  const minPrice = minInput.value.trim();
  const maxPrice = maxInput.value.trim();

  if (q)        params.set('q', q);
  if (category) params.set('category', category);
  if (minPrice) params.set('minPrice', minPrice);
  if (maxPrice) params.set('maxPrice', maxPrice);

  try {
    const response = await fetch(`http://localhost:3000/search?${params.toString()}`);
    const data = await response.json();

    hideStatus();

    if (!response.ok) {
      // API returned an error (e.g., invalid price range)
      showError(data.message || 'Something went wrong.');
      return;
    }

    renderResults(data.results, data.count);
  } catch (err) {
    hideStatus();
    showError('Could not reach the server. Make sure the backend is running.');
  }
}

// ── Handle Reset ──
function handleReset() {
  qInput.value = '';
  categoryInput.value = '';
  minInput.value = '';
  maxInput.value = '';
  clearUI();
}

// ── Render Results ──
function renderResults(results, count) {
  if (!results || results.length === 0) {
    noResults.classList.remove('hidden');
    return;
  }

  resultCount.textContent = `${count} item${count !== 1 ? 's' : ''} found`;
  resultsSection.classList.remove('hidden');

  resultsBody.innerHTML = results.map((item, index) => `
    <tr style="animation-delay:${index * 40}ms">
      <td class="id-cell">${String(item.id).padStart(2, '0')}</td>
      <td class="name-cell">${escapeHtml(item.productName)}</td>
      <td><span class="badge ${getBadgeClass(item.category)}">${escapeHtml(item.category)}</span></td>
      <td class="price-cell">$${item.price.toFixed(2)}</td>
      <td class="supplier-cell">${escapeHtml(item.supplier)}</td>
    </tr>
  `).join('');
}

// ── Helpers ──
function getBadgeClass(category) {
  const map = {
    'furniture':   'badge-furniture',
    'electronics': 'badge-electronics',
    'stationery':  'badge-stationery'
  };
  return map[category?.toLowerCase()] || 'badge-default';
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function clearUI() {
  hideStatus();
  hideError();
  resultsSection.classList.add('hidden');
  noResults.classList.add('hidden');
  resultsBody.innerHTML = '';
  resultCount.textContent = '';
}

function showStatus(msg) { statusBar.textContent = msg; statusBar.classList.remove('hidden'); }
function hideStatus()    { statusBar.classList.add('hidden'); }
function showError(msg)  { errorBox.textContent = msg; errorBox.classList.remove('hidden'); }
function hideError()     { errorBox.classList.add('hidden'); }

// ── Allow Enter key to search ──
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleSearch();
});
