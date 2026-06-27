import { calculateFullSetup } from './formulas.js';
import { CATEGORIES } from './config.js';
import { UI_CONFIG } from './config.js';

function syncValues(source, target) {
    target.value = source.value;
}

const getFormData = () => ({
    totalWeight: parseFloat(document.getElementById('weight-total').value),
    frontRatio: parseFloat(document.getElementById('weight-front').value),
    buildType: document.getElementById('build-type').value,
    drivetrain: document.getElementById('drivetrain').value,
    tiresType: document.getElementById('tires-type').value,
    frontAreo: document.getElementById('areo-front').value,
});

function setupEventListeners() {
    document.getElementById('calc-btn').addEventListener('click', updateCalculations);
    setupsSliderAndInputSync();
}

function setupsSliderAndInputSync() {
    const sliders = [
        { id: 'weight-total' },
        { id: 'weight-front' }
    ];

    sliders.forEach(s => {
        const input = document.getElementById(s.id);
        const slider = document.getElementById(s.id + '-slider');
        if (input && slider) {
            input.addEventListener('input', () => syncValues(input, slider));
            slider.addEventListener('input', () => syncValues(slider, input));
        }
    });
}

function updateCalculations() {
    const data = getFormData();
    if (isNaN(data.totalWeight)) return;

    const setup = calculateFullSetup(   data.totalWeight, data.frontRatio, data.buildType, 
                                        data.drivetrain, data.tiresType, data.frontAreo);

    renderResults(setup);
}

/**
 * Funkcja generująca UI na podstawie konfiguracji
 * @param {HTMLElement} container - Kontener, w którym powstanie UI
 * @param {Object} uiConfig - Twoja konfiguracja UI_CONFIG
 */
const generateSetupUI = () => {
    const container = document.getElementById('results-section');
    container.innerHTML = '<h2>Ustawienia</h2>';

    // 1. Grupowanie parametrów według kategorii
    const grouped = UI_CONFIG.order.reduce((acc, key) => {
        const item = UI_CONFIG[key];
        const catId = item.category || 'other'; // domyślna kategoria, jeśli brak
        if (!acc[catId]) acc[catId] = [];
        acc[catId].push({ ...item, key }); // dodajemy klucz do obiektu
        return acc;
    }, {});

    // 2. Iteracja po kategoriach
    Object.keys(grouped).forEach(catId => {
        const categoryData = CATEGORIES[catId] || { label: 'Inne' };
        
        const header = document.createElement('h3');
        header.className = 'section-header';
        header.textContent = categoryData.label;
        container.appendChild(header);

        const grid = document.createElement('div');
        grid.className = 'results-grid';
        container.appendChild(grid);

        grouped[catId].forEach(item => {
            const card = document.createElement('div');
            card.className = 'result-card';
            
            card.innerHTML = `
                <span class="card-label">${item.label}
                    <span class="help-icon" data-tooltip="${item.tooltip.replace(/\n/g, '&#10;')}">?</span>
                </span>
                <div class="card-value">
                    <span id="res-${item.key}">--</span>
                    <span class="unit">${item.unit !== undefined ? item.unit : ''}</span>
                </div>
            `;
            grid.appendChild(card);
        });
    });
};


const renderResults = (setup) => {
    Object.keys(setup).forEach(key => {
        const data = setup[key];
        const config = UI_CONFIG[key];
        
        const el = document.getElementById(`res-${key}`);
        
        // Wstrzykujemy gotowy, sformatowany tekst z UI_CONFIG
        if (el && config && config.format) {
            el.textContent = config.format(data);
        }
    });
};

// Inicjalizacja modali
function initModals() {
    const modal = document.getElementById('info-modal');
    document.querySelectorAll('.help-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            document.getElementById('modal-text').innerText = icon.getAttribute('data-tooltip');
            modal.showModal();
        });
    });
}

function init() {
    setupEventListeners();
    initModals();
    generateSetupUI();
}

init();