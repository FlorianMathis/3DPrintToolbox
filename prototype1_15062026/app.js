// Archive Database Models for select gallery
const archiveModels = [
    {
        name: "Bronzezeitliche Gussform",
        invNumber: "2026-A12",
        fileName: "gussform_bronzezeit.stl",
        fileSize: "14.2 MB",
        image: "images/gussform_pixel.png"
    },
    {
        name: "Ringsonnenuhr antik",
        invNumber: "2026-S04",
        fileName: "sonnenuhr_ring.obj",
        fileSize: "8.7 MB",
        image: "images/sonnenuhr_pixel.png"
    },
    {
        name: "Holzverzierung Altar",
        invNumber: "2026-H08",
        fileName: "altar_ornament.3mf",
        fileSize: "32.1 MB",
        image: "images/altar_pixel.png"
    },
    {
        name: "Kelten-Pfeilspitze",
        invNumber: "2026-P09",
        fileName: "pfeilspitze_kelten.stl",
        fileSize: "5.3 MB",
        image: "images/pfeilspitze_pixel.png"
    }
];

// Active State
let projects = [];
let activeProject = null;
let uploadedFile = null;

// Profiles State
let profiles = [];
const defaultProfiles = [
    {
        id: "prof-detail",
        name: "Standarddruck: PLA",
        material: "PLA",
        desc: "Ideal für hochauflösende Oberflächen, feine Gravuren, Münzen und detaillierte Dekorationen.",
        scale: "1:1",
        targetWeight: "",
        haptics: [],
        accessories: "",
        highInfill: false,
        forcePause: false
    },
    {
        id: "prof-wood",
        name: "Naturmaterial & Haptik (PLA Wood)",
        material: "PLA",
        desc: "Für Objekte mit holzähnlicher Textur und Haptik. Nutzt Filament mit echtem Holzfaser-Anteil.",
        scale: "1:1",
        targetWeight: "",
        haptics: [],
        accessories: "",
        highInfill: false,
        forcePause: false
    },
    {
        id: "prof-petg",
        name: "Schlagfest & Zäh (PETG)",
        material: "PETG",
        desc: "Ausgezeichnete Schlagzähigkeit, witterungsbeständig und mechanisch hoch belastbar. Perfekt für Halterungen oder Objekte, die oft angefasst oder beansprucht werden.",
        scale: "1:1",
        targetWeight: "50",
        haptics: ["Mechanische Belastbarkeit (Häufiges Anfassen)"],
        accessories: "",
        highInfill: true,
        forcePause: false
    },
    {
        id: "prof-tpu",
        name: "Gummiartig, Flexibel & Stoßdämpfend (TPU)",
        material: "TPU",
        desc: "Gummiartige Elastizität (Härtegrad ca. 95A). Perfekt für elastische Dichtungen, dämpfende Unterlagen oder bruchsichere Griffe. Muss sehr langsam gedruckt werden.",
        scale: "1:1",
        targetWeight: "",
        haptics: ["Mechanische Belastbarkeit (Häufiges Anfassen)"],
        accessories: "",
        highInfill: false,
        forcePause: false
    },
    {
        id: "prof-sand",
        name: "Schweres Tastmodell (PLA Sand-Fill)",
        material: "PLA",
        desc: "Optimiert für das Befüllen mit Metallsand während des Drucks, um originale Gewichte zu simulieren. Erzwingt eine Pause bei 50% Druckhöhe.",
        scale: "2:1",
        targetWeight: "250",
        haptics: ["Gewicht/Massendichte", "Mechanische Belastbarkeit (Häufiges Anfassen)"],
        accessories: "Befüllung mit Metallsand",
        highInfill: true,
        forcePause: true
    },
    {
        id: "prof-tough",
        name: "Standard & Robust (PLA Tough)",
        material: "PLA",
        desc: "Der Allrounder für schnelle Prototypen, solide Körper und Alltagsgegenstände. Sehr leicht zu drucken mit optimierter Schlagzähigkeit im Vergleich zu Standard-PLA.",
        scale: "1:1",
        targetWeight: "50",
        haptics: [],
        accessories: "",
        highInfill: false,
        forcePause: false
    }
];

function loadProfiles() {
    const saved = localStorage.getItem("change3d_profiles");
    if (saved) {
        try {
            profiles = JSON.parse(saved);
            if (!Array.isArray(profiles) || profiles.length === 0) {
                profiles = [...defaultProfiles];
            } else {
                // Ensure default profiles are updated and upgraded
                defaultProfiles.forEach(dp => {
                    const existing = profiles.find(p => p.id === dp.id);
                    if (!existing) {
                        profiles.push(dp);
                    } else {
                        // Always sync name and description in case they were updated in the code
                        existing.name = dp.name;
                        existing.desc = dp.desc;
                        
                        if (existing.highInfill === undefined) existing.highInfill = dp.highInfill;
                        if (existing.forcePause === undefined) existing.forcePause = dp.forcePause;
                        if (existing.scale === undefined) existing.scale = dp.scale;
                        if (existing.targetWeight === undefined) existing.targetWeight = dp.targetWeight;
                        if (existing.haptics === undefined) existing.haptics = dp.haptics;
                        if (existing.accessories === undefined) existing.accessories = dp.accessories;
                    }
                });
            }
        } catch (e) {
            profiles = [...defaultProfiles];
        }
    } else {
        profiles = [...defaultProfiles];
        saveProfilesToStorage();
    }
    renderProfilesDropdown();
    renderProfilesModalList();
}

function saveProfilesToStorage() {
    localStorage.setItem("change3d_profiles", JSON.stringify(profiles));
}

function renderProfilesDropdown() {
    if (!dom.inpProfile) return;
    dom.inpProfile.innerHTML = "";
    profiles.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = p.name;
        dom.inpProfile.appendChild(opt);
    });
    updateSelectedProfileHelp();
}

function updateSelectedProfileHelp() {
    if (!dom.inpProfile) return;
    const selectedId = dom.inpProfile.value;
    const activeProf = profiles.find(p => p.id === selectedId);
    if (activeProf) {
        dom.profileDescHelpText.innerText = `${activeProf.desc} (${activeProf.material})`;
        if (dom.inpMaterial) {
            dom.inpMaterial.value = activeProf.material;
            updateMaterialDescription(activeProf.material);
        }
        if (activeProf.scale !== undefined && dom.inpScale) {
            dom.inpScale.value = activeProf.scale;
        }
        if (activeProf.targetWeight !== undefined && dom.inpWeight) {
            dom.inpWeight.value = activeProf.targetWeight;
        }
        if (activeProf.accessories !== undefined && dom.inpAccessories) {
            dom.inpAccessories.value = activeProf.accessories;
        }
        if (activeProf.haptics && Array.isArray(activeProf.haptics)) {
            document.querySelectorAll('input[name="haptics"]').forEach(cb => {
                cb.checked = activeProf.haptics.includes(cb.value);
            });
        }
    }
}

function renderProfilesModalList() {
    if (!dom.modalProfileList) return;
    dom.modalProfileList.innerHTML = "";
    profiles.forEach(p => {
        const item = document.createElement("div");
        item.className = "modal-profile-item";
        const isDefault = defaultProfiles.some(dp => dp.id === p.id);
        const deleteBtnHtml = isDefault
            ? ""
            : `<button class="btn-delete-profile" title="Löschen" onclick="deleteProfile('${p.id}', event)">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                       <polyline points="3 6 5 6 21 6"></polyline>
                       <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                       <line x1="10" y1="11" x2="10" y2="17"></line>
                       <line x1="14" y1="11" x2="14" y2="17"></line>
                   </svg>
               </button>`;

        let badgesHtml = `<span class="modal-profile-badge">${p.material}</span>`;
        if (p.highInfill) {
            badgesHtml += ` <span class="modal-profile-badge" style="background: rgba(0, 229, 255, 0.1); color: var(--accent-blue); border-color: rgba(0, 229, 255, 0.2);">Erhöhtes Infill</span>`;
        }
        if (p.forcePause) {
            badgesHtml += ` <span class="modal-profile-badge" style="background: rgba(255, 23, 68, 0.1); color: var(--accent-red); border-color: rgba(255, 23, 68, 0.2);">Pause bei 50%</span>`;
        }

        // Build parameters summary string
        const scaleText = p.scale || "1:1";
        const weightText = p.targetWeight ? `${p.targetWeight}g` : "Kein Zielgewicht";
        const hapticsText = (p.haptics && p.haptics.length > 0)
            ? p.haptics.map(h => h.split(" / ")[0].split(" (")[0]).join(", ")
            : "Kein Fokus";
        const accText = p.accessories ? ` | Zusatz: ${p.accessories}` : "";
        const paramsHtml = `<div class="modal-profile-params">Maßstab: ${scaleText} | Gewicht: ${weightText} | Fokus: ${hapticsText}${accText}</div>`;

        item.innerHTML = `
            <div class="modal-profile-title-row">
                <span class="modal-profile-name">${p.name}</span>
                <div style="display: flex; gap: 0.35rem; align-items: center;">${badgesHtml}</div>
            </div>
            <div class="modal-profile-desc">${p.desc}</div>
            ${paramsHtml}
            ${deleteBtnHtml}
        `;
        dom.modalProfileList.appendChild(item);
    });
}

window.deleteProfile = function (id, event) {
    event.stopPropagation();
    if (confirm("Möchten Sie dieses 3D-Druck-Preset wirklich löschen?")) {
        profiles = profiles.filter(p => p.id !== id);
        saveProfilesToStorage();
        renderProfilesDropdown();
        renderProfilesModalList();
    }
};

// Generate a Bambu Lab preset JSON: exact copy of the template, only name adjusted
function generateBambuPreset(profileName) {
    // Deep-copy the loaded template
    const preset = templatePreset ? JSON.parse(JSON.stringify(templatePreset)) : {
        "type": "process",
        "name": "0.08mm High Quality @BBL X2D",
        "inherits": "fdm_process_dual_0.08_nozzle_0.4",
        "from": "system",
        "setting_id": "GP217",
        "instantiation": "true",
        "bridge_flow": "1.5",
        "bridge_speed": ["25", "25", "25", "25"],
        "default_acceleration": ["4000", "4000", "1000", "1000"],
        "enable_tower_interface_features": "1",
        "initial_layer_infill_speed": ["70", "70", "100", "100"],
        "initial_layer_speed": ["50", "40", "50", "50"],
        "inner_wall_speed": ["120", "120", "100", "100"],
        "internal_solid_infill_speed": ["120", "120", "100", "100"],
        "outer_wall_acceleration": ["2000", "2000", "1000", "1000"],
        "outer_wall_speed": ["60", "60", "50", "50"],
        "overhang_2_4_speed": ["40", "40", "40", "40"],
        "overhang_4_4_speed": ["20", "20", "20", "20"],
        "prime_tower_brim_width": "-1",
        "prime_tower_width": "60",
        "print_extruder_variant": ["Direct Drive Standard", "Direct Drive High Flow", "Bowden Standard", "Bowden High Flow"],
        "sparse_infill_pattern": "gyroid",
        "sparse_infill_speed": ["100", "100", "100", "100"],
        "top_shell_thickness": "0.8",
        "top_surface_speed": ["120", "120", "100", "100"],
        "travel_speed": ["1000", "1000", "1000", "1000"],
        "compatible_printers": ["Bambu Lab X2D 0.4 nozzle"]
    };

    // Only override the name based on form input
    if (profileName) {
        preset.name = profileName;
    }

    return preset;
}

// Last generated preset for download
let lastGeneratedPreset = null;

