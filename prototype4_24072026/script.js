document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. VIDEO ACADEMY CONTROLLER
    // ==========================================
    const academyTabs = document.querySelectorAll('.academy-tab');
    const academyVideo = document.getElementById('academy-video');
    const notesTitle = document.getElementById('video-notes-title');
    const notesList = document.getElementById('video-notes-list');

    const videoNotesData = {
        'intro': {
            title: 'Wichtigste Erkenntnisse - Bambu Studio Einführung:',
            src: '../Intro_ Overview of Bambu Studio.mp4',
            notes: [
                '<strong>Software-Einstieg:</strong> Bambu Studio ist das Herzstück zur Vorbereitung der Drucke für den X2D.',
                '<strong>Orientierung & Skalierung:</strong> Objekte sollten flach auf dem Druckbett ausgerichtet werden, um Haftung zu maximieren.',
                '<strong>Schichtweiser G-Code:</strong> Nach dem "Slicen" wird der 3D-Körper in 2D-Fahrbahnen für die Düse übersetzt.',
                '<strong>Vorschau-Modul:</strong> Nutzen Sie den Slider rechts im Slicer, um das Abfahren der Druckbahnen Schicht für Schicht virtuell zu prüfen.'
            ]
        },
        'hardware': {
            title: 'Wichtigste Erkenntnisse - X2D First Print Guide:',
            src: '../Bambu Lab X2D First Print Guide.mp4',
            notes: [
                '<strong>Erster Druck-Setup:</strong> Vorbereitung der Druckplatte (Säuberung) und Kalibrierung der Z-Achse.',
                '<strong>Filament-Laden:</strong> Automatisches Einziehen über das AMS und korrekte Spulenplatzierung.',
                '<strong>Druckstart & Überwachung:</strong> Der Drucker kalibriert sich vor jedem Druck selbstständig (Nivellierung & Resonanztest).',
                '<strong>Druckbett-Haftung:</strong> Die Wahl der richtigen Druckplatte und die Anwendung von Haftmitteln (falls nötig).'
            ]
        }
    };

    academyTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all
            academyTabs.forEach(t => t.classList.remove('active'));
            // Add active to current
            tab.classList.add('active');

            const videoKey = tab.getAttribute('data-video-key');
            const data = videoNotesData[videoKey];

            if (data && academyVideo) {
                // Change video src and reload/play
                academyVideo.src = encodeURI(data.src);
                academyVideo.load();

                notesTitle.textContent = data.title;
                notesList.innerHTML = '';
                data.notes.forEach(note => {
                    const li = document.createElement('li');
                    li.innerHTML = note;
                    notesList.appendChild(li);
                });
            }
        });
    });

    // ==========================================
    // 2. WIKI TABS CONTROLLER
    // ==========================================
    const wikiTabs = document.querySelectorAll('.wiki-tab-btn');
    const wikiPanels = document.querySelectorAll('.wiki-panel');

    wikiTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active state
            wikiTabs.forEach(btn => btn.classList.remove('active'));
            wikiPanels.forEach(panel => panel.classList.remove('active'));

            // Add active state to clicked
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-wiki-target');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // ==========================================
    // 3. GLOSSARY CONTROLLER (Drawer & Accordion)
    // ==========================================
    const glossaryDrawer = document.getElementById('glossary-drawer');
    const glossaryBackdrop = document.getElementById('glossary-drawer-backdrop');
    const btnOpenGlossary = document.getElementById('btn-open-glossary');
    const fabOpenGlossary = document.getElementById('glossary-drawer-trigger-fab');
    const btnCloseGlossary = document.getElementById('glossary-drawer-close');

    function openGlossary() {
        if (glossaryDrawer && glossaryBackdrop) {
            glossaryDrawer.classList.add('open');
            glossaryBackdrop.classList.add('visible');
        }
    }

    function closeGlossary() {
        if (glossaryDrawer && glossaryBackdrop) {
            glossaryDrawer.classList.remove('open');
            glossaryBackdrop.classList.remove('visible');
        }
    }

    if (btnOpenGlossary) btnOpenGlossary.addEventListener('click', openGlossary);
    if (fabOpenGlossary) fabOpenGlossary.addEventListener('click', openGlossary);
    if (btnCloseGlossary) btnCloseGlossary.addEventListener('click', closeGlossary);
    if (glossaryBackdrop) glossaryBackdrop.addEventListener('click', closeGlossary);

    const accordionTriggers = document.querySelectorAll('.accordion-trigger');

    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const currentItem = trigger.parentElement;
            const isActive = currentItem.classList.contains('active');

            // Close all items inside drawer
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.accordion-content').style.maxHeight = null;
            });

            // Toggle current item
            if (!isActive) {
                currentItem.classList.add('active');
                const content = currentItem.querySelector('.accordion-content');
                // Set max height dynamically to trigger CSS transition
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // ==========================================
    // 4. TOAST NOTIFICATION UTILITY
    // ==========================================
    const toast = document.getElementById('toast-notification');
    const toastMessage = document.getElementById('toast-message');
    let toastTimeout = null;

    function showToast(message) {
        if (!toast || !toastMessage) return;

        // Clear existing timeout
        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }

        toastMessage.textContent = message;
        toast.classList.remove('hidden');
        
        // Trigger reflow
        toast.offsetHeight;
        
        toast.classList.add('show');

        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 300);
        }, 2200);
    }
});
