// Application State
const appData = {
  companies: [
    {"name": "Tata Consultancy Services", "ticker": "TCS", "price": 3022.30, "target": 5200, "pe": 22.19, "roe": 51.24, "growth": 6.17, "mcap": 1093350, "recommendation": "Strong Buy", "upside": 72.1, "risk": "Low"},
    {"name": "Infosys", "ticker": "INFY", "price": 1447.70, "target": 1650, "pe": 22.05, "roe": 28.72, "growth": 5.94, "mcap": 601310, "recommendation": "Buy", "upside": 14.0, "risk": "Low"},
    {"name": "HCL Technologies", "ticker": "HCLTECH", "price": 1489.80, "target": 1720, "pe": 23.80, "roe": 23.01, "growth": 8.17, "mcap": 404282, "recommendation": "Buy", "upside": 15.4, "risk": "Medium"},
    {"name": "Wipro", "ticker": "WIPRO", "price": 246.81, "target": 385, "pe": 19.22, "roe": 14.88, "growth": 0.78, "mcap": 258710, "recommendation": "Strong Buy", "upside": 56.0, "risk": "Medium"},
    {"name": "LTIMindtree", "ticker": "LTIM", "price": 5108.00, "target": 4500, "pe": 32.08, "roe": 22.89, "growth": 7.63, "mcap": 151376, "recommendation": "Hold", "upside": -11.9, "risk": "Medium"},
    {"name": "Tech Mahindra", "ticker": "TECHM", "price": 1486.70, "target": 1200, "pe": 32.05, "roe": 8.83, "growth": 2.66, "mcap": 145569, "recommendation": "Sell", "upside": -19.3, "risk": "High"}
  ],
  market_segments: [
    {"segment": "BFSI", "share": 32.5, "growth": 8.5, "risk": "Medium"},
    {"segment": "Manufacturing & Hi-tech", "share": 18.2, "growth": 12.3, "risk": "Low"},
    {"segment": "Healthcare & Life Sciences", "share": 12.8, "growth": 15.2, "risk": "Low"},
    {"segment": "Retail & CPG", "share": 11.4, "growth": 9.8, "risk": "Medium"},
    {"segment": "Energy & Utilities", "share": 8.7, "growth": 7.2, "risk": "High"},
    {"segment": "Others", "share": 16.4, "growth": 10.1, "risk": "Medium"}
  ],
  dcf_scenarios: [
    {"company": "TCS", "conservative": 4236.83, "base_case": 5348.43, "aggressive": 6903.33},
    {"company": "INFY", "conservative": 1219.65, "base_case": 1395.96, "aggressive": 1596.10},
    {"company": "HCLTECH", "conservative": 1347.95, "base_case": 1564.36, "aggressive": 1813.76},
    {"company": "WIPRO", "conservative": 348.28, "base_case": 370.87, "aggressive": 394.82}
  ]
};

// Global variables
let charts = {};
let currentFilter = {
  cap: 'all',
  recommendation: 'all',
  sortBy: 'mcap'
};

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

function initializeApp() {
  console.log('Starting IT Sector Analysis Platform initialization...');
  
  try {
    // Initialize all components with error handling
    setupNavigation();
    setupThemeToggle();
    setupExportButton();
    populateCompaniesGrid();
    populateValuationTable();
    populateRecommendationsTable();
    
    // Setup filters and charts with delay to ensure DOM is ready
    setTimeout(() => {
      setupFilters();
      initializeCharts();
    }, 100);
    
    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Error during initialization:', error);
  }
}

// Navigation functionality with improved error handling
function setupNavigation() {
  console.log('Setting up navigation system...');
  
  try {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    
    if (!navButtons.length) {
      console.error('No navigation buttons found!');
      return;
    }
    
    if (!sections.length) {
      console.error('No sections found!');
      return;
    }
    
    console.log(`Found ${navButtons.length} nav buttons and ${sections.length} sections`);
    
    // Remove any existing event listeners and add new ones
    navButtons.forEach((button, index) => {
      const targetSection = button.getAttribute('data-section');
      console.log(`Setting up nav button ${index}: ${targetSection}`);
      
      // Clone the button to remove any existing event listeners
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      
      // Add click event listener
      newButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Navigation clicked:', targetSection);
        
        try {
          // Update active nav button
          document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
          });
          this.classList.add('active');
          
          // Update active section
          document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active', 'fade-in');
          });
          
          const targetSectionElement = document.getElementById(targetSection);
          if (targetSectionElement) {
            targetSectionElement.classList.add('active', 'fade-in');
            console.log('Successfully activated section:', targetSection);
            
            // Initialize charts for the active section
            setTimeout(() => initializeSectionCharts(targetSection), 100);
          } else {
            console.error('Target section element not found:', targetSection);
          }
        } catch (navError) {
          console.error('Error during navigation:', navError);
        }
      });
    });
    
    console.log('Navigation setup completed successfully');
  } catch (error) {
    console.error('Error setting up navigation:', error);
  }
}

