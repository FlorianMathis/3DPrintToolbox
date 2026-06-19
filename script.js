const phasesData = [
    {
        id: 1,
        title: "Objekt für 3D-Scan vorbereiten",
        subtitle: "Scan-Vorbereitung",
        description: "Optimale Bedingungen für einen erfolgreichen Scan schaffen",
        icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v19M5 10l7-7 7 7"/></svg>',
        tips: [
            "Vermeiden Sie direkte Sonneneinstrahlung",
            "Kleine Objekte auf Augenhöhe positionieren",
            "Kontrastreiche Hintergründe verwenden"
        ],
        type: "tasks",
        content: [
            "Objekt gründlich reinigen",
            "Spiegelnde Oberflächen abdecken oder mattieren",
            "Gute, gleichmäßige Beleuchtung sicherstellen",
            "Genügend Platz zum Umrunden schaffen (mind. 360°)",
            "Drehteller oder stabile Unterlage bereitstellen"
        ]
    },
    {
        id: 2,
        title: "3D-Scan mit iPhone durchführen",
        subtitle: "3D-Scan",
        description: "Scannen Sie das Objekt mit einer LiDAR-App",
        icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>',
        tips: [
            "Halten Sie konstanten Abstand zum Objekt",
            "Bewegen Sie sich langsam und gleichmäßig",
            "Überlappen Sie die Scan-Bereiche"
        ],
        type: "instructions_upload",
        banner: {
            title: "Externe Software erforderlich",
            text: "Polycam / Scaniverse / 3D Scanner App"
        },
        content: [
            "Öffnen Sie Ihre Scan-App (z.B. Polycam, Scaniverse)",
            "Wählen Sie den Scanmodus (Object/Room)",
            "Umrunden Sie das Objekt langsam und erfassen alle Seiten",
            "Scannen Sie fehlende Bereiche nach",
            "Schließen Sie den Scan ab",
            "Exportieren Sie als STL, OBJ, PLY oder GLB"
        ]
    },
    {
        id: 3,
        title: "Scan-Qualität überprüfen",
        subtitle: "Scan-Qualitätsprüfung",
        description: "Prüfen Sie den importierten Scan auf Vollständigkeit",
        icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
        tips: [
            "Drehen Sie das 3D-Modell in alle Richtungen",
            "Prüfen Sie besonders schwer zugängliche Bereiche",
            "Bei Problemen: Scan wiederholen"
        ],
        type: "viewer_quality",
        content: [
            "Alle Seiten erfasst",
            "Keine großen Löcher"
        ]
    },
    {
        id: 4,
        title: "Modell in Fusion 360 bearbeiten",
        subtitle: "CAD-Bearbeitung",
        description: "Mesh importieren, reparieren und für 3D-Druck optimieren",
        icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
        tips: [
            "Wandstärke: mindestens 1-2mm für PLA",
            "Überhänge über 45° benötigen Supports",
            "Achten Sie auf druckbare Geometrie"
        ],
        type: "instructions",
        banner: {
            title: "Externe Software erforderlich",
            text: "Autodesk Fusion 360"
        },
        content: [
            "Fusion 360 öffnen und neues Projekt anlegen",
            "Mesh importieren (Insert → Insert Mesh)",
            "Modell ausrichten und Ursprung setzen",
            "Mesh analysieren (auf Löcher, Artefakte prüfen)",
            "Mesh reparieren (Löcher schließen, Flächen glätten)",
            "Polygonzahl reduzieren (Mesh vereinfachen)",
            "Optional: In Solid umwandeln für CAD-Bearbeitung",
            "Für 3D-Druck optimieren (Wandstärken, Überhänge)",
            "Als STL oder 3MF exportieren"
        ]
    },
    {
        id: 5,
        title: "Druckparameter festlegen",
        subtitle: "Druck-Vorbereitung",
        description: "Definieren Sie grundlegende Druckeinstellungen",
        icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
        tips: [
            "PLA: Einsteigerfreundlich, gute Qualität",
            "PETG: Robuster, wetterbeständig",
            "Draft: Schnell, für Prototypen"
        ],
        type: "form"
    },
    {
        id: 6,
        title: "Modell in Bambu Studio slicen",
        subtitle: "Slicing",
        description: "Modell slicen und Vorschau prüfen",
        icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="4" x2="3" y2="20"></line><line x1="3" y1="4" x2="21" y2="20"></line></svg>',
        tips: [
            "Erste Layer Höhe prüfen (sollte gut haften)",
            "Kritische Bereiche in der Vorschau durchgehen",
            "Druckzeit und Materialverbrauch notieren"
        ],
        type: "instructions",
        banner: {
            title: "Externe Software erforderlich",
            text: "Bambu Studio"
        },
        content: [
            "Bambu Studio öffnen",
            "Modell importieren (STL/3MF)",
            "Drucker und Filament auswählen",
            "Modell auf Druckbett ausrichten",
            "Druckprofil wählen und Parameter konfigurieren",
            "\"Slice Plate\" klicken",
            "Vorschau prüfen (Supports, Überhänge, Layer)",
            "An Drucker senden (WLAN/Cloud/SD-Karte)"
        ]
    },
    {
        id: 7,
        title: "Physischer 3D-Druck",
        subtitle: "Druck",
        description: "Drucker vorbereiten und Druck durchführen",
        icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>',
        tips: [
            "Ersten Layer: Kritisch für Haftung",
            "Bei Problemen: Sofort stoppen",
            "Live-Kamera nutzen für Überwachung"
        ],
        type: "tasks",
        content: [
            "Druckplatte reinigen",
            "Richtiges Filament laden",
            "AMS (falls vorhanden) prüfen",
            "Druck starten",
            "Ersten Layer überwachen",
            "Druck abwarten"
        ]
    },
    {
        id: 8,
        title: "Objekt fertigstellen",
        subtitle: "Nachbearbeitung",
        description: "Supports entfernen und nachbearbeiten",
        icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
        tips: [
            "Supports mit Zange entfernen",
            "Schleifpapier: 120 → 240 → 400 grit",
            "Primer vor dem Lackieren verwenden"
        ],
        type: "tasks",
        content: [
            "Druckbett abkühlen lassen",
            "Objekt vorsichtig entnehmen",
            "Supports entfernen",
            "Oberflächen glätten (optional)",
            "Lackieren/Bemalen (optional)",
            "Qualität prüfen"
        ]
    }
];

