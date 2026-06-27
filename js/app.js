import { calculateFullSetup } from './formulas.js';

function syncValues(source, target) {
    target.value = source.value;
}

const getFormData = () => ({
    totalWeight: parseFloat(document.getElementById('weight-total').value),
    frontRatio: parseFloat(document.getElementById('weight-front').value),
    buildType: document.getElementById('build-type').value,
    drivetrain: document.getElementById('drivetrain').value
});

const renderResults = (setup) => {
    Object.keys(setup).forEach(category => {
        if (category === 'diff' || category === 'drivetrain') return;

        const catData = setup[category];

        // Iterujemy po wszystkich pozostałych kategoriach (springs, arb, itp.)
        Object.keys(catData).forEach(key => {
            const el = document.getElementById(`res-${category}-${key}`);
            if (el) {
                const val = catData[key];
                // Jeśli to liczba, używamy toFixed, jeśli tekst (np. w rideHeight), wstawiamy bezpośrednio
                el.textContent = typeof val === 'number' ? val.toFixed(1) : val;
            }
        });
    });
    renderDiff(setup.diff, setup.drivetrain);
};

const renderDiff = (diff, drivetrain) => {
    const container = document.getElementById('diff-results-container');
    if (!container) return;

    if (drivetrain === 'awd') {
        // Używamy operatora || dla bezpieczeństwa - jeśli wartość jest undefined, wyświetli 0
        container.innerHTML = `
            <div class="result-card">
                <span class="card-label">Przód (P / Z)</span>
                <div class="card-value">${diff.frontAccel || 0}% / ${diff.frontDecel || 0}%</div>
            </div>
            <div class="result-card">
                <span class="card-label">Tył (P / Z)</span>
                <div class="card-value">${diff.rearAccel || 0}% / ${diff.rearDecel || 0}%</div>
            </div>
            <div class="result-card">
                <span class="card-label">Balans Centralny</span>
                <div class="card-value">${diff.centerBias || 0}% na tył</div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="result-card">
                <span class="card-label">Przyspieszenie</span>
                <div class="card-value">${diff.accel || 0}%</div>
            </div>
            <div class="result-card">
                <span class="card-label">Zwalnianie</span>
                <div class="card-value">${diff.decel || 0}%</div>
            </div>
        `;
    }
};

function updateCalculations() {
    const data = getFormData();
    if (isNaN(data.totalWeight)) return;

    const setup = calculateFullSetup(data.totalWeight, data.frontRatio, data.buildType, data.drivetrain);
    renderResults(setup);
}

function setupDynamicSync() {
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

    document.getElementById('calc-btn').addEventListener('click', updateCalculations);
}

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
    setupDynamicSync();
    initModals();
}

init();