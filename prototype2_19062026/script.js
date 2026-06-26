document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Inputs
    const inpObjectName = document.getElementById('inp-object-name');
    const inpWeightCurrent = document.getElementById('inp-weight-current');
    const inpWeightTarget = document.getElementById('inp-weight-target');
    const inpScaleCurrent = document.getElementById('inp-scale-current');
    const inpMaterial = document.getElementById('inp-material');
    const inpCustomDensity = document.getElementById('inp-custom-density');
    const customDensityGroup = document.getElementById('custom-density-group');
    const weightRefPure = document.getElementById('weight-ref-pure');
    const weightRefTotal = document.getElementById('weight-ref-total');
    const postProcessingGroup = document.getElementById('post-processing-group');
    const inpWeightPost = document.getElementById('inp-weight-post');
    const targetPureCalcInfo = document.getElementById('target-pure-calc-info');

    // DOM Elements - Sliders
    const rangeWeightCurrent = document.getElementById('range-weight-current');
    const rangeWeightTarget = document.getElementById('range-weight-target');
    
    // Slider values indicators
    const sliderValCurrent = document.getElementById('slider-val-current');
    const sliderValTarget = document.getElementById('slider-val-target');

    // Formel-Schnellrechner Elements
    const quickG0 = document.getElementById('quick-g0');
    const quickGz = document.getElementById('quick-gz');
    const quickS0 = document.getElementById('quick-s0');
    const quickResultVal = document.getElementById('quick-result-val');

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

    // Method Switcher Elements
    const radioMethodA = document.getElementById('radio-method-a');
    const radioMethodB = document.getElementById('radio-method-b');
    const panelOptionA = document.getElementById('panel-option-a');
    const panelOptionB = document.getElementById('panel-option-b');
    const cardMethodA = document.getElementById('card-method-a');
    const cardMethodB = document.getElementById('card-method-b');

    // Option A DOM Elements
    const optAVolume = document.getElementById('opt-a-volume');
    const optAMaterial = document.getElementById('opt-a-material');
    const optACustomDensity = document.getElementById('opt-a-custom-density');
    const optACustomDensityGroup = document.getElementById('opt-a-custom-density-group');
    const optAWalls = document.getElementById('opt-a-walls');
    const optASliderInfill = document.getElementById('opt-a-slider-infill');
    const optASliderInfillVal = document.getElementById('opt-a-slider-infill-val');
    const optATopLayers = document.getElementById('opt-a-top-layers');
    const optABottomLayers = document.getElementById('opt-a-bottom-layers');
    const optALayerHeight = document.getElementById('opt-a-layer-height');
    const optALineWidth = document.getElementById('opt-a-line-width');

    const optAResultWeight = document.getElementById('opt-a-result-weight');
    const optAResultVWalls = document.getElementById('opt-a-result-v-walls');
    const optAResultVTb = document.getElementById('opt-a-result-v-tb');
    const optAResultVInfill = document.getElementById('opt-a-result-v-infill');

    const optADropZone = document.getElementById('opt-a-drop-zone');
    const optAFileInput = document.getElementById('opt-a-file-input');
    const optAUploadStatus = document.getElementById('opt-a-upload-status');

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
    calculateQuick();
    calculateOptionA();
    loadHistory();

    // --- EVENT LISTENERS ---

    // Method switcher
    if (radioMethodA && radioMethodB && panelOptionA && panelOptionB) {
        radioMethodA.addEventListener('change', toggleMethodPanel);
        radioMethodB.addEventListener('change', toggleMethodPanel);
    }

    // Card switcher UI interactions
    if (cardMethodA && cardMethodB) {
        cardMethodA.addEventListener('click', () => {
            radioMethodA.checked = true;
            toggleMethodPanel();
        });

        cardMethodB.addEventListener('click', () => {
            radioMethodB.checked = true;
            toggleMethodPanel();
        });
    }

    // Option A event listeners
    if (optAVolume) {
        [optAVolume, optAMaterial, optACustomDensity, optAWalls, optATopLayers, optABottomLayers, optALayerHeight, optALineWidth].forEach(el => {
            if (el) {
                el.addEventListener('input', () => {
                    if (el === optAMaterial) {
                        if (optAMaterial.value === 'custom') {
                            optACustomDensityGroup.classList.remove('hidden');
                        } else {
                            optACustomDensityGroup.classList.add('hidden');
                        }
                    }
                    calculateOptionA();
                });
            }
        });

        if (optASliderInfill) {
            optASliderInfill.addEventListener('input', () => {
                optASliderInfillVal.textContent = optASliderInfill.value + ' %';
                calculateOptionA();
            });
        }

        if (optADropZone && optAFileInput) {
            optADropZone.addEventListener('click', () => optAFileInput.click());
            
            optADropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                optADropZone.classList.add('dragover');
            });
            
            optADropZone.addEventListener('dragleave', () => {
                optADropZone.classList.remove('dragover');
            });
            
            optADropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                optADropZone.classList.remove('dragover');
                if (e.dataTransfer.files.length > 0) {
                    handleUploadedFile(e.dataTransfer.files[0]);
                }
            });
            
            optAFileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    handleUploadedFile(e.target.files[0]);
                }
            });
        }
    }

    // Realtime Calculations on input changes
    [inpWeightCurrent, inpWeightTarget, inpScaleCurrent, inpMaterial, inpCustomDensity, inpWeightPost].forEach(element => {
        element.addEventListener('input', () => {
            syncInputsToSliders();
            calculateAll();
        });
    });

    [weightRefPure, weightRefTotal].forEach(radio => {
        radio.addEventListener('change', () => {
            if (weightRefTotal.checked) {
                postProcessingGroup.classList.remove('hidden');
            } else {
                postProcessingGroup.classList.add('hidden');
            }
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

    // Formel-Schnellrechner Event Listeners
    [quickG0, quickGz, quickS0].forEach(input => {
        if (input) {
            input.addEventListener('input', calculateQuick);
        }
    });

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

        // Check weight reference type and adjust target weight
        const isTotalWeight = weightRefTotal.checked;
        const gAdd = isTotalWeight ? parseFloat(inpWeightPost.value) || 0 : 0;
        let targetPure = gz;

        if (isTotalWeight) {
            targetPure = gz - gAdd;
            if (targetPure <= 0) {
                targetPureCalcInfo.textContent = "Zusatzgewicht muss kleiner als das gewünschte Gewicht sein!";
                targetPureCalcInfo.style.color = "var(--accent-red)";
                resultScale.textContent = "---";
                resultMultiplier.textContent = "---";
                resultDeltaWeight.textContent = "---";
                resultVolumeFactor.textContent = "---";
                return;
            } else {
                targetPureCalcInfo.textContent = `Reines 3D-Druck-Zielgewicht: ${targetPure.toFixed(1)} g`;
                targetPureCalcInfo.style.color = "var(--accent-gold)";
            }
        } else {
            targetPureCalcInfo.textContent = "";
        }

        // Get target material density
        let density = 1.24;
        if (inpMaterial.value === 'custom') {
            density = parseFloat(inpCustomDensity.value) || 1.24;
        } else {
            density = parseFloat(inpMaterial.value);
        }
        
        // We assume the baseline slice (G0) was calculated using standard PLA (1.24 g/cm³)
        const densityRef = 1.24;

        // Cubic Scaling Formula with Density Adjustment: S_z = S_0 * ( (G_z_pure / G_0) * (densityRef / density) )^(1/3)
        const volFactor = (targetPure / g0) * (densityRef / density);
        const scaleFactor = Math.cbrt(volFactor);
        const sz = s0 * scaleFactor;

        // Results
        resultScale.textContent = sz.toFixed(1);
        resultMultiplier.textContent = scaleFactor.toFixed(3) + 'x';
        
        const delta = targetPure - g0;
        const sign = delta >= 0 ? '+' : '';
        resultDeltaWeight.textContent = `${sign}${delta.toFixed(1)} g`;
        
        if (delta >= 0) {
            resultDeltaWeight.className = 'detail-value text-green';
        } else {
            resultDeltaWeight.className = 'detail-value text-red';
        }

        resultVolumeFactor.textContent = volFactor.toFixed(3) + 'x';

        // Update visualizer state
        valPreviewScale.textContent = sz.toFixed(1) + '%';
        valPreviewVol.textContent = (volFactor * 100).toFixed(0) + '%';

        // 3D scaling (limit the visually shown scale factor to prevent clipping)
        const visualScale = Math.max(0.45, Math.min(2.1, scaleFactor));
        object3DContainer.style.transform = `scale(${visualScale})`;

    }

    function calculateQuick() {
        const g0 = parseFloat(quickG0.value);
        const gz = parseFloat(quickGz.value);
        const s0 = parseFloat(quickS0.value);

        if (isNaN(g0) || isNaN(gz) || isNaN(s0) || g0 <= 0 || gz <= 0 || s0 <= 0) {
            quickResultVal.textContent = "---";
            return;
        }

        const sz = s0 * Math.cbrt(gz / g0);
        quickResultVal.textContent = sz.toFixed(1) + '%';
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
        const isTotalWeight = weightRefTotal.checked;
        const gAdd = isTotalWeight ? parseFloat(inpWeightPost.value) || 0 : 0;

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
            isTotalWeight: isTotalWeight,
            gAdd: gAdd.toFixed(1),
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
            let targetWeightText = `${item.gz} g`;
            if (item.isTotalWeight && parseFloat(item.gAdd) > 0) {
                targetWeightText += ` <span class="history-detail-badge" title="Gesamtgewicht inkl. ${item.gAdd} g Zusatzgewicht">(${item.gAdd}g Kette)</span>`;
            }

            tr.innerHTML = `
                <td>${item.date}</td>
                <td style="font-weight: 600; color: #ffffff;">${escapeHTML(item.name)}</td>
                <td>${item.material}</td>
                <td>${item.g0} g</td>
                <td style="font-weight: 500; color: var(--accent-gold);">${targetWeightText}</td>
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
        csvContent += 'Datum;Objektbezeichnung;Material;Ist-Gewicht (g);Soll-Gewicht (g);Referenz-Typ;Zusatzgewicht (g);Ursprungsskalierung (%);Zielskalierung (%);Multiplikator\r\n';

        history.forEach(item => {
            const isTotal = item.isTotalWeight === true;
            const extraWeight = isTotal ? item.gAdd : '0.0';
            const refType = isTotal ? 'Gesamtgewicht' : 'Reines 3D-Druck-Gewicht';
            
            const row = [
                item.date,
                `"${item.name.replace(/"/g, '""')}"`,
                item.material,
                item.g0,
                item.gz,
                refType,
                extraWeight,
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

    function toggleMethodPanel() {
        if (radioMethodA.checked) {
            panelOptionA.classList.remove('hidden');
            panelOptionB.classList.add('hidden');
            if (cardMethodA) cardMethodA.classList.add('active');
            if (cardMethodB) cardMethodB.classList.remove('active');
            calculateOptionA();
        } else {
            panelOptionA.classList.add('hidden');
            panelOptionB.classList.remove('hidden');
            if (cardMethodB) cardMethodB.classList.add('active');
            if (cardMethodA) cardMethodA.classList.remove('active');
            calculateAll();
        }
    }

    function calculateOptionA() {
        const vTotal = parseFloat(optAVolume.value);
        let density = 1.24;
        if (optAMaterial.value === 'custom') {
            density = parseFloat(optACustomDensity.value) || 1.24;
        } else {
            density = parseFloat(optAMaterial.value);
        }

        const walls = parseInt(optAWalls.value) || 2;
        const infillPercent = optASliderInfill ? parseFloat(optASliderInfill.value) : 15;
        const topLayers = parseInt(optATopLayers.value) || 4;
        const bottomLayers = parseInt(optABottomLayers.value) || 4;
        const layerHeight = parseFloat(optALayerHeight.value) || 0.2;
        const lineWidth = parseFloat(optALineWidth.value) || 0.42;

        if (isNaN(vTotal) || vTotal <= 0) {
            optAResultWeight.textContent = "---";
            optAResultVWalls.textContent = "--- cm³";
            optAResultVTb.textContent = "--- cm³";
            optAResultVInfill.textContent = "--- cm³";
            return;
        }

        // Estimate surface area of the model (in cm2) from volume V (in cm3)
        // Standard sphere has A = 4.84 * V^(2/3). 
        // A typical museum object/3D print has details, so we use a scaling factor of 6.5
        const surfArea = 6.5 * Math.pow(vTotal, 2/3);

        // Thickness of walls and top/bottom shells (in cm)
        const wallThickness = (walls * lineWidth) / 10; // mm to cm
        const tbThickness = ((topLayers + bottomLayers) / 2 * layerHeight) / 10; // mm to cm

        // Volumes (in cm3)
        const vWalls = Math.min(vTotal, surfArea * wallThickness);
        const vTb = Math.min(vTotal - vWalls, surfArea * tbThickness);
        const vInside = Math.max(0, vTotal - vWalls - vTb);

        // Weight Calculation
        const infillFraction = infillPercent / 100;
        const vPrint = vWalls + vTb + (vInside * infillFraction);
        const estimatedWeight = vPrint * density;

        // Update UI
        optAResultWeight.textContent = estimatedWeight.toFixed(1);
        optAResultVWalls.textContent = vWalls.toFixed(2) + " cm³";
        optAResultVTb.textContent = vTb.toFixed(2) + " cm³";
        optAResultVInfill.textContent = vInside.toFixed(2) + " cm³";
    }

    function handleUploadedFile(file) {
        const ext = file.name.split('.').pop().toLowerCase();
        optAUploadStatus.textContent = `Datei geladen: ${file.name}`;
        optAUploadStatus.style.color = "var(--accent-gold)";
        
        if (ext === 'stl') {
            optAUploadStatus.textContent = `Analysiere ${file.name}...`;
            const reader = new FileReader();
            reader.onload = function(e) {
                const buffer = e.target.result;
                try {
                    const volumeMm3 = calculateSTLVolume(buffer);
                    const volumeCm3 = volumeMm3 / 1000;
                    if (volumeCm3 > 0) {
                        optAVolume.value = volumeCm3.toFixed(1);
                        optAUploadStatus.textContent = `Erfolgreich geladen: ${file.name} (V = ${volumeCm3.toFixed(1)} cm³)`;
                        optAUploadStatus.style.color = "var(--accent-green)";
                        calculateOptionA();
                    } else {
                        throw new Error("Ungültiges Volumen berechnet");
                    }
                } catch (err) {
                    console.error("STL-Analyse fehlgeschlagen:", err);
                    optAUploadStatus.textContent = `Fehler bei STL-Analyse. Bitte Volumen manuell eintragen.`;
                    optAUploadStatus.style.color = "var(--accent-red)";
                }
            };
            reader.readAsArrayBuffer(file);
        } else {
            optAUploadStatus.textContent = `Geladen: ${file.name} (Volumen manuell eintragen)`;
            optAUploadStatus.style.color = "var(--accent-gold)";
        }
    }

    function calculateSTLVolume(buffer) {
        const view = new DataView(buffer);
        if (buffer.byteLength > 84) {
            const triangleCount = view.getUint32(80, true);
            const expectedSize = 84 + triangleCount * 50;
            if (buffer.byteLength === expectedSize || buffer.byteLength === expectedSize + 2) {
                return calculateBinarySTLVolume(view, triangleCount);
            }
        }
        const decoder = new TextDecoder('utf-8');
        const text = decoder.decode(buffer);
        return calculateAsciiSTLVolume(text);
    }

    function calculateBinarySTLVolume(view, count) {
        let totalVolume = 0;
        let offset = 84;
        
        for (let i = 0; i < count; i++) {
            const v1x = view.getFloat32(offset + 12, true);
            const v1y = view.getFloat32(offset + 16, true);
            const v1z = view.getFloat32(offset + 20, true);
            
            const v2x = view.getFloat32(offset + 24, true);
            const v2y = view.getFloat32(offset + 28, true);
            const v2z = view.getFloat32(offset + 32, true);
            
            const v3x = view.getFloat32(offset + 36, true);
            const v3y = view.getFloat32(offset + 40, true);
            const v3z = view.getFloat32(offset + 44, true);
            
            const v321 = v3x * v2y * v1z;
            const v231 = v2x * v3y * v1z;
            const v312 = v3x * v1y * v2z;
            const v132 = v1x * v3y * v2z;
            const v213 = v2x * v1y * v3z;
            const v123 = v1x * v2y * v3z;
            
            const volume = (1.0 / 6.0) * (-v321 + v231 + v312 - v132 - v213 + v123);
            totalVolume += volume;
            
            offset += 50;
        }
        return Math.abs(totalVolume);
    }

    function calculateAsciiSTLVolume(text) {
        let totalVolume = 0;
        const lines = text.split('\n');
        let vertices = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim().toLowerCase();
            if (line.startsWith('vertex')) {
                const parts = line.split(/\s+/);
                if (parts.length >= 4) {
                    const x = parseFloat(parts[1]);
                    const y = parseFloat(parts[2]);
                    const z = parseFloat(parts[3]);
                    vertices.push({ x, y, z });
                }
            }
            if (vertices.length === 3) {
                const v1 = vertices[0];
                const v2 = vertices[1];
                const v3 = vertices[2];
                
                const v321 = v3.x * v2.y * v1.z;
                const v231 = v2.x * v3.y * v1.z;
                const v312 = v3.x * v1.y * v2.z;
                const v132 = v1.x * v3.y * v2.z;
                const v213 = v2.x * v1.y * v3.z;
                const v123 = v1.x * v2.y * v3.z;
                
                const volume = (1.0 / 6.0) * (-v321 + v231 + v312 - v132 - v213 + v123);
                totalVolume += volume;
                vertices = [];
            }
        }
        return Math.abs(totalVolume);
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

    // --- DRAWER INTERACTION FOR QUICK CALCULATOR ---
    const drawer = document.getElementById('quick-calc-drawer');
    const backdrop = document.getElementById('quick-calc-drawer-backdrop');
    const btnTriggerDrawer = document.getElementById('btn-trigger-drawer');
    const fabTriggerDrawer = document.getElementById('quick-calc-drawer-trigger-fab');
    const btnCloseDrawer = document.getElementById('quick-calc-drawer-close');
    
    const btnQuickApply = document.getElementById('btn-quick-apply');
    const btnQuickCopy = document.getElementById('btn-quick-copy');

    function openDrawer() {
        if (drawer && backdrop) {
            drawer.classList.add('open');
            backdrop.classList.add('visible');
        }
    }

    function closeDrawer() {
        if (drawer && backdrop) {
            drawer.classList.remove('open');
            backdrop.classList.remove('visible');
        }
    }

    if (btnTriggerDrawer) btnTriggerDrawer.addEventListener('click', openDrawer);
    if (fabTriggerDrawer) fabTriggerDrawer.addEventListener('click', openDrawer);
    if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    // Apply values to main inputs
    if (btnQuickApply) {
        btnQuickApply.addEventListener('click', () => {
            const g0Val = parseFloat(quickG0.value);
            const gzVal = parseFloat(quickGz.value);
            const s0Val = parseFloat(quickS0.value);
            
            if (!isNaN(g0Val) && !isNaN(gzVal)) {
                inpWeightCurrent.value = g0Val;
                inpWeightTarget.value = gzVal;
                if (!isNaN(s0Val)) {
                    inpScaleCurrent.value = s0Val;
                }
                
                syncInputsToSliders();
                calculateAll();
                closeDrawer();
                showToast('Werte in Hauptrechner übernommen!');
            } else {
                showToast('Bitte gültige Werte eingeben.');
            }
        });
    }

    // Copy result to clipboard
    if (btnQuickCopy) {
        btnQuickCopy.addEventListener('click', () => {
            const scaleVal = quickResultVal.textContent;
            if (scaleVal === '---') return;

            navigator.clipboard.writeText(scaleVal).then(() => {
                showToast(`Ziel-Skalierung (${scaleVal}) kopiert!`);
            }).catch(err => {
                console.error('Kopieren fehlgeschlagen: ', err);
                showToast('Kopieren fehlgeschlagen.');
            });
        });
    }
});