let currentPhaseIndex = 0;
let phaseState = {}; // Store checked tasks, etc.

// Elements
const stepperEl = document.getElementById('stepper');
const currentStepDisplay = document.getElementById('current-step-display');
const phaseBadge = document.getElementById('phase-badge');
const phaseTitle = document.getElementById('phase-title');
const phaseDescription = document.getElementById('phase-description');
const phaseIcon = document.getElementById('phase-icon');
const dynamicContent = document.getElementById('dynamic-content');
const tipsList = document.getElementById('tips-list');
const btnBack = document.getElementById('btn-back');
const btnNext = document.getElementById('btn-next');
const btnSkip = document.getElementById('btn-skip');
const validationMessage = document.getElementById('validation-message');

function init() {
    // Initialize phaseState
    phasesData.forEach((phase, index) => {
        phaseState[index] = { completed: false, checks: [] };
        if(phase.type === 'tasks' || phase.type === 'viewer_quality') {
            phaseState[index].checks = new Array(phase.content.length).fill(false);
        }
    });

    renderStepper();
    renderPhase(currentPhaseIndex);
    setupEventListeners();
}

function renderStepper() {
    stepperEl.innerHTML = '';
    phasesData.forEach((phase, index) => {
        const li = document.createElement('li');
        li.className = `step ${index === currentPhaseIndex ? 'active' : ''} ${index < currentPhaseIndex || phaseState[index].completed ? 'completed' : ''}`;
        li.onclick = () => window.goToPhase(index);
        
        li.innerHTML = `
            <div class="step-marker">
                ${index < currentPhaseIndex || phaseState[index].completed 
                    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' 
                    : index + 1}
            </div>
            <span class="step-label">${phase.subtitle}</span>
        `;
        stepperEl.appendChild(li);
    });
}