function showPresetPreview(preset) {
    const section = document.getElementById("preset-section");
    const previewEl = document.getElementById("preset-preview");
    const downloadBtn = document.getElementById("btn-download-preset");

    if (previewEl) {
        previewEl.textContent = JSON.stringify(preset, null, 2);
    }
    if (downloadBtn) {
        downloadBtn.disabled = false;
    }
    if (section) {
        section.style.display = "block";
        // Scroll the preview into view
        section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function handleDownloadPreset() {
    if (!lastGeneratedPreset) return;
    const name = lastGeneratedPreset.name || "preset";
    const blob = new Blob([JSON.stringify(lastGeneratedPreset, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/[^a-zA-Z0-9_\-]/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Dynamically generate and display the preset preview JSON
function updatePreview() {
    const nameEl = document.getElementById("prof-name");
    const name = nameEl ? nameEl.value.trim() : "";
    const preset = generateBambuPreset(name || "Unnamed Profile");

    // Keep lastGeneratedPreset synchronized with previewed state
    lastGeneratedPreset = preset;

    const previewEl = document.getElementById("preset-preview");
    if (previewEl) {
        previewEl.textContent = JSON.stringify(preset, null, 2);
    }
}

function handleNewProfileSubmit(e) {
    e.preventDefault();

    // Gather form values for the internal profile
    const name = document.getElementById("prof-name").value.trim() || "Unnamed Profile";
    const material = document.getElementById("prof-material").value;
    const scale = document.getElementById("prof-scale").value;
    const targetWeight = document.getElementById("prof-weight").value;
    const accessories = document.getElementById("prof-accessories").value.trim();

    const highInfillEl = document.getElementById("prof-high-infill");
    const forcePauseEl = document.getElementById("prof-force-pause");
    const highInfill = highInfillEl ? highInfillEl.checked : false;
    const forcePause = forcePauseEl ? forcePauseEl.checked : false;

    const desc = document.getElementById("prof-desc").value.trim();
    const selectedExpert = document.querySelector('input[name="prof-expert"]:checked')?.value || "";
    const expertEmailMap = { "Markus": "markus@example.com", "Florian": "florian@example.com", "Sabrina": "sabrina@example.com" };
    const expertEmail = selectedExpert ? expertEmailMap[selectedExpert] : "";
    const expertComment = document.getElementById("prof-comment").value.trim();
    const haptics = Array.from(document.querySelectorAll(".prof-haptic-cb:checked")).map(cb => cb.value);

    // Save internal profile
    const newProfile = {
        id: "prof-" + Date.now(),
        name, material, scale, targetWeight, accessories,
        highInfill, forcePause, desc,
        expertName: selectedExpert, expertEmail, expertComment, haptics
    };

    profiles.push(newProfile);
    saveProfilesToStorage();
    renderProfilesDropdown();
    renderProfilesModalList();

    dom.inpProfile.value = newProfile.id;
    updateSelectedProfileHelp();

    // Generate the Bambu Lab preset (exact template structure, name adjusted)
    const preset = generateBambuPreset(name);
    lastGeneratedPreset = preset;

    // Show the preset preview section
    showPresetPreview(preset);

    // Send expert notification email
    if (expertEmail) {
        const subject = encodeURIComponent('Neues 3D\u2011Druck\u2011Preset: ' + name);
        const body = encodeURIComponent(
            `Hallo ${selectedExpert},\n\n` +
            `Ein neues 3D-Druck-Preset wurde erstellt:\n\n` +
            `Profil: ${name}\n` +
            `Material: ${material}\n` +
            `Skalierung: ${scale}\n` +
            `Zielgewicht: ${targetWeight || 'keins'}\n` +
            `Haptik: ${haptics.join(', ') || 'keine'}\n\n` +
            `Kommentar:\n${expertComment || '(kein Kommentar)'}\n\n` +
            `Das generierte Bambu Lab Preset ist im Anhang bzw. kann aus der App heruntergeladen werden.`
        );
        const mailto = `mailto:${expertEmail}?subject=${subject}&body=${body}`;
        window.open(mailto, '_blank');
    }

    alert("3D-Druck-Preset gespeichert! Die Vorschau ist unten sichtbar.");

    // Reset form but keep the preset preview visible
    dom.formNewProfile.reset();
    document.querySelectorAll(".prof-haptic-cb").forEach(cb => cb.checked = false);
    // Reset expert avatar highlights
    document.querySelectorAll('input[name="prof-expert"]').forEach(r => {
        const lbl = r.closest('label');
        lbl.style.borderColor = 'transparent';
        lbl.querySelector('img').style.borderColor = '#ccc';
    });

    // Reset live preview back to default template preview
    updatePreview();
}

// Ingest State DOM Cache
const dom = {
    projectList: document.getElementById("project-list"),
    btnNewProject: document.getElementById("btn-new-project"),
    btnWelcomeNew: document.getElementById("btn-welcome-new"),

    // Screens
    screenWelcome: document.getElementById("screen-welcome"),
    screenIngest: document.getElementById("screen-ingest"),
    screenWorkflow: document.getElementById("screen-workflow"),

    // Portal Inputs
    inpName: document.getElementById("inp-name"),
    inpInv: document.getElementById("inp-inv"),
    inpScale: document.getElementById("inp-scale"),
    inpWeight: document.getElementById("inp-weight"),
    inpMaterial: document.getElementById("inp-material"),
    materialDescText: document.getElementById("material-desc-text"),
    inpAccessories: document.getElementById("inp-accessories"),

    // Dropzone
    dropZone: document.getElementById("drop-zone"),
    fileInfo: document.getElementById("file-info"),
    fileNameText: document.getElementById("file-name-text"),
    fileSizeText: document.getElementById("file-size-text"),
    btnRemoveFile: document.getElementById("btn-remove-file"),

    // Gallery Grid
    galleryGrid: document.getElementById("gallery-grid"),

    // Actions
    btnGenerate: document.getElementById("btn-generate"),
    btnBackToPortal: document.getElementById("btn-back-to-portal"),
    btnPrintChecklist: document.getElementById("btn-print-checklist"),
    btnSaveWorkflow: document.getElementById("btn-save-workflow"),

    // Workflow elements
    wfObjectName: document.getElementById("wf-object-name"),
    wfObjectTarget: document.getElementById("wf-object-target"),
    wfObjectProfile: document.getElementById("wf-object-profile"),
    wfChecklist: document.getElementById("wf-checklist"),

    // Print Output Containers
    printLayout: document.getElementById("print-layout"),

    // AI Slicing Simulation elements
    aiOverlay: document.getElementById("ai-overlay"),
    aiTerminal: document.getElementById("ai-terminal"),

    // Settings & Profiles elements
    btnSettings: document.getElementById("btn-settings"),
    modalSettings: document.getElementById("modal-settings"),
    btnCloseSettings: document.getElementById("btn-close-settings"),
    modalProfileList: document.getElementById("modal-profile-list"),
    formNewProfile: document.getElementById("form-new-profile"),
    inpProfile: document.getElementById("inp-profile"),
    profileDescHelpText: document.getElementById("profile-desc-help-text")
};

let templatePreset = null;

// Screen navigation helper
function showScreen(screenId) {
    dom.screenWelcome.classList.add("hidden");
    dom.screenIngest.classList.add("hidden");
    dom.screenWorkflow.classList.add("hidden");

    if (screenId === "welcome") {
        dom.screenWelcome.classList.remove("hidden");
    } else if (screenId === "ingest") {
        dom.screenIngest.classList.remove("hidden");
    } else if (screenId === "workflow") {
        dom.screenWorkflow.classList.remove("hidden");
    }

    // Reset scroll position to top when transitioning screens
    window.scrollTo({ top: 0, behavior: 'instant' });
}

// Initialize App
function init() {
    // Load template preset for merging
    fetch('presets_examples/exampleprintprofiletemplate.json')
        .then(r => r.json())
        .then(data => { templatePreset = data; })
        .catch(err => console.error('Failed to load template preset', err))
        .finally(() => { updatePreview(); });

    // Attach preview listeners to all form inputs
    if (dom.formNewProfile) {
        const inputs = dom.formNewProfile.querySelectorAll('input, select, textarea');
        inputs.forEach(el => el.addEventListener('input', updatePreview));
        // Also listen for change events (radios, selects)
        inputs.forEach(el => el.addEventListener('change', updatePreview));
    }

    // Expert avatar highlighting on selection
    document.querySelectorAll('input[name="prof-expert"]').forEach(radio => {
        radio.addEventListener('change', () => {
            // Reset all avatar borders
            document.querySelectorAll('input[name="prof-expert"]').forEach(r => {
                const lbl = r.closest('label');
                lbl.style.borderColor = 'transparent';
                lbl.querySelector('img').style.borderColor = '#ccc';
            });
            // Highlight selected
            const selected = radio.closest('label');
            selected.style.borderColor = 'var(--accent-gold, #00ae42)';
            selected.querySelector('img').style.borderColor = 'var(--accent-gold, #00ae42)';
            updatePreview();
        });
    });

    // Download preset button
    const downloadBtn = document.getElementById('btn-download-preset');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', handleDownloadPreset);
    }

    loadProfiles();
    loadProjects();
    renderArchiveGallery();
    setupEventListeners();

    // Dynamic Description listener
    dom.inpMaterial.addEventListener("change", (e) => {
        updateMaterialDescription(e.target.value);
    });

    // Start with the welcome screen active by default
    showScreen("welcome");
}

// LocalStorage Persistence
function loadProjects() {
    const saved = localStorage.getItem("change3d_projects_v4");
    let loadedProjects = [];
    if (saved) {
        try {
            loadedProjects = JSON.parse(saved);
        } catch (e) {
            loadedProjects = [];
        }
    }

    if (Array.isArray(loadedProjects) && loadedProjects.length > 0) {
        projects = loadedProjects;
        // Upgrade legacy schema
        projects = projects.map(proj => {
            if (!proj.categoryC) {
                proj.categoryC = {
                    profileId: "prof-detail",
                    scale: "1:1",
                    haptics: [],
                    targetWeight: "",
                    material: "PLA",
                    color: "Blau",
                    accessories: ""
                };
            }
            if (!proj.categoryC.profileId) {
                proj.categoryC.profileId = "prof-detail";
            }
            if (!proj.checklistState) {
                proj.checklistState = {};
            }
            return proj;
        });
    } else {
        // Load defaults
        projects = [
            {
                id: "1718445600000",
                name: "Bronzezeitliche Gussform",
                invNumber: "2026-A12",
                categoryC: {
                    profileId: "prof-wood",
                    scale: "2:1",
                    haptics: ["Gewicht/Massendichte", "Mechanische Belastbarkeit (Häufiges Anfassen)"],
                    targetWeight: "250",
                    material: "PLA",
                    color: "Holzfarbe",
                    accessories: "Bruchstelle am Rand rekonstruieren"
                },
                fileName: "gussform_bronzezeit.stl",
                fileSize: "14.2 MB",
                checklistState: {}
            },
            {
                id: "1718452800000",
                name: "Ringsonnenuhr antik",
                invNumber: "2026-S04",
                categoryC: {
                    profileId: "prof-detail",
                    scale: "5:1",
                    haptics: ["Mehrfarbig"],
                    targetWeight: "",
                    material: "PLA",
                    color: "Blau",
                    accessories: "Echte Kette für Ringsonnenuhr hinzufügen"
                },
                fileName: "sonnenuhr_ring.obj",
                fileSize: "8.7 MB",
                checklistState: {}
            },
            {
                id: "1718460000000",
                name: "Holzverzierung Altar",
                invNumber: "2026-H08",
                categoryC: {
                    profileId: "prof-tpu",
                    scale: "1:1",
                    haptics: [],
                    targetWeight: "",
                    material: "TPU",
                    color: "Schwarz",
                    accessories: "Antikholz-Filament verwenden"
                },
                fileName: "altar_ornament.3mf",
                fileSize: "32.1 MB",
                checklistState: {}
            }
        ];
        saveProjectsToStorage();
    }
    renderProjectList();
}

function saveProjectsToStorage() {
    localStorage.setItem("change3d_projects_v4", JSON.stringify(projects));
}

function renderProjectList() {
    dom.projectList.innerHTML = "";
    projects.forEach(proj => {
        const item = document.createElement("div");
        item.className = `project-item ${activeProject && activeProject.id === proj.id ? 'active' : ''}`;
        item.innerHTML = `
            <div class="project-item-title">${proj.name || "Unbenanntes Objekt"}</div>
            <div class="project-item-meta">
                <span>Inv: ${proj.invNumber || "Keine"}</span>
                <span>${proj.categoryC.scale || "1:1"}</span>
            </div>
            <button class="btn-delete-project" title="Löschen" onclick="deleteProject('${proj.id}', event)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
            </button>
        `;
        item.addEventListener("click", () => {
            loadProjectIntoPortal(proj);
        });
        dom.projectList.appendChild(item);
    });
}

// Render Database models gallery
function renderArchiveGallery() {
    dom.galleryGrid.innerHTML = "";
    archiveModels.forEach(model => {
        const card = document.createElement("div");
        card.className = "archive-gallery-card";
        card.innerHTML = `
            <div class="gallery-card-img-wrapper">
                <img src="${model.image}" alt="${model.name}" class="gallery-card-image">
            </div>
            <div class="gallery-card-info">
                <div class="gallery-card-name">${model.name}</div>
                <div class="gallery-card-size">Inv: ${model.invNumber} | ${model.fileSize}</div>
            </div>
        `;
        card.addEventListener("click", () => {
            // Select active project
            dom.inpName.value = model.name;
            dom.inpInv.value = model.invNumber;
            uploadedFile = { name: model.fileName, size: model.fileSize };
            showFileInfo(model.fileName, model.fileSize);

            // Mark selected visual style
            document.querySelectorAll(".archive-gallery-card").forEach(el => el.classList.remove("selected"));
            card.classList.add("selected");
        });
        dom.galleryGrid.appendChild(card);
    });
}

function updateMaterialDescription(val) {
    let desc = "";
    switch (val) {
        case "PLA":
            desc = "PLA ist einfach zu drucken, formstabil und ideal für detailreiche, matte Oberflächen.";
            break;
        case "PETG":
            desc = "PETG ist zäh, temperaturbeständig und besitzt eine hohe Schlagfestigkeit.";
            break;
        case "TPU":
            desc = "TPU ist gummiartig, elastisch und hochgradig flexibel bei Stoßbelastungen.";
            break;
    }
    dom.materialDescText.innerText = desc;
}

function loadProjectIntoPortal(proj) {
    activeProject = proj;

    dom.inpName.value = proj.name;
    dom.inpInv.value = proj.invNumber;

    dom.inpScale.value = proj.categoryC.scale;
    dom.inpWeight.value = proj.categoryC.targetWeight || "";
    dom.inpMaterial.value = proj.categoryC.material || "PLA";
    updateMaterialDescription(dom.inpMaterial.value);

    dom.inpAccessories.value = proj.categoryC.accessories;

    // Load profile selection
    if (dom.inpProfile) {
        dom.inpProfile.value = proj.categoryC.profileId || "prof-tough";
        updateSelectedProfileHelp();
    }

    // Set color swatch radio
    const color = proj.categoryC.color || "Blau";
    const radio = document.querySelector(`input[name="obj-color"][value="${color}"]`);
    if (radio) radio.checked = true;

    // Set haptic checkboxes
    const haptics = proj.categoryC.haptics || [];
    document.querySelectorAll('input[name="haptics"]').forEach(cb => {
        cb.checked = haptics.includes(cb.value);
    });

    // Set gallery card border if matching loaded file
    document.querySelectorAll(".archive-gallery-card").forEach(card => {
        const title = card.querySelector(".gallery-card-name").innerText;
        if (title === proj.name) {
            card.classList.add("selected");
        } else {
            card.classList.remove("selected");
        }
    });

    if (proj.fileName) {
        uploadedFile = { name: proj.fileName, size: proj.fileSize };
        showFileInfo(proj.fileName, proj.fileSize);
    } else {
        uploadedFile = null;
        hideFileInfo();
    }

    showScreen("ingest");
    renderProjectList();
}

function createNewProject() {
    activeProject = {
        id: Date.now().toString(),
        name: "",
        invNumber: "",
        categoryC: {
            profileId: "prof-detail",
            scale: "1:1",
            haptics: [],
            targetWeight: "",
            material: "PLA",
            color: "Blau",
            accessories: ""
        },
        fileName: null,
        fileSize: null,
        checklistState: {}
    };

    dom.inpName.value = "";
    dom.inpInv.value = "";
    dom.inpScale.value = "1:1";
    dom.inpWeight.value = "";
    dom.inpMaterial.value = "PLA";
    updateMaterialDescription("PLA");
    dom.inpAccessories.value = "";

    if (dom.inpProfile) {
        dom.inpProfile.value = "prof-detail";
        updateSelectedProfileHelp();
    }

    const blueRadio = document.querySelector('input[name="obj-color"][value="Blau"]');
    if (blueRadio) blueRadio.checked = true;

    document.querySelectorAll('input[name="haptics"]').forEach(cb => {
        cb.checked = false;
    });

    document.querySelectorAll(".archive-gallery-card").forEach(el => el.classList.remove("selected"));

    uploadedFile = null;
    hideFileInfo();

    showScreen("ingest");

    const activeItems = dom.projectList.querySelectorAll(".project-item.active");
    activeItems.forEach(el => el.classList.remove("active"));
}

window.deleteProject = function (id, event) {
    event.stopPropagation();
    if (confirm("Möchten Sie dieses Objekt wirklich löschen?")) {
        projects = projects.filter(p => p.id !== id);
        saveProjectsToStorage();
        loadProjects();
        if (activeProject && activeProject.id === id) {
            if (projects.length > 0) {
                loadProjectIntoPortal(projects[0]);
            } else {
                createNewProject();
            }
        }
    }
};

// Event Listeners
function setupEventListeners() {
    dom.btnNewProject.addEventListener("click", createNewProject);
    dom.btnWelcomeNew.addEventListener("click", createNewProject);

    // Real file upload selection
    dom.dropZone.addEventListener("click", () => {
        let fileInput = document.getElementById("hidden-file-input");
        if (!fileInput) {
            fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.id = "hidden-file-input";
            fileInput.accept = ".stl,.obj,.3mf,.ply,.glb";
            fileInput.style.display = "none";
            document.body.appendChild(fileInput);

            fileInput.addEventListener("change", (e) => {
                const file = e.target.files[0];
                if (file) {
                    const name = file.name;
                    const size = "13.37 MB";
                    uploadedFile = { name: name, size: size };
                    showFileInfo(name, size);
                    document.querySelectorAll(".archive-gallery-card").forEach(el => el.classList.remove("selected"));
                }
                fileInput.value = ""; // clear to allow re-selecting the same file
            });
        }
        fileInput.click();
    });
    dom.btnRemoveFile.addEventListener("click", (e) => {
        e.stopPropagation();
        uploadedFile = null;
        hideFileInfo();
        document.querySelectorAll(".archive-gallery-card").forEach(el => el.classList.remove("selected"));
    });

    // Generate Button
    dom.btnGenerate.addEventListener("click", () => {
        if (!dom.inpName.value.trim()) {
            alert("Bitte geben Sie einen Objektnamen ein.");
            dom.inpName.focus();
            return;
        }
        triggerAIGeneration();
    });

    // Back to portal
    dom.btnBackToPortal.addEventListener("click", () => {
        showScreen("ingest");
    });

    // Print checklist
    dom.btnPrintChecklist.addEventListener("click", () => {
        preparePrintLayout();
        window.print();
    });

    // Save project
    dom.btnSaveWorkflow.addEventListener("click", () => {
        saveCurrentState(true);
        alert("Workflow erfolgreich lokal gespeichert!");
    });

    // Profile Settings Gear open/close listeners
    if (dom.btnSettings && dom.modalSettings && dom.btnCloseSettings) {
        dom.btnSettings.addEventListener("click", () => {
            dom.modalSettings.classList.remove("hidden");
            const presetSec = document.getElementById("preset-section");
            if (presetSec) presetSec.style.display = "none";
        });
        dom.btnCloseSettings.addEventListener("click", () => {
            dom.modalSettings.classList.add("hidden");
        });
        dom.modalSettings.addEventListener("click", (e) => {
            if (e.target === dom.modalSettings) {
                dom.modalSettings.classList.add("hidden");
            }
        });
    }

    // Dropdown selection listener
    if (dom.inpProfile) {
        dom.inpProfile.addEventListener("change", updateSelectedProfileHelp);
    }

    // New profile form submission listener
    if (dom.formNewProfile) {
        dom.formNewProfile.addEventListener("submit", handleNewProfileSubmit);
    }
}

function simulateFileUpload() {
    const fileNames = [
        "rom_coin_replica.obj",
        "stone_axe_head.stl",
        "altar_ornament.3mf",
        "bronze_spear_v2.stl",
        "urn_handle.obj"
    ];
    const mockName = fileNames[Math.floor(Math.random() * fileNames.length)];
    const mockSize = (Math.random() * 20 + 2).toFixed(1) + " MB";

    uploadedFile = { name: mockName, size: mockSize };
    showFileInfo(mockName, mockSize);
}

function showFileInfo(name, size) {
    dom.fileNameText.innerText = name;
    dom.fileSizeText.innerText = size;
    dom.fileInfo.classList.remove("hidden");
    dom.dropZone.classList.add("hidden");
}

function hideFileInfo() {
    dom.fileInfo.classList.add("hidden");
    dom.dropZone.classList.remove("hidden");
}

// Save Current State in memory and storage
function saveCurrentState(toStorage = false) {
    if (!activeProject) {
        activeProject = {
            id: Date.now().toString(),
            name: "",
            invNumber: "",
            categoryC: {
                profileId: dom.inpProfile?.value || "prof-detail",
                scale: dom.inpScale?.value || "1:1",
                haptics: [],
                targetWeight: dom.inpWeight?.value || "",
                material: dom.inpMaterial?.value || "PLA",
                color: "Blau",
                accessories: ""
            },
            fileName: null,
            fileSize: null,
            checklistState: {}
        };
    }

    activeProject.name = dom.inpName.value.trim();
    activeProject.invNumber = dom.inpInv.value.trim() || "N/A";

    const checkedHaptics = Array.from(document.querySelectorAll('input[name="haptics"]:checked')).map(el => el.value);
    const checkedColor = document.querySelector('input[name="obj-color"]:checked')?.value || "Blau";

    activeProject.categoryC.profileId = dom.inpProfile.value;
    activeProject.categoryC.scale = dom.inpScale.value;
    activeProject.categoryC.haptics = checkedHaptics;
    activeProject.categoryC.targetWeight = dom.inpWeight.value;
    activeProject.categoryC.material = dom.inpMaterial.value;
    activeProject.categoryC.color = checkedColor;
    activeProject.categoryC.accessories = dom.inpAccessories.value;
    activeProject.fileName = uploadedFile ? uploadedFile.name : null;
    activeProject.fileSize = uploadedFile ? uploadedFile.size : null;

    // Find in array
    const idx = projects.findIndex(p => p.id === activeProject.id);
    if (idx !== -1) {
        projects[idx] = activeProject;
    } else {
        projects.unshift(activeProject);
    }

    if (toStorage) {
        saveProjectsToStorage();
        renderProjectList();
    }
}

// AI Slicing suggester engine & Dynamic instructions
function compileWorkflow() {
    saveCurrentState(false);
    const proj = activeProject;

    // Variables fetch
    const haptics = proj.categoryC.haptics || [];
    const scale = proj.categoryC.scale;
    const weightVal = proj.categoryC.targetWeight;
    const targetWeight = weightVal ? parseFloat(weightVal) : 0;
    const material = proj.categoryC.material || "PLA";
    const color = proj.categoryC.color || "Blau";

    // Get Selected Print Profile
    const activeProf = profiles.find(p => p.id === proj.categoryC.profileId) || profiles[0];

    // --- Rule 1: Determine Slicing Parameters (derive internally, hide from user) ---
    let profile = activeProf ? activeProf.name : "Standard PLA Tough";
    let nozzle = "0.4 mm";
    let layerHeight = "0.20 mm";
    let temp = "220°C";

    if (activeProf) {
        if (activeProf.id === "prof-detail") {
            nozzle = "0.2 mm";
            layerHeight = "0.08 mm";
            temp = "210°C";
        } else if (activeProf.id === "prof-wood") {
            nozzle = "0.6 mm";
            layerHeight = "0.22 mm";
            temp = "220°C";
        } else if (activeProf.id === "prof-petg") {
            nozzle = "0.4 mm";
            layerHeight = "0.20 mm";
            temp = "250°C";
        } else if (activeProf.id === "prof-tpu") {
            nozzle = "0.4 mm";
            layerHeight = "0.20 mm";
            temp = "235°C";
        }
    }

    // Derive parameters based on profile details & material
    let speed = "Standard (100% / ca. 200-250 mm/s)";
    if (material === "TPU") {
        speed = "Reduziert auf 35 mm/s (Sehr langsam für Weichfilamente)";
    } else if (nozzle.includes("0.2")) {
        speed = "Reduziert auf 50% der Standardgeschwindigkeit an Außenwänden (Detaildruck)";
    } else if (nozzle.includes("0.6")) {
        speed = "Standard für 0.6mm Düse (ca. 120-150 mm/s)";
    }

    let support = "Normal / Tree (Auto) | Z-Abstand: 0.20 mm";
    if (material === "TPU") {
        support = "Tree Support (Slim) | Z-Abstand: 0.25 mm (Schwer entfernbar)";
    } else if (material === "PETG") {
        support = "Normal (Snug) | Z-Abstand: 0.22 mm";
    } else if (nozzle.includes("0.2")) {
        support = "Tree Support (Slim) | Z-Abstand: 0.20 mm (Leicht lösbar)";
    } else if (profile.includes("Wood") || nozzle.includes("0.6")) {
        support = "Tree Support (Slim) | Z-Abstand: 0.24 mm";
    }

    let filament = `Bambu ${material} (${color})`;
    if (profile.includes("Wood")) {
        filament = "Bambu PLA Wood (Holzanteil, abrasiv)";
    } else if (material === "TPU") {
        filament = "Bambu TPU (gummiartig) – in Druckkopf 4 laden";
    }

    let post = "Tree-Support mit Flachzange entfernen. Kanten mit Schleifvlies entgraten.";
    if (material === "TPU") {
        post = "Supports vorsichtig mit Skalpell / Cutter abschneiden. TPU lässt sich nicht schleifen.";
    } else if (profile.includes("Wood") || (material === "PLA" && color === "Holzfarbe")) {
        post = "Haptik-Finish: Kanten mit Schleifpapier Körnung 240 nachbearbeiten, um Holzfasern aufzurichten. Optional mit Antikwachs versiegeln.";
    } else if (material === "PETG") {
        post = "Tree-Support entfernen. Kanten bei Bedarf entgraten.";
    }

    // Scale factor multiplier computation & explicit instructions
    let scaleVal = 1.0;
    let scaleInstructions = "Modell in Originalgröße belassen (Skalierungs-Werkzeug auf 100% belassen).";
    if (scale === "2:1") {
        scaleVal = 2.0;
        scaleInstructions = "Modell verdoppeln: Taste S im Bambu Studio drücken und die Skalierung im rechten Menü auf 200% setzen.";
    } else if (scale === "5:1") {
        scaleVal = 5.0;
        scaleInstructions = "Modell verfünffachen: Taste S im Bambu Studio drücken und die Skalierung im rechten Menü auf 500% setzen.";
    }

    // Infill & Walls
    let walls = "3 Loops";
    let infill = "15% Gyroid";
    let printStopLayer = 0;
    let addedSandWeight = 0;
    let infillInstructions = "Wandlinien auf Standard (3 Loops) und Infill auf 15% Gyroid setzen.";

    const hasHighInfill = !!(activeProf?.highInfill || haptics.includes("Gewicht/Massendichte") || haptics.includes("Mechanische Belastbarkeit (Häufiges Anfassen)") || targetWeight > 0);
    const estPlasticWeight = Math.round(45 * Math.pow(scaleVal, 2.5));
    const requiresSand = targetWeight > 0 && targetWeight > estPlasticWeight;
    const hasForcePause = !!(activeProf?.forcePause || requiresSand);

    if (hasHighInfill) {
        walls = "5-6 Schleifen (Erhöht für Außenschale)";
        infill = "35% - 50% Gyroid oder 3D Honeycomb (Maximale Festigkeit)";
        infillInstructions = "Festigkeit & Dichte erhöhen: Wandlinien (Wall Loops) unter 'Festigkeit' auf 5-6 Schleifen erhöhen und Infill auf 35% Gyroid einstellen.";
    }

    if (hasForcePause) {
        printStopLayer = Math.round(130 * (1 + (scaleVal - 1) * 0.25));
        if (requiresSand) {
            addedSandWeight = Math.round(targetWeight - estPlasticWeight);
        } else {
            addedSandWeight = targetWeight > 0 ? Math.max(50, targetWeight) : 150;
        }
    }

    if (targetWeight > 0) {
        profile = "Gewichtsanpassung (PLA)";
    }

    // Technical card updates
    dom.wfObjectProfile.innerText = profile.split(" (")[0];

    // --- Rule 3: Generate 3-Phase Checklist ---
    const checklist = [];

    // PHASE 1: Datentransfer & Slicing
    let p1Items = [
        { text: `3D-Modell in Bambu Studio öffnen/importieren (${proj.fileName || "Importierte Mesh-Datei"}).` },
        { text: `<strong>Profil auswählen</strong>: Druckerprofil "${profile}" im Bambu Studio auswählen.` },
        { text: `<strong>Danach anzupassen (Skalierung)</strong>: ${scaleInstructions}` }
    ];

    if (!(targetWeight > 0) && material !== "TPU") {
        p1Items.push({ text: `<strong>Danach anzupassen (Festigkeit)</strong>: ${infillInstructions}` });
    }

    if (hasForcePause) {
        p1Items.push({
            text: `<strong>Druck-Pause einplanen (Bambu Studio Höhenschieber)</strong>: Nach dem Slicen den vertikalen Schieberegler (Höhenschieber) ganz rechts in der Vorschau auf <strong>einen geeigneten Layer (z. B. Mitte des Objekts)</strong> ziehen (Modell ist zur Hälfte gedruckt und oben offen). Machen Sie einen <strong>Rechtsklick auf das Plus-Symbol (+)</strong> direkt an der Schieberegler-Markierung und wählen Sie <strong>"Pause hinzufügen" (Add Pause)</strong>. Senden Sie erst danach die Datei an den Drucker, damit der Pause-Befehl im G-Code eingebettet ist.`,
            alert: true
        });
    }
    p1Items.push({ text: `<strong>Support aktivieren (Bambu Studio):</strong> Bei überhängenden Flächen "tree (auto)" auswählen, um automatisch geeignete Stützstrukturen zu erzeugen. Prüfen Sie, ob zusätzliche Support-Strukturen nötig sind.`, alert: true });

    if (haptics.includes("Mehrfarbig")) {
        p1Items.push({ text: `<strong>Mehrfarb-Zuweisung (Color Painting)</strong>: AMS (Automatic Material System) am Drucker mit den Filament-Farben bestücken und in Bambu Studio synchronisieren. Danach das 3D-Modell im Slicer anklicken und das Werkzeug <strong>Color Painting</strong> mit der Taste <strong>N</strong> aufrufen, um die Bereiche des Objekts manuell einzufärben.`, alert: true });
    }

    if (haptics.includes("Schrift hinzufügen")) {
        p1Items.push({
            text: `<strong>Schrift / Text hinzufügen (Bambu Studio Text-Werkzeug):</strong><br>
            <ul style="margin-top: 0.25rem; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.2rem; list-style-type: disc;">
                <li>Wählen Sie im Slicer in der oberen Symbolleiste das <strong>Text-Werkzeug ("T"-Element)</strong> aus, um eine Beschriftung, Prägung oder Gravur auf dem Modell anzubringen.</li>
                <li><strong>Text &amp; Schriftart:</strong> Geben Sie im sich öffnenden Menü den gewünschten Text (z. B. Museumsinventarnummer oder Beschriftung) ein, wählen Sie eine gut lesbare Schriftart und passen Sie die Schriftgröße an die Modellfläche an.</li>
                <li><strong>Erhaben oder Graviert:</strong> Stellen Sie über die <em>Dicke (Thickness)</em> ein, ob der Text <strong>erhaben</strong> (positiver Wert, z. B. 0.5 mm) oder <strong>vertieft / eingraviert</strong> (negativer Wert, z. B. -0.5 mm) geprägt werden soll.</li>
                <li><strong>Platzierung:</strong> Klicken Sie auf die gewünschte Stelle auf dem 3D-Modell im Slicer, um den Text zu platzieren. Nutzen Sie bei Bedarf die Werkzeuge <em>Verschieben (M)</em> oder <em>Drehen (R)</em> zur exakten Ausrichtung.</li>
            </ul>`,
            alert: true
        });
    }

    if (material === "TPU") {
        p1Items.push({
            text: `<strong>Filament laden &amp; zuweisen (Druckkopf 4 / Slot 4 für TPU):</strong><br>
            <ul style="margin-top: 0.25rem; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.2rem; list-style-type: disc;">
                <li><strong>Am 3D-Drucker (Druckkopf 4):</strong> Das TPU-Filament manuell in <strong>Druckkopf 4</strong> (bzw. Spulenhalter / Slot 4) einsetzen und entsprechend laden (am Display über das Filament-Menü den Druckkopf 4 aufheizen und das Filament bis zur Düse fördern).</li>
                <li><strong>In Bambu Studio (Auswahl &amp; Zuweisung):</strong> Wählen Sie im Slicer in der Filamentübersicht bei Platz 4 das <strong>Bambu TPU (gummiartig)</strong> aus und weisen Sie es dem 3D-Modell zu (Rechtsklick auf das Modell &gt; Filament ändern &gt; 4. TPU).</li>
                <li><strong>Wichtig bei Weichfilamenten:</strong> Da TPU gummiartig und elastisch ist, muss das Filament absolut reibungs- und spannungsfrei in den Druckkopf 4 abrollen können, um Förderprobleme oder Verheddern im Extruder zu vermeiden.</li>
            </ul>`,
            alert: true
        });
    } else {
        p1Items.push({ text: `Filament-Check: Bambu ${material}-Filament bereitstellen.` });
    }
    
    // User requested hardcoded override for this specific combination
    if (activeProf && activeProf.id === "prof-detail" && scale === "2:1") {
        p1Items = [
            { text: `3D-Modell in Bambu Studio öffnen/importieren (Importierte Mesh-Datei).` },
            { text: `Profil auswählen: Druckerprofil "${profile}" im Bambu Studio auswählen.` },
            { text: `Danach anzupassen (Skalierung): Modell verdoppeln: Taste S im Bambu Studio drücken und die Skalierung im rechten Menü auf 200% setzen.` },
            { text: `Support aktivieren (Bambu Studio): Bei überhängenden Flächen "tree (auto)" auswählen, um automatisch geeignete Stützstrukturen zu erzeugen. Prüfen Sie, ob zusätzliche Support-Strukturen nötig sind.` },
            { text: `Filament-Check: Bambu PLA Wood-Filament bereitstellen (Slot 1) und dann den Druckvorgang auslösen.` }
        ];
    }
    
    checklist.push({ title: "PHASE 1: DATENTRANSFER & SLICING (Bambu Studio)", items: p1Items });

    // PHASE 2: Der Druckprozess
    const p2Items = [
        { text: "Druck starten und die ersten 3 Layer auf Fehler überwachen." }
    ];

    if (hasForcePause) {
        p2Items.push({
            text: `<strong>!! MANUELLE BEFÜLLUNG (CA. 50% HÖHE) !!</strong><br>
            Der Drucker pausiert selbstständig beim eingestellten Layer und fährt den Druckkopf in die Warteposition.
            <ul style="margin-top: 0.25rem; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.2rem; list-style-type: disc;">
                <li>Füllen Sie vorsichtig ca. <strong>${addedSandWeight}g Metallsand</strong> (oder feinen Sand/Kies) in die offenen Hohlräume des Objekts.</li>
                <li><strong>Wichtig:</strong> Der Sand darf nicht über den Rand ragen oder auf das Druckbett verschüttet werden, um eine Kollision des Druckkopfs beim Fortsetzen zu vermeiden.</li>
                <li>Tippen Sie am Drucker-Display oder in Bambu Studio auf <strong>"Fortsetzen" (Resume)</strong>, damit der Drucker das Objekt fertigstellt und die Kavität sauber verschliesst.</li>
            </ul>`,
            danger: true
        });
    } else if (targetWeight > 0) {
        p2Items.push({
            text: `Hinweis zum Zielgewicht: Da das gewünschte Zielgewicht von ${targetWeight}g kleiner/gleich dem geschätzten Kunststoffgewicht (${estPlasticWeight}g) ist, wird kein Metallsand benötigt. Das Zielgewicht wird rein über die erhöhte Infill-Dichte reguliert.`,
            alert: true
        });
    }

    if (haptics.includes("Mehrfarbig")) {
        p2Items.push({ text: "Mehrfarbdruck überwachen: Filamentwechsel und Spülvolumen-Vorgaben kontrollieren." });
    }

    if (material === "TPU") {
        p2Items.push({ text: "<strong>TPU-Drucküberwachung (Druckkopf 4):</strong> Achten Sie beim Druckstart und in den ersten Schichten darauf, dass das gummiartige TPU von Druckkopf 4 kontinuierlich und ohne Stau im Extruder gefördert wird." });
    }

    p2Items.push({ text: "Druck fortsetzen, Gehäusetür geschlossen halten und den automatischen Druckabschluss abwarten." });
    checklist.push({ title: "PHASE 2: DER DRUCKPROZESS (Bambu Lab X2D)", items: p2Items });

    // PHASE 3: Post-Processing & Finish
    const p3Items = [
        { text: post }
    ];
    if (proj.categoryC.accessories.trim()) {
        p3Items.push({ text: `Zusatzbearbeitung ausführen: ${proj.categoryC.accessories}` });
    }
    p3Items.push({ text: `Haptischer Qualitätscheck: Fühlbarkeit der Oberfläche und Gewicht prüfen (${weightVal ? 'Ziel: ' + weightVal + 'g' : 'Standard'}).` });
    checklist.push({ title: "PHASE 3: POST-PROCESSING & FINISH", items: p3Items });

    // Render Checklist DOM
    renderChecklistDOM(checklist);

    // Cache for printing
    activeProject.compiledChecklist = checklist;
    activeProject.compiledProfile = {
        profile, nozzle, layerHeight, speed, support, filament, temp, post, walls, infill, addedSandWeight, printStopLayer, color, material, targetWeight
    };

    dom.wfObjectName.innerText = proj.name;
    dom.wfObjectTarget.innerText = haptics.map(h => h.split(" (")[0]).join(", ") || "Standard";
}

function renderChecklistDOM(checklist) {
    dom.wfChecklist.innerHTML = "";

    // Visually dominant active profile banner at the beginning of the checklist
    const proj = activeProject;
    const activeProf = profiles.find(p => p.id === proj.categoryC.profileId) || profiles[0];
    if (activeProf) {
        const banner = document.createElement("div");
        banner.className = "active-profile-banner";
        banner.innerHTML = `
            <div class="profile-banner-title">
                <span class="banner-badge">Druckprofil</span>
                <h4>${activeProf.name}</h4>
            </div>
            <p class="profile-banner-desc">${activeProf.desc}</p>
            <div class="profile-banner-instructions">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--accent-blue); flex-shrink: 0;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <span><strong>WICHTIG:</strong> Nach der Auswahl dieses Profils in Bambu Studio müssen die folgenden Aspekte angepasst werden:</span>
            </div>
        `;
        dom.wfChecklist.appendChild(banner);
    }

    checklist.forEach((phase, phaseIdx) => {
        const container = document.createElement("div");
        container.className = "phase-container";

        const header = document.createElement("div");
        header.className = "phase-header";
        header.innerHTML = `
            <div class="phase-indicator"></div>
            <h4 class="phase-title">${phase.title}</h4>
        `;
        container.appendChild(header);

        const itemsList = document.createElement("div");
        itemsList.className = "checklist-items";

        phase.items.forEach((item, itemIdx) => {
            const itemKey = `${phaseIdx}-${itemIdx}`;
            const isChecked = activeProject.checklistState[itemKey] || false;

            const row = document.createElement("div");
            row.className = `checklist-item ${isChecked ? 'checked' : ''} ${item.alert ? 'alert-item' : ''} ${item.danger ? 'danger-item' : ''}`;
            row.innerHTML = `
                <div class="checkbox-custom">
                    <svg class="checkbox-icon" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <div class="checklist-text">${item.text}</div>
            `;

            row.addEventListener("click", () => {
                const checked = !row.classList.contains("checked");
                if (checked) {
                    row.classList.add("checked");
                    activeProject.checklistState[itemKey] = true;
                } else {
                    row.classList.remove("checked");
                    delete activeProject.checklistState[itemKey];
                }
                saveCurrentState(true);
                updatePhaseStates();
            });

            itemsList.appendChild(row);
        });

        container.appendChild(itemsList);
        dom.wfChecklist.appendChild(container);
    });

    updatePhaseStates();
}

function updatePhaseStates() {
    const containers = dom.wfChecklist.querySelectorAll(".phase-container");
    containers.forEach((container, phaseIdx) => {
        const items = container.querySelectorAll(".checklist-item");
        const checks = Array.from(items).map(item => item.classList.contains("checked"));
        const allChecked = checks.length > 0 && checks.every(Boolean);
        const someChecked = checks.some(Boolean);

        container.classList.remove("completed", "active");
        if (allChecked) {
            container.classList.add("completed");
        } else if (someChecked || phaseIdx === 0) {
            container.classList.add("active");
        }
    });
}

// AI loading screen simulation
function triggerAIGeneration() {
    dom.aiOverlay.classList.add("active");
    dom.aiTerminal.innerHTML = "";

    const checkedHaptics = Array.from(document.querySelectorAll('input[name="haptics"]:checked')).map(el => el.value);
    const checkedColor = document.querySelector('input[name="obj-color"]:checked')?.value || "Blau";

    const logs = [
        { text: "=== MUSEUMS-KI ANALYSE START ===", gold: true },
        { text: "[KI] Lese Objektdaten & Metadaten ein...", blue: true },
        { text: `[KI] Objekt: "${dom.inpName.value}" | Inv-Nr: "${dom.inpInv.value || 'N/A'}"` },
        { text: `[KI] Dateigröße: ${uploadedFile ? uploadedFile.size : 'Keine Scandatei hochgeladen. Verwende Standard-Mesh.'}` },
        { text: `[KI] Kategorie C: Skalierung = ${dom.inpScale.value} | Haptik-Fokus = [${checkedHaptics.join(', ')}]` },
        { text: `[KI] Filament-Vorgabe: ${dom.inpMaterial.value} (Farbe: ${checkedColor})` },
        { text: "[KI] Berechne Slicing-Parameter für Bambu Lab X2D...", blue: true },
        { text: "[KI] Analysiere haptischen Fokus und Dichte..." },
        { text: "[KI] Ermittle optimalen Infill und Wandlinien..." },
        { text: dom.inpWeight.value ? `[KI] Zielgewicht: ${dom.inpWeight.value}g. Berechne Hohlräume und Metallsand-Dosierung...` : "[KI] Kein Zielgewicht definiert. Standard Infill gewählt." },
        { text: "[KI] Kompiliere 3-Phasen-Checkliste...", gold: true },
        { text: "=== BERECHNUNG ABGESCHLOSSEN ===", success: true }
    ];

    let index = 0;
    function printNextLine() {
        if (index < logs.length) {
            const line = document.createElement("div");
            line.className = "ai-terminal-line";
            if (logs[index].gold) line.classList.add("gold");
            if (logs[index].blue) line.classList.add("blue");
            if (logs[index].success) line.classList.add("success");
            line.innerText = logs[index].text;
            dom.aiTerminal.appendChild(line);

            dom.aiTerminal.scrollTop = dom.aiTerminal.scrollHeight;

            index++;
            setTimeout(printNextLine, 120 + Math.random() * 80);
        } else {
            setTimeout(() => {
                dom.aiOverlay.classList.remove("active");
                showScreen("workflow");
                compileWorkflow();
            }, 600);
        }
    }

    setTimeout(printNextLine, 200);
}

// Generate the print-only HTML cover and checklist sheet
function preparePrintLayout() {
    const proj = activeProject;
    const wf = proj.compiledProfile;
    const dateStr = new Date().toLocaleDateString("de-CH", { year: "numeric", month: "2-digit", day: "2-digit" });

    // 1. Fill Page 1 (Cover Deckblatt)
    document.getElementById("print-date").innerText = dateStr;
    document.getElementById("print-obj-name").innerText = proj.name || "N/A";
    document.getElementById("print-obj-inv").innerText = proj.invNumber || "N/A";
    document.getElementById("print-obj-scale").innerText = proj.categoryC.scale || "1:1";
    document.getElementById("print-obj-mat").innerText = proj.categoryC.material || "N/A";
    document.getElementById("print-obj-color").innerText = proj.categoryC.color || "Blau";
    document.getElementById("print-obj-haptics").innerText = (proj.categoryC.haptics || []).join(", ") || "Keine";
    document.getElementById("print-obj-weight").innerText = proj.categoryC.targetWeight ? `${proj.categoryC.targetWeight}g` : "Keine Gewichtsanpassung";
    document.getElementById("print-obj-acc").innerText = proj.categoryC.accessories || "Keine Zusatzvorgaben eingetragen.";

    // 2. Fill Page 2 (Checklist)
    document.getElementById("print-chk-obj-name").innerText = proj.name || "N/A";
    document.getElementById("print-chk-obj-inv").innerText = proj.invNumber || "N/A";
    document.getElementById("print-chk-obj-profile").innerText = wf.profile || "N/A";

    // Generate Checklist lists inside printout
    const listContainer = document.getElementById("print-checklist-list");
    listContainer.innerHTML = "";

    proj.compiledChecklist.forEach(phase => {
        const titleDiv = document.createElement("div");
        titleDiv.className = "print-chk-phase-title";
        titleDiv.innerText = phase.title;
        listContainer.appendChild(titleDiv);

        phase.items.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "print-chk-item";
            itemDiv.innerHTML = `
                <span class="print-check-box"></span>
                <span class="print-chk-text">${item.text}</span>
            `;
            listContainer.appendChild(itemDiv);
        });
    });
}

// Start Application
window.addEventListener("DOMContentLoaded", init);
