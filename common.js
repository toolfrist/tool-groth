// Common JavaScript functions for MultiTools Hub

// Load header and footer dynamically
function loadHeader() {
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-placeholder').innerHTML = data;
      // Initialize Bootstrap dropdowns after loading
      if (typeof bootstrap !== 'undefined') {
        var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
        var dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
          return new bootstrap.Dropdown(dropdownToggleEl);
        });
      }
    })
    .catch(error => console.error('Error loading header:', error));
}

function loadFooter() {
  fetch('footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer-placeholder').innerHTML = data;
    })
    .catch(error => console.error('Error loading footer:', error));
}

// Load header and footer when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('header-placeholder')) {
    loadHeader();
  }
  if (document.getElementById('footer-placeholder')) {
    loadFooter();
  }
  
  // Initialize search functionality if on index page
  if (document.getElementById('mainSearch')) {
    initializeSearch();
  }
});

// Search functionality
function initializeSearch() {
  const searchInput = document.getElementById('mainSearch');
  const headerSearch = document.getElementById('headerSearch');
  
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      performSearch();
    });
  }
  
  if (headerSearch) {
    headerSearch.addEventListener('input', function() {
      performSearch();
    });
  }
}

function performSearch() {
  const searchTerm = (document.getElementById('mainSearch')?.value || 
                     document.getElementById('headerSearch')?.value || '').toLowerCase();
  
  const toolCards = document.querySelectorAll('.tool-card');
  const categorySections = document.querySelectorAll('.category-section');
  
  let hasVisibleTools = false;
  
  toolCards.forEach(card => {
    const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
    const description = card.querySelector('.card-text')?.textContent.toLowerCase() || '';
    
    if (title.includes(searchTerm) || description.includes(searchTerm)) {
      card.closest('.col-md-4, .col-lg-3, .col-sm-6').style.display = '';
      hasVisibleTools = true;
    } else {
      card.closest('.col-md-4, .col-lg-3, .col-sm-6').style.display = 'none';
    }
  });
  
  // Hide/show category sections based on visible tools
  categorySections.forEach(section => {
    const visibleTools = section.querySelectorAll('.tool-card').length > 0 && 
                        Array.from(section.querySelectorAll('.tool-card')).some(card => {
                          const parent = card.closest('.col-md-4, .col-lg-3, .col-sm-6');
                          return parent && parent.style.display !== 'none';
                        });
    
    if (!visibleTools && searchTerm) {
      section.style.display = 'none';
    } else {
      section.style.display = '';
    }
  });
  
  // Show "No results" message if needed
  const noResults = document.getElementById('no-results');
  if (searchTerm && !hasVisibleTools) {
    if (!noResults) {
      const container = document.querySelector('.container');
      const message = document.createElement('div');
      message.id = 'no-results';
      message.className = 'alert alert-info text-center mt-4';
      message.innerHTML = '<h4>No tools found</h4><p>Try searching with different keywords.</p>';
      container.appendChild(message);
    }
  } else if (noResults) {
    noResults.remove();
  }
}

// Copy to clipboard function
function copyToClipboard(text, buttonElement) {
  navigator.clipboard.writeText(text).then(function() {
    const originalText = buttonElement.innerHTML;
    buttonElement.innerHTML = '<i class="bi bi-check"></i> Copied!';
    buttonElement.classList.add('btn-success');
    buttonElement.classList.remove('btn-primary');
    
    setTimeout(function() {
      buttonElement.innerHTML = originalText;
      buttonElement.classList.remove('btn-success');
      buttonElement.classList.add('btn-primary');
    }, 2000);
  }).catch(function(err) {
    console.error('Failed to copy:', err);
    alert('Failed to copy to clipboard');
  });
}

// Download file function
function downloadFile(content, filename, contentType) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Debounce function for search
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Smooth scroll to element
function scrollToElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
