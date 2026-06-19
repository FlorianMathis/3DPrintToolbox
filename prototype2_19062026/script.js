document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Inputs
    const inpObjectName = document.getElementById('inp-object-name');
    const inpWeightCurrent = document.getElementById('inp-weight-current');
    const inpWeightTarget = document.getElementById('inp-weight-target');
    const inpScaleCurrent = document.getElementById('inp-scale-current');
    const inpMaterial = document.getElementById('inp-material');
    const inpCustomDensity = document.getElementById('inp-custom-density');
    const customDensityGroup = document.getElementById('custom-density-group');

    // DOM Elements - Sliders
    const rangeWeightCurrent = document.getElementById('range-weight-current');
    const rangeWeightTarget = document.getElementById('range-weight-target');
    const rangeInfill = document.getElementById('range-infill');
    
    // Slider values indicators
    const sliderValCurrent = document.getElementById('slider-val-current');
    const sliderValTarget = document.getElementById('slider-val-target');
    const valInfill = document.getElementById('val-infill');
    const simInfillDisplay = document.getElementById('sim-infill-display');

    // Simulation
    const inpStlVolume = document.getElementById('inp-stl-volume');
    const simulatedMassVal = document.getElementById('simulated-mass-val');

    // Results Display
    const resultScale = document.getElementById('result-scale');
    const resultMultiplier = document.getElementById('result-multiplier');
    const resultDeltaWeight = document.getElementById('result-delta-weight');
    const resultVolumeFactor = document.getElementById('result-volume-factor');

    // Buttons
    const btnCopyScale = document.getElementById('btn-copy-scale');
    const btnSaveProject = document.getElementById('btn-save-project');
    const btnExportCSV = document.getElementById('btn-export-csv');
    const btnPrintPage = document.getElementById('btn-print-page');
    const btnClearHistory = document.getElementById('btn-clear-history');
    const btnRotateToggle = document.getElementById('btn-rotate-toggle');

    // History Table
    const historyTbody = document.getElementById('history-tbody');

    // 3D Viewport Elements
    const viewport3D = document.getElementById('viewport-3d');
    const object3DContainer = document.getElementById('object-3d-container');
    const valPreviewScale = document.getElementById('val-preview-scale');
    const valPreviewVol = document.getElementById('val-preview-vol');

    // Toast Notification
    const toast = document.getElementById('toast-notification');
    const toastMessage = document.getElementById('toast-message');

    // State Variables
    let isRotating = true;
    let rotationAngle = 0;
    let animationFrameId = null;
    let isDragging = false;
    let startX, startY;
    let currentRotationX = 10; // start slightly tilted down
    let currentRotationY = 45; // start rotated

    // Set initial values
    inpWeightCurrent.value = 92;
    inpWeightTarget.value = 150;
    inpScaleCurrent.value = 100;
    
    updateSliderValTexts();
    calculateAll();
    loadHistory();

    // --- EVENT LISTENERS ---

    // Realtime Calculations on input changes
    [inpWeightCurrent, inpWeightTarget, inpScaleCurrent, inpMaterial, inpCustomDensity].forEach(element => {
        element.addEventListener('input', () => {
            syncInputsToSliders();
            calculateAll();
        });
    });

    inpMaterial.addEventListener('change', () => {
        if (inpMaterial.value === 'custom') {
            customDensityGroup.classList.remove('hidden');
        } else {
            customDensityGroup.classList.add('hidden');
        }
        calculateAll();
    });

    // Realtime Calculations on slider changes
    rangeWeightCurrent.addEventListener('input', () => {
        inpWeightCurrent.value = rangeWeightCurrent.value;
        sliderValCurrent.textContent = rangeWeightCurrent.value + ' g';
        calculateAll();
    });

    rangeWeightTarget.addEventListener('input', () => {
        inpWeightTarget.value = rangeWeightTarget.value;
        sliderValTarget.textContent = rangeWeightTarget.value + ' g';
        calculateAll();
    });

    // Infill Simulation range
    rangeInfill.addEventListener('input', () => {
        valInfill.textContent = rangeInfill.value + '%';
        simInfillDisplay.textContent = rangeInfill.value + '%';
        calculateMassSimulation();
    });

    // Volume Simulation Input
    inpStlVolume.addEventListener('input', calculateMassSimulation);

    // Save calculation
    btnSaveProject.addEventListener('click', saveToHistory);

    // Clipboard copy
    btnCopyScale.addEventListener('click', copyScaleToClipboard);

    // Print Action
    btnPrintPage.addEventListener('click', () => {
        window.print();
    });

    // History Table Actions
    btnClearHistory.addEventListener('click', clearHistory);
    btnExportCSV.addEventListener('click', exportHistoryCSV);

    // 3D Viewport Controls
    btnRotateToggle.addEventListener('click', toggle3DRotation);

    // Drag-to-rotate in viewport
    viewport3D.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', stopDrag);

    viewport3D.addEventListener('touchstart', startDragTouch, { passive: true });
    window.addEventListener('touchmove', dragTouch, { passive: false });
    window.addEventListener('touchend', stopDrag);

    // --- MATHEMATICAL FUNCTIONS ---

    function calculateAll() {
        const g0 = parseFloat(inpWeightCurrent.value);
        const gz = parseFloat(inpWeightTarget.value);
        const s0 = parseFloat(inpScaleCurrent.value);

        if (isNaN(g0) || isNaN(gz) || isNaN(s0) || g0 <= 0 || gz <= 0 || s0 <= 0) {
            resultScale.textContent = "---";
            resultMultiplier.textContent = "---";
            resultDeltaWeight.textContent = "---";
            resultVolumeFactor.textContent = "---";
            return;
        }

        // Cubic Scaling Formula: S_z = S_0 * (G_z / G_0)^(1/3)
        const scaleFactor = Math.cbrt(gz / g0);
        const sz = s0 * scaleFactor;

        // Results
        resultScale.textContent = sz.toFixed(1);
        resultMultiplier.textContent = scaleFactor.toFixed(3) + 'x';
        
        const delta = gz - g0;
        const sign = delta >= 0 ? '+' : '';
        resultDeltaWeight.textContent = `${sign}${delta.toFixed(1)} g`;
        
        if (delta >= 0) {
            resultDeltaWeight.className = 'detail-value text-green';
        } else {
            resultDeltaWeight.className = 'detail-value text-red';
        }

        const volFactor = gz / g0;
        resultVolumeFactor.textContent = volFactor.toFixed(3) + 'x';

        // Update visualizer state
        valPreviewScale.textContent = sz.toFixed(1) + '%';
        valPreviewVol.textContent = (volFactor * 100).toFixed(0) + '%';

        // 3D scaling (limit the visually shown scale factor to prevent clipping)
        const visualScale = Math.max(0.45, Math.min(2.1, scaleFactor));
        object3DContainer.style.transform = `scale(${visualScale})`;

        calculateMassSimulation();
    }

    function calculateMassSimulation() {
        const volume = parseFloat(inpStlVolume.value);
        const infill = parseFloat(rangeInfill.value) / 100;
        
        let density = 1.24; // Default PLA
        if (inpMaterial.value === 'custom') {
            density = parseFloat(inpCustomDensity.value) || 1.24;
        } else {
            density = parseFloat(inpMaterial.value);
        }

        if (isNaN(volume) || volume <= 0 || isNaN(density) || density <= 0) {
            simulatedMassVal.textContent = "0.0 g";
            return;
        }

        // Weight = Volume * Density * Infill
        const simulatedMass = volume * density * infill;
        simulatedMassVal.textContent = simulatedMass.toFixed(1) + " g";
    }

    // --- SYNC & TEXT UPDATES ---

    function syncInputsToSliders() {
        const g0 = parseFloat(inpWeightCurrent.value);
        const gz = parseFloat(inpWeightTarget.value);

        if (!isNaN(g0) && g0 >= 1 && g0 <= 500) {
            rangeWeightCurrent.value = g0;
            sliderValCurrent.textContent = g0.toFixed(0) + ' g';
        }
        if (!isNaN(gz) && gz >= 1 && gz <= 500) {
            rangeWeightTarget.value = gz;
            sliderValTarget.textContent = gz.toFixed(0) + ' g';
        }
    }

    function updateSliderValTexts() {
        sliderValCurrent.textContent = rangeWeightCurrent.value + ' g';
        sliderValTarget.textContent = rangeWeightTarget.value + ' g';
        valInfill.textContent = rangeInfill.value + '%';
        simInfillDisplay.textContent = rangeInfill.value + '%';
    }

    // --- CLIPBOARD ---

    function copyScaleToClipboard() {
        const scaleVal = resultScale.textContent;
        if (scaleVal === '---') return;

        navigator.clipboard.writeText(scaleVal).then(() => {
            showToast(`Ziel-Skalierung (${scaleVal}%) kopiert!`);
        }).catch(err => {
            console.error('Kopieren fehlgeschlagen: ', err);
            showToast('Kopieren fehlgeschlagen. Bitte manuell markieren.');
        });
    }

    function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.remove('hidden');
        
        // Trigger reflow to restart transition
        toast.offsetHeight;
        
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(10px)';
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 300);
        }, 2200);
    }

    // --- 3D ROTATION ANIMATION ---

    function rotate3DObject() {
        if (isRotating && !isDragging) {
            rotationAngle = (rotationAngle + 0.6) % 360;
            applyRotations();
        }
        animationFrameId = requestAnimationFrame(rotate3DObject);
    }

    function applyRotations() {
        // combine mouse rotation and auto-rotation
        const totalY = (isRotating ? rotationAngle : 0) + currentRotationY;
        object3DContainer.parentElement.style.transform = `rotateX(${currentRotationX}deg) rotateY(${totalY}deg)`;
    }

    function toggle3DRotation() {
        isRotating = !isRotating;
        if (isRotating) {
            btnRotateToggle.classList.add('active');
            rotationAngle = 0; // Reset angle to start smoothly
        } else {
            btnRotateToggle.classList.remove('active');
            // Save the current rotation from rotationAngle into currentRotationY
            currentRotationY = (currentRotationY + rotationAngle) % 360;
            rotationAngle = 0;
            applyRotations();
        }
    }

    // Auto-start rotation
    btnRotateToggle.classList.add('active');
    rotate3DObject();

    // --- MOUSE DRAGGING FOR ROTATION ---

    function startDrag(e) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        viewport3D.style.cursor = 'grabbing';
    }

    function drag(e) {
        if (!isDragging) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        startX = e.clientX;
        startY = e.clientY;

        // Adjust rotation speed factor
        currentRotationY += deltaX * 0.5;
        currentRotationX = Math.max(-45, Math.min(60, currentRotationX - deltaY * 0.5)); // clamp pitch
        
        applyRotations();
    }

    function stopDrag() {
        if (isDragging) {
            isDragging = false;
            viewport3D.style.cursor = 'grab';
        }
    }

    // Touch Support
    function startDragTouch(e) {
        if (e.touches.length === 1) {
            isDragging = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }
    }

    function dragTouch(e) {
        if (!isDragging || e.touches.length !== 1) return;
        e.preventDefault(); // Prevent scrolling while rotating
        
        const deltaX = e.touches[0].clientX - startX;
        const deltaY = e.touches[0].clientY - startY;
        
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;

        currentRotationY += deltaX * 0.5;
        currentRotationX = Math.max(-45, Math.min(60, currentRotationX - deltaY * 0.5));
        
        applyRotations();
    }

    // --- LOCALSTORAGE & HISTORY ---

    function getMaterialNameByValue(val) {
        const option = Array.from(inpMaterial.options).find(opt => opt.value === val);
        return option ? option.text.split(' (')[0] : 'Filament';
    }

    function saveToHistory() {
        const objName = inpObjectName.value.trim() || 'Unbenanntes Objekt';
        const matVal = inpMaterial.value;
        const matName = matVal === 'custom' ? `Eigene Dichte (${parseFloat(inpCustomDensity.value || 1.0).toFixed(2)})` : getMaterialNameByValue(matVal);
        const g0 = parseFloat(inpWeightCurrent.value);
        const gz = parseFloat(inpWeightTarget.value);
        const s0 = parseFloat(inpScaleCurrent.value);
        const sz = parseFloat(resultScale.textContent);
        const mult = resultMultiplier.textContent;

        if (isNaN(g0) || isNaN(gz) || isNaN(s0) || isNaN(sz)) {
            showToast('Fehler: Ungültige Werte können nicht gespeichert werden.');
            return;
        }

        const record = {
            id: Date.now(),
            date: new Date().toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            name: objName,
            material: matName,
            g0: g0.toFixed(1),
            gz: gz.toFixed(1),
            s0: s0.toFixed(1),
            sz: sz.toFixed(1),
            multiplier: mult
        };

        let history = JSON.parse(localStorage.getItem('change3d_history')) || [];
        history.unshift(record); // Add to beginning
        localStorage.setItem('change3d_history', JSON.stringify(history));

        loadHistory();
        showToast('Modell erfolgreich in Historie gespeichert!');
    }

    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('change3d_history')) || [];
        
        if (history.length === 0) {
            historyTbody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="9">Keine gespeicherten Berechnungen vorhanden. Füllen Sie die Felder aus und klicken Sie auf "Speichern".</td>
                </tr>
            `;
            return;
        }

        historyTbody.innerHTML = '';
        history.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.date}</td>
                <td style="font-weight: 600; color: #ffffff;">${escapeHTML(item.name)}</td>
                <td>${item.material}</td>
                <td>${item.g0} g</td>
                <td style="font-weight: 500; color: var(--accent-gold);">${item.gz} g</td>
                <td>${item.s0}%</td>
                <td style="font-weight: 700; color: var(--accent-green);">${item.sz}%</td>
                <td style="font-family: 'JetBrains Mono', monospace;">${item.multiplier}</td>
                <td>
                    <button class="btn-delete-row" data-id="${item.id}" title="Eintrag löschen">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </td>
            `;
            historyTbody.appendChild(tr);
        });

        // Add event listeners to delete buttons
        document.querySelectorAll('.btn-delete-row').forEach(btn => {
            btn.addEventListener('click', deleteHistoryRecord);
        });
    }

    function deleteHistoryRecord(e) {
        const idToDelete = parseInt(e.currentTarget.getAttribute('data-id'));
        let history = JSON.parse(localStorage.getItem('change3d_history')) || [];
        history = history.filter(item => item.id !== idToDelete);
        localStorage.setItem('change3d_history', JSON.stringify(history));
        loadHistory();
        showToast('Eintrag gelöscht.');
    }

    function clearHistory() {
        if (confirm('Möchten Sie die gesamte Historie unwiderruflich löschen?')) {
            localStorage.removeItem('change3d_history');
            loadHistory();
            showToast('Historie gelöscht.');
        }
    }

    function exportHistoryCSV() {
        const history = JSON.parse(localStorage.getItem('change3d_history')) || [];
        if (history.length === 0) {
            showToast('Keine Daten für den Export vorhanden.');
            return;
        }

        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent += 'Datum;Objektbezeichnung;Material;Ist-Gewicht (g);Soll-Gewicht (g);Ursprungsskalierung (%);Zielskalierung (%);Multiplikator\r\n';

        history.forEach(item => {
            const row = [
                item.date,
                `"${item.name.replace(/"/g, '""')}"`,
                item.material,
                item.g0,
                item.gz,
                item.s0,
                item.sz,
                item.multiplier
            ].join(';');
            csvContent += row + '\r\n';
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `change3d_filament_skalierungen_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Helper function to escape HTML entities
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});