// Theme toggle with improved error handling
function setupThemeToggle() {
  console.log('Setting up theme toggle...');
  
  try {
    const themeToggle = document.getElementById('themeToggle');
    
    if (!themeToggle) {
      console.error('Theme toggle button not found');
      return;
    }
    
    const html = document.documentElement;
    
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-color-scheme', savedTheme);
    console.log('Initial theme set to:', savedTheme);
    
    // Remove any existing event listeners
    const newThemeToggle = themeToggle.cloneNode(true);
    themeToggle.parentNode.replaceChild(newThemeToggle, themeToggle);
    
    // Add click event listener
    newThemeToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('Theme toggle clicked');
      
      try {
        const currentTheme = html.getAttribute('data-color-scheme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-color-scheme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        console.log('Theme changed from', currentTheme, 'to', newTheme);
        
        // Recreate charts with new theme colors
        setTimeout(() => {
          Object.keys(charts).forEach(chartId => {
            if (charts[chartId]) {
              charts[chartId].destroy();
              delete charts[chartId];
            }
          });
          initializeCharts();
        }, 100);
      } catch (themeError) {
        console.error('Error changing theme:', themeError);
      }
    });
    
    console.log('Theme toggle setup completed');
  } catch (error) {
    console.error('Error setting up theme toggle:', error);
  }
}

// Export functionality with improved error handling
function setupExportButton() {
  console.log('Setting up export functionality...');
  
  try {
    const exportBtn = document.getElementById('exportBtn');
    
    if (!exportBtn) {
      console.error('Export button not found');
      return;
    }
    
    // Remove any existing event listeners
    const newExportBtn = exportBtn.cloneNode(true);
    exportBtn.parentNode.replaceChild(newExportBtn, exportBtn);
    
    // Add click event listener
    newExportBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('Export button clicked');
      
      try {
        const exportData = {
          report_date: new Date().toISOString().split('T')[0],
          analyst: "Survesh Bajpai",
          companies: appData.companies,
          recommendations: getRecommendationsSummary(),
          market_segments: appData.market_segments,
          dcf_analysis: appData.dcf_scenarios,
          sector_metrics: {
            total_companies: appData.companies.length,
            total_market_cap: appData.companies.reduce((sum, c) => sum + c.mcap, 0),
            avg_pe: appData.companies.reduce((sum, c) => sum + c.pe, 0) / appData.companies.length,
            avg_roe: appData.companies.reduce((sum, c) => sum + c.roe, 0) / appData.companies.length
          }
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const fileName = `IT_Sector_Analysis_${new Date().toISOString().split('T')[0]}.json`;
        
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        
        console.log('Export completed successfully');
        
        // Show success message
        alert('Report exported successfully!');
        
      } catch (exportError) {
        console.error('Error during export:', exportError);
        alert('Export failed. Please try again.');
      }
    });
    
    console.log('Export button setup completed');
  } catch (error) {
    console.error('Error setting up export button:', error);
  }
}

// Filter functionality
function setupFilters() {
  console.log('Setting up filter controls...');
  
  try {
    const capFilter = document.getElementById('capFilter');
    const recFilter = document.getElementById('recFilter');
    const sortBy = document.getElementById('sortBy');
    
    if (capFilter) {
      capFilter.addEventListener('change', (e) => {
        console.log('Market cap filter changed to:', e.target.value);
        currentFilter.cap = e.target.value;
        populateCompaniesGrid();
      });
    }
    
    if (recFilter) {
      recFilter.addEventListener('change', (e) => {
        console.log('Recommendation filter changed to:', e.target.value);
        currentFilter.recommendation = e.target.value;
        populateCompaniesGrid();
      });
    }
    
    if (sortBy) {
      sortBy.addEventListener('change', (e) => {
        console.log('Sort by changed to:', e.target.value);
        currentFilter.sortBy = e.target.value;
        populateCompaniesGrid();
      });
    }
    
    console.log('Filter controls setup completed');
  } catch (error) {
    console.error('Error setting up filters:', error);
  }
}