function renderPhase(index) {
    const phase = phasesData[index];
    
    // Update Header
    currentStepDisplay.innerText = index + 1;
    
    // Update Title Card
    phaseBadge.innerText = phase.subtitle;
    phaseTitle.innerText = phase.title;
    phaseDescription.innerText = phase.description;
    phaseIcon.innerHTML = phase.icon;

    // Update Tips
    tipsList.innerHTML = phase.tips.map(tip => `<li>${tip}</li>`).join('');

    // Update Content
    dynamicContent.style.animation = 'none';
    dynamicContent.offsetHeight; // trigger reflow
    dynamicContent.style.animation = 'fadeIn 0.4s ease-out';
    
    document.getElementById('content-title').innerText = phase.type === 'form' ? 'Einstellungen' : (phase.type === 'tasks' ? 'Aufgaben' : 'Anleitung');

    let html = '';

    // Render based on type
    if (phase.banner) {
        html += `
            <div class="info-banner">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <div>
                    <div style="font-size: 0.75rem; text-transform: uppercase;">${phase.banner.title}</div>
                    <div style="font-weight: 500;">${phase.banner.text}</div>
                </div>
            </div>
        `;
    }

    if (phase.type === 'tasks') {
        html += '<div class="task-list">';
        phase.content.forEach((task, i) => {
            const isChecked = phaseState[index].checks[i];
            html += `
                <div class="task-item ${isChecked ? 'checked' : ''}" data-index="${i}">
                    <div class="task-checkbox">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <div class="task-label">${task}</div>
                </div>
            `;
        });
        html += '</div>';
    } 
    else if (phase.type === 'instructions' || phase.type === 'instructions_upload') {
        html += '<div class="instruction-list">';
        phase.content.forEach((inst, i) => {
            html += `
                <div class="instruction-item">
                    <div class="instruction-number">${i + 1}</div>
                    <div class="task-label">${inst}</div>
                </div>
            `;
        });
        html += '</div>';

        if (phase.type === 'instructions_upload') {
            html += `
                <div class="upload-area" onclick="simulateUpload()">
                    <svg class="upload-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <div style="font-weight: 500; font-size: 1.125rem;">Bearbeitete Datei hochladen</div>
                    <div class="upload-formats">Akzeptierte Formate: .stl, .obj, .ply, .glb</div>
                    <div id="upload-status" style="margin-top: 1rem; color: var(--success); font-weight: bold; display: none;">Datei simuliert hochgeladen!</div>
                </div>
            `;
        }
    }
    else if (phase.type === 'viewer_quality') {
        html += `
            <div class="viewer-3d">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1rem;">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span>3D-Modell Vorschau (Simulation)</span>
            </div>
            <h4 style="margin-bottom: 1rem;">Qualitätsprüfung</h4>
        `;
        phase.content.forEach((task, i) => {
            const status = phaseState[index].checks[i]; // true for ok, false for problem or unselected
            html += `
                <div class="quality-check">
                    <span>${task}</span>
                    <div class="quality-actions">
                        <button class="btn-sm btn-ok ${status === true ? 'active' : ''}" onclick="setQuality(${i}, true)">✓ OK</button>
                        <button class="btn-sm btn-prob ${status === 'prob' ? 'active' : ''}" onclick="setQuality(${i}, 'prob')">✕ Problem</button>
                    </div>
                </div>
            `;
        });
    }
    else if (phase.type === 'form') {
        html += `
            <div class="form-group">
                <label class="form-label">Drucker-Modell</label>
                <select class="form-select" onchange="validatePhase()">
                    <option value="">Bitte wählen...</option>
                    <option value="1">Bambu Lab X1 Carbon</option>
                    <option value="2">Prusa i3 MK3S+</option>
                    <option value="3">Ultimaker S5</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Filament-Typ</label>
                <select class="form-select" onchange="validatePhase()">
                    <option value="">Bitte wählen...</option>
                    <option value="1">PLA</option>
                    <option value="2">PETG</option>
                    <option value="3">ABS</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Qualitätsprofil</label>
                <select class="form-select" onchange="validatePhase()">
                    <option value="">Bitte wählen...</option>
                    <option value="1">0.12mm (Fine)</option>
                    <option value="2">0.20mm (Standard)</option>
                    <option value="3">0.28mm (Draft)</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Infill <span id="infill-val">50%</span></label>
                <div class="range-slider">
                    <input type="range" min="0" max="100" value="50" oninput="document.getElementById('infill-val').innerText = this.value + '%'">
                </div>
            </div>
            <div class="form-group" style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1.5rem;">
                <input type="checkbox" id="support-check" style="width: 18px; height: 18px; accent-color: var(--c3d-yellow);">
                <label for="support-check" class="form-label" style="margin: 0;">Support benötigt</label>
            </div>
        `;
    }

    dynamicContent.innerHTML = html;

    // Attach events for task items
    if (phase.type === 'tasks') {
        document.querySelectorAll('.task-item').forEach(item => {
            item.addEventListener('click', () => {
                const i = parseInt(item.getAttribute('data-index'));
                phaseState[index].checks[i] = !phaseState[index].checks[i];
                item.classList.toggle('checked');
                validatePhase();
            });
        });
    }

    // Finalize Buttons
    btnBack.disabled = index === 0;
    
    if (index === phasesData.length - 1) {
        btnNext.innerHTML = 'Abschließen <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    } else {
        btnNext.innerHTML = 'Weiter <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
    }

    validatePhase();
}