// Utility functions
function formatCurrency(amount, currency = '₹') {
  if (typeof amount !== 'number' || isNaN(amount)) return 'N/A';
  return `${currency}${amount.toLocaleString('en-IN', {maximumFractionDigits: 2})}`;
}

function formatPercent(value) {
  if (typeof value !== 'number' || isNaN(value)) return 'N/A';
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
}

function getMarketCapCategory(mcap) {
  if (mcap >= 200000) return 'large';
  if (mcap >= 50000) return 'mid';
  return 'small';
}

function getRecommendationClass(recommendation) {
  return recommendation.toLowerCase().replace(' ', '-');
}

function getRecommendationsSummary() {
  const summary = {};
  appData.companies.forEach(company => {
    if (!summary[company.recommendation]) {
      summary[company.recommendation] = 0;
    }
    summary[company.recommendation]++;
  });
  return summary;
}

// Data population functions
function populateCompaniesGrid() {
  console.log('Populating companies grid...');
  
  try {
    const grid = document.getElementById('companiesGrid');
    if (!grid) {
      console.error('Companies grid element not found');
      return;
    }
    
    let filteredCompanies = [...appData.companies];
    
    // Apply filters
    if (currentFilter.cap !== 'all') {
      filteredCompanies = filteredCompanies.filter(company => 
        getMarketCapCategory(company.mcap) === currentFilter.cap
      );
    }
    
    if (currentFilter.recommendation !== 'all') {
      filteredCompanies = filteredCompanies.filter(company => 
        company.recommendation === currentFilter.recommendation
      );
    }
    
    // Apply sorting
    filteredCompanies.sort((a, b) => {
      switch (currentFilter.sortBy) {
        case 'mcap': return b.mcap - a.mcap;
        case 'upside': return b.upside - a.upside;
        case 'pe': return a.pe - b.pe;
        case 'roe': return b.roe - a.roe;
        case 'growth': return b.growth - a.growth;
        default: return b.mcap - a.mcap;
      }
    });
    
    grid.innerHTML = filteredCompanies.map(company => `
      <div class="company-card">
        <div class="company-header">
          <div>
            <div class="company-name">${company.name}</div>
            <div class="company-ticker">${company.ticker}</div>
          </div>
          <div class="company-recommendation ${getRecommendationClass(company.recommendation)}">
            ${company.recommendation}
          </div>
        </div>
        
        <div class="company-metrics">
          <div class="metric">
            <div class="metric-label">Market Cap</div>
            <div class="metric-value-item">${formatCurrency(company.mcap)} Cr</div>
          </div>
          <div class="metric">
            <div class="metric-label">PE Ratio</div>
            <div class="metric-value-item">${company.pe.toFixed(1)}x</div>
          </div>
          <div class="metric">
            <div class="metric-label">ROE</div>
            <div class="metric-value-item">${company.roe.toFixed(1)}%</div>
          </div>
          <div class="metric">
            <div class="metric-label">Revenue Growth</div>
            <div class="metric-value-item">${company.growth.toFixed(1)}%</div>
          </div>
        </div>
        
        <div class="company-price-info">
          <div class="price-row">
            <span>Current Price:</span>
            <span>${formatCurrency(company.price)}</span>
          </div>
          <div class="price-row">
            <span>Target Price:</span>
            <span>${formatCurrency(company.target)}</span>
          </div>
          <div class="price-row">
            <span>Upside Potential:</span>
            <span class="upside-value ${company.upside > 0 ? 'positive' : 'negative'}">
              ${formatPercent(company.upside)}
            </span>
          </div>
          <div class="price-row">
            <span>Risk Level:</span>
            <span>${company.risk}</span>
          </div>
        </div>
      </div>
    `).join('');
    
    console.log(`Companies grid populated with ${filteredCompanies.length} companies`);
  } catch (error) {
    console.error('Error populating companies grid:', error);
  }
}

function populateValuationTable() {
  console.log('Populating valuation table...');
  
  try {
    const tbody = document.getElementById('valuationTableBody');
    if (!tbody) {
      console.error('Valuation table body not found');
      return;
    }
    
    tbody.innerHTML = appData.companies.map(company => {
      const dcfData = appData.dcf_scenarios.find(d => d.company === company.ticker) || {};
      
      return `
        <tr>
          <td><strong>${company.name}</strong><br><small>${company.ticker}</small></td>
          <td>${formatCurrency(company.price)}</td>
          <td>${dcfData.conservative ? formatCurrency(dcfData.conservative) : 'N/A'}</td>
          <td>${dcfData.base_case ? formatCurrency(dcfData.base_case) : 'N/A'}</td>
          <td>${dcfData.aggressive ? formatCurrency(dcfData.aggressive) : 'N/A'}</td>
          <td><strong>${formatCurrency(company.target)}</strong></td>
          <td class="${company.upside > 0 ? 'positive' : 'negative'}">${formatPercent(company.upside)}</td>
        </tr>
      `;
    }).join('');
  } catch (error) {
    console.error('Error populating valuation table:', error);
  }
}

function populateRecommendationsTable() {
  console.log('Populating recommendations table...');
  
  try {
    const container = document.getElementById('recommendationsTable');
    if (!container) {
      console.error('Recommendations table container not found');
      return;
    }
    
    container.innerHTML = `
      <table class="valuation-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Current Price</th>
            <th>Target Price</th>
            <th>Recommendation</th>
            <th>Upside Potential</th>
            <th>Risk Level</th>
            <th>Rationale</th>
          </tr>
        </thead>
        <tbody>
          ${appData.companies.map(company => `
            <tr>
              <td><strong>${company.name}</strong><br><small>${company.ticker}</small></td>
              <td>${formatCurrency(company.price)}</td>
              <td>${formatCurrency(company.target)}</td>
              <td>
                <span class="company-recommendation ${getRecommendationClass(company.recommendation)}">
                  ${company.recommendation}
                </span>
              </td>
              <td class="${company.upside > 0 ? 'positive' : 'negative'}">${formatPercent(company.upside)}</td>
              <td>${company.risk}</td>
              <td><small>${getRecommendationRationale(company)}</small></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (error) {
    console.error('Error populating recommendations table:', error);
  }
}

function getRecommendationRationale(company) {
  if (company.recommendation === 'Strong Buy') {
    return `High upside potential (${formatPercent(company.upside)}) with strong fundamentals. ROE of ${company.roe.toFixed(1)}% indicates efficient capital allocation.`;
  } else if (company.recommendation === 'Buy') {
    return `Attractive valuation with decent upside potential. Growth momentum and market position support positive outlook.`;
  } else if (company.recommendation === 'Hold') {
    return `Limited upside at current levels. Suitable for long-term investors seeking stability.`;
  } else if (company.recommendation === 'Sell') {
    return `Overvalued at current levels with negative upside potential. Consider profit booking.`;
  }
  return 'Based on comprehensive DCF and peer valuation analysis.';
}

// Chart initialization
function initializeCharts() {
  console.log('Initializing charts...');
  const activeSection = document.querySelector('.section.active');
  if (activeSection) {
    initializeSectionCharts(activeSection.id);
  }
}

function initializeSectionCharts(sectionId) {
  console.log(`Initializing charts for section: ${sectionId}`);
  
  const isDark = document.documentElement.getAttribute('data-color-scheme') === 'dark';
  const textColor = isDark ? '#f5f5f5' : '#1f2121';
  const gridColor = isDark ? 'rgba(245, 245, 245, 0.1)' : 'rgba(31, 33, 33, 0.1)';
  
  Chart.defaults.color = textColor;
  Chart.defaults.borderColor = gridColor;
  
  switch (sectionId) {
    case 'macro-analysis':
      createGlobalSpendingChart(isDark, textColor, gridColor);
      break;
    case 'industry-analysis':
      createMarketSegmentChart(isDark, textColor, gridColor);
      break;
    case 'valuation-analysis':
      createTargetPriceChart(isDark, textColor, gridColor);
      break;
    case 'recommendations':
      createPortfolioChart(isDark, textColor, gridColor);
      break;
  }
}

function createGlobalSpendingChart(isDark, textColor, gridColor) {
  const ctx = document.getElementById('globalSpendingChart');
  if (!ctx || charts['globalSpendingChart']) return;
  
  const data = {
    labels: ['2022', '2023', '2024', '2025F', '2026F'],
    datasets: [{
      label: 'Global IT Spending ($ Tn)',
      data: [4.2, 4.5, 4.8, 5.1, 5.4],
      borderColor: '#32a0a8',
      backgroundColor: 'rgba(50, 160, 168, 0.1)',
      tension: 0.4
    }, {
      label: 'India IT Revenue ($ Bn)',
      data: [160, 177, 194, 210, 225],
      borderColor: '#e66061',
      backgroundColor: 'rgba(230, 96, 97, 0.1)',
      tension: 0.4,
      yAxisID: 'y1'
    }]
  };
  
  charts['globalSpendingChart'] = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: 'Global IT Spending vs India Revenue', color: textColor },
        legend: { labels: { color: textColor } }
      },
      scales: {
        x: { ticks: { color: textColor }, grid: { color: gridColor } },
        y: {
          type: 'linear', display: true, position: 'left',
          title: { display: true, text: 'Global IT Spending ($ Tn)', color: textColor },
          ticks: { color: textColor }, grid: { color: gridColor }
        },
        y1: {
          type: 'linear', display: true, position: 'right',
          title: { display: true, text: 'India IT Revenue ($ Bn)', color: textColor },
          ticks: { color: textColor }, grid: { drawOnChartArea: false, color: gridColor }
        }
      }
    }
  });
}