function validatePhase() {
    const phase = phasesData[currentPhaseIndex];
    let isValid = true;

    if (phase.type === 'tasks') {
        isValid = phaseState[currentPhaseIndex].checks.every(Boolean);
        validationMessage.querySelector('span').innerText = 'Bitte alle Aufgaben abhaken';
    } 
    else if (phase.type === 'form') {
        const selects = dynamicContent.querySelectorAll('select');
        isValid = Array.from(selects).every(s => s.value !== "");
        validationMessage.querySelector('span').innerText = 'Bitte alle Pflichtfelder ausfüllen';
    }
    else if (phase.type === 'viewer_quality') {
        isValid = phaseState[currentPhaseIndex].checks.every(c => c === true);
        validationMessage.querySelector('span').innerText = 'Bitte alle Prüfungen mit OK bestätigen';
    }
    else if (phase.type === 'instructions_upload') {
        isValid = phaseState[currentPhaseIndex].uploaded === true;
        validationMessage.querySelector('span').innerText = 'Bitte laden Sie ein Modell hoch';
    }

    if (isValid) {
        btnNext.disabled = false;
        validationMessage.classList.remove('visible');
    } else {
        btnNext.disabled = true;
        validationMessage.classList.add('visible');
    }
}

// Global scope functions for inline handlers
window.goToPhase = function(index) {
    currentPhaseIndex = index;
    renderStepper();
    renderPhase(currentPhaseIndex);
};

window.updateHelpFileName = function(input) {
    const label = document.getElementById('help-file-name');
    if (input.files && input.files[0]) {
        label.innerText = input.files[0].name;
    } else {
        label.innerText = 'Bild anhängen';
    }
};

window.submitHelp = function() {
    const text = document.getElementById('help-text').value;
    const file = document.getElementById('help-file').files[0];
    
    if (!text && !file) {
        alert('Bitte beschreiben Sie Ihr Problem oder hängen Sie ein Bild an.');
        return;
    }
    
    const btn = document.getElementById('btn-send-help');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Gesendet! ✓';
    btn.style.background = 'var(--success)';
    btn.style.color = 'white';
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.style.color = '';
        document.getElementById('help-text').value = '';
        document.getElementById('help-file').value = '';
        document.getElementById('help-file-name').innerText = 'Bild anhängen';
    }, 3000);
};

window.setQuality = function(index, value) {
    phaseState[currentPhaseIndex].checks[index] = value;
    renderPhase(currentPhaseIndex); // Re-render to update buttons
};

window.simulateUpload = function() {
    phaseState[currentPhaseIndex].uploaded = true;
    document.getElementById('upload-status').style.display = 'block';
    validatePhase();
};

function setupEventListeners() {
    btnNext.addEventListener('click', () => {
        if (currentPhaseIndex < phasesData.length - 1) {
            phaseState[currentPhaseIndex].completed = true;
            currentPhaseIndex++;
            renderStepper();
            renderPhase(currentPhaseIndex);
        } else {
            alert('Workflow abgeschlossen! Das Modell ist bereit.');
        }
    });

    btnBack.addEventListener('click', () => {
        if (currentPhaseIndex > 0) {
            currentPhaseIndex--;
            renderStepper();
            renderPhase(currentPhaseIndex);
        }
    });

    btnSkip.addEventListener('click', () => {
        if (currentPhaseIndex < phasesData.length - 1) {
            currentPhaseIndex++;
            renderStepper();
            renderPhase(currentPhaseIndex);
        } else {
            alert('Workflow abgeschlossen!');
        }
    });
}

// Start
init();