function createMarketSegmentChart(isDark, textColor, gridColor) {
  const ctx = document.getElementById('marketSegmentChart');
  if (!ctx || charts['marketSegmentChart']) return;
  
  const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545'];
  
  charts['marketSegmentChart'] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: appData.market_segments.map(s => s.segment),
      datasets: [{
        data: appData.market_segments.map(s => s.share),
        backgroundColor: colors,
        borderColor: isDark ? '#262828' : '#ffffff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: 'Market Segmentation by Industry Vertical (%)', color: textColor },
        legend: { position: 'right', labels: { color: textColor, usePointStyle: true, padding: 15 } }
      }
    }
  });
}

function createTargetPriceChart(isDark, textColor, gridColor) {
  const ctx = document.getElementById('targetPriceChart');
  if (!ctx || charts['targetPriceChart']) return;
  
  charts['targetPriceChart'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: appData.companies.map(c => c.ticker),
      datasets: [{
        label: 'Current Price',
        data: appData.companies.map(c => c.price),
        backgroundColor: isDark ? 'rgba(50, 184, 198, 0.7)' : 'rgba(33, 128, 141, 0.7)',
        borderColor: isDark ? '#32b8c6' : '#21808d',
        borderWidth: 1
      }, {
        label: 'Target Price',
        data: appData.companies.map(c => c.target),
        backgroundColor: isDark ? 'rgba(255, 84, 89, 0.7)' : 'rgba(192, 21, 47, 0.7)',
        borderColor: isDark ? '#ff5459' : '#c0152f',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: 'Current Price vs Target Price Comparison', color: textColor },
        legend: { labels: { color: textColor } }
      },
      scales: {
        x: { ticks: { color: textColor }, grid: { color: gridColor } },
        y: { beginAtZero: true, title: { display: true, text: 'Price (₹)', color: textColor }, ticks: { color: textColor }, grid: { color: gridColor } }
      }
    }
  });
}

function createPortfolioChart(isDark, textColor, gridColor) {
  const ctx = document.getElementById('portfolioChart');
  if (!ctx || charts['portfolioChart']) return;
  
  const portfolioData = appData.companies
    .filter(c => ['Strong Buy', 'Buy'].includes(c.recommendation))
    .map(c => ({ name: c.ticker, allocation: Math.round((c.mcap / appData.companies.reduce((sum, comp) => sum + comp.mcap, 0)) * 100) }))
    .sort((a, b) => b.allocation - a.allocation);
  
  const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#5D878F', '#DB4545', '#D2BA4C'];
  
  charts['portfolioChart'] = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: portfolioData.map(p => p.name),
      datasets: [{
        data: portfolioData.map(p => p.allocation),
        backgroundColor: colors.slice(0, portfolioData.length),
        borderColor: isDark ? '#262828' : '#ffffff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: 'Recommended Portfolio Allocation (%)', color: textColor },
        legend: { position: 'bottom', labels: { color: textColor, usePointStyle: true, padding: 10 } }
      }
    }
  });
}

// Error handling
window.addEventListener('error', function(e) {
  console.error('Global error:', e.error);
});

// Cleanup
window.addEventListener('beforeunload', function() {
  Object.keys(charts).forEach(chartId => {
    if (charts[chartId]) {
      charts[chartId].destroy();
    }
  });
});