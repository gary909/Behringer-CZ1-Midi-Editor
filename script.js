// Variable to store the selected MIDI output port
let midiOutput = null;

// Variable to store the original text of the MIDI status element
let originalMidiStatusText = '';

// --- MIDI CC NUMBERS CZ-1 MINI ---
// Note: These are typical CC assignments for phase distortion synthesizers
// Adjust based on actual CZ-1 Mini MIDI implementation

// DCO
const CC_DCO1_WF1 = 13;
const CC_DCO2_WF2 = 14;
const CC_DCO1_DCW = 15;
const CC_LINE_SELECT = 8;

// --- HELPER FUNCTIONS ---
// Map waveform slider values to waveform names
function getWaveformName(val) {
    if (val >= 0 && val <= 18) return 'SAWTOOTH';
    if (val >= 19 && val <= 36) return 'SQUARE';
    if (val >= 37 && val <= 54) return 'PULSE';
    if (val >= 55 && val <= 72) return 'DOUBLESINE';
    if (val >= 73 && val <= 90) return 'SAW-PULSE';
    if (val >= 91 && val <= 108) return 'RESONANCE I SAW';
    if (val >= 109 && val <= 126) return 'RESONANCE II TRI';
    if (val === 127) return 'RESONANCE III TRAP';
    return 'UNKNOWN';
}

// Map line select values to line names
function getLineName(val) {
    if (val >= 0 && val <= 42) return 'Line 1';
    if (val >= 43 && val <= 84) return 'Line 2';
    if (val >= 85 && val <= 126) return 'Line 1+2';
    if (val === 127) return 'Line 1+1';
    return 'UNKNOWN';
}

// DCW 1 (Digital Controlled Wave/Filter)
const CC_DCW1_CUTOFF = 89;  // Standard filter cutoff
const CC_DCW1_RESONANCE = 71;  // Standard filter resonance
const CC_DCW1_ENV_DEPTH = 22;

// DCW 2
const CC_DCW2_CUTOFF = 23;
const CC_DCW2_RESONANCE = 24;
const CC_DCW2_ENV_DEPTH = 25;

// DCA (Digital Controlled Amplifier)
const CC_DCA_LEVEL = 7;  // Standard volume
const CC_DCA_ENV_DEPTH = 26;

// Envelope 1 (DCW 1)
const CC_ENV1_ATTACK = 73;
const CC_ENV1_DECAY = 75;
const CC_ENV1_SUSTAIN = 79;
const CC_ENV1_RELEASE = 72;

// Envelope 2 (DCW 2)
const CC_ENV2_ATTACK = 80;
const CC_ENV2_DECAY = 81;
const CC_ENV2_SUSTAIN = 82;
const CC_ENV2_RELEASE = 83;

// Envelope 3 (DCA)
const CC_ENV3_ATTACK = 85;
const CC_ENV3_DECAY = 86;
const CC_ENV3_SUSTAIN = 87;
const CC_ENV3_RELEASE = 88;

// LFO
const CC_LFO_WAVE = 27;
const CC_LFO_RATE = 28;
const CC_LFO_DELAY = 29;
const CC_LFO_DEPTH = 30;

// Modulation
const CC_MOD_WHEEL = 1;  // Standard mod wheel
const CC_AFTERTOUCH = 2;
const CC_PORTAMENTO = 5;  // Standard portamento time

// Global
const CC_MASTER_TUNE = 31;
const CC_TRANSPOSE = 32;
const CC_VOLUME = 7;  // Master volume

// --- PATCH DEFAULTS ---
const ALL_PATCH_CONTROLS = [
    // DCO
    { id: 'dco1-wf1', cc: CC_DCO1_WF1, value: 0 },
    { id: 'dco2-wf2', cc: CC_DCO2_WF2, value: 0 },
    { id: 'dco1-dcw', cc: CC_DCO1_DCW, value: 0 },
    { id: 'line-select', cc: CC_LINE_SELECT, value: 0 },
    
    // DCW 1
    { id: 'dcw1-cutoff', cc: CC_DCW1_CUTOFF, value: 127 },
    { id: 'dcw1-resonance', cc: CC_DCW1_RESONANCE, value: 0 },
    { id: 'dcw1-env-depth', cc: CC_DCW1_ENV_DEPTH, value: 64 },
    
    // DCW 2
    { id: 'dcw2-cutoff', cc: CC_DCW2_CUTOFF, value: 127 },
    { id: 'dcw2-resonance', cc: CC_DCW2_RESONANCE, value: 0 },
    { id: 'dcw2-env-depth', cc: CC_DCW2_ENV_DEPTH, value: 64 },
    
    // DCA
    { id: 'dca-level', cc: CC_DCA_LEVEL, value: 127 },
    { id: 'dca-env-depth', cc: CC_DCA_ENV_DEPTH, value: 127 },
    
    // Envelope 1
    { id: 'env1-attack', cc: CC_ENV1_ATTACK, value: 0 },
    { id: 'env1-decay', cc: CC_ENV1_DECAY, value: 64 },
    { id: 'env1-sustain', cc: CC_ENV1_SUSTAIN, value: 127 },
    { id: 'env1-release', cc: CC_ENV1_RELEASE, value: 64 },
    
    // Envelope 2
    { id: 'env2-attack', cc: CC_ENV2_ATTACK, value: 0 },
    { id: 'env2-decay', cc: CC_ENV2_DECAY, value: 64 },
    { id: 'env2-sustain', cc: CC_ENV2_SUSTAIN, value: 127 },
    { id: 'env2-release', cc: CC_ENV2_RELEASE, value: 64 },
    
    // Envelope 3
    { id: 'env3-attack', cc: CC_ENV3_ATTACK, value: 0 },
    { id: 'env3-decay', cc: CC_ENV3_DECAY, value: 64 },
    { id: 'env3-sustain', cc: CC_ENV3_SUSTAIN, value: 127 },
    { id: 'env3-release', cc: CC_ENV3_RELEASE, value: 64 },
    
    // LFO
    { id: 'lfo-wave', cc: CC_LFO_WAVE, value: 0 },
    { id: 'lfo-rate', cc: CC_LFO_RATE, value: 64 },
    { id: 'lfo-delay', cc: CC_LFO_DELAY, value: 0 },
    { id: 'lfo-depth', cc: CC_LFO_DEPTH, value: 0 },
    
    // Modulation
    { id: 'mod-wheel', cc: CC_MOD_WHEEL, value: 0 },
    { id: 'aftertouch', cc: CC_AFTERTOUCH, value: 0 },
    { id: 'portamento', cc: CC_PORTAMENTO, value: 0 },
    
    // Global
    { id: 'master-tune', cc: CC_MASTER_TUNE, value: 64 },
    { id: 'transpose', cc: CC_TRANSPOSE, value: 64 },
    { id: 'volume', cc: CC_VOLUME, value: 100 }
];

// --- INITIALIZATION ---
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
}

function onMIDIFailure() {
    console.log("Could not access MIDI devices.");
}

function onMIDISuccess(midiAccess) {
    const statusElement = document.getElementById('midi-output-select');
    populateOutputDevices(midiAccess);
    midiAccess.addEventListener('statechange', () => populateOutputDevices(midiAccess));

    const attachSlider = (ccNumber, elementId, helperFn = null) => {
        const slider = document.getElementById(elementId);
        if (!slider || !statusElement) return;

        slider.addEventListener('mousedown', () => {
            originalMidiStatusText = statusElement.options[statusElement.selectedIndex].textContent;
            statusElement.options[statusElement.selectedIndex].textContent = '';
        });

        slider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            sendMidiCC(ccNumber, val);
            statusElement.options[statusElement.selectedIndex].textContent = 
                helperFn ? helperFn(val) : `${elementId.toUpperCase().replace('-', ' ')}: ${val}`;
        });

        slider.addEventListener('mouseup', () => {
            statusElement.options[statusElement.selectedIndex].textContent = originalMidiStatusText;
        });
    };

    // Attach all sliders
    ALL_PATCH_CONTROLS.forEach(control => {
        // Use waveform name helper for waveform sliders
        if (control.id === 'dco1-wf1') {
            attachSlider(control.cc, control.id, (val) => `DCO 1 WF1: ${getWaveformName(val)}`);
        } else if (control.id === 'dco2-wf2') {
            attachSlider(control.cc, control.id, (val) => `DCO 2 WF2: ${getWaveformName(val)}`);
        } else if (control.id === 'line-select') {
            attachSlider(control.cc, control.id, (val) => `LINE SELECT: ${getLineName(val)}`);
        } else {
            attachSlider(control.cc, control.id);
        }
    });

    document.getElementById('init-patch-button')?.addEventListener('click', initPatch);
    document.getElementById('random-patch-button')?.addEventListener('click', randomPatch);
}

// --- MIDI UTILITIES ---
function populateOutputDevices(midiAccess) {
    const select = document.getElementById('midi-output-select');
    const currentId = select.value;
    select.innerHTML = '';
    if (midiAccess.outputs.size === 0) {
        select.innerHTML = '<option value="">-- No Devices --</option>';
        return;
    }
    midiAccess.outputs.forEach(output => {
        const opt = new Option(output.name, output.id);
        if (output.id === currentId || output.name.includes("CZ-1") || output.name.includes("CZ1")) {
            opt.selected = true;
        }
        select.add(opt);
    });
    connectToSelectedOutput(select.value, midiAccess);
}

function connectToSelectedOutput(portId, midiAccess) {
    midiOutput = portId ? midiAccess.outputs.get(portId) : null;
}

function sendMidiCC(cc, val) {
    if (midiOutput) midiOutput.send([0xB0, cc, val]);
}

function initPatch() {
    ALL_PATCH_CONTROLS.forEach(p => {
        const el = document.getElementById(p.id);
        if (!el) return;
        el.value = p.value;
        sendMidiCC(p.cc, p.value);
    });
}

function randomPatch() {
    ALL_PATCH_CONTROLS.forEach(p => {
        const el = document.getElementById(p.id);
        if (!el) return;
        const val = Math.floor(Math.random() * 128);
        el.value = val;
        sendMidiCC(p.cc, val);
    });
}

// --- HAMBURGER MENU LOGIC ---
const hamburger = document.getElementById('hamburger-menu');
const sideNav = document.getElementById('side-nav');
const closeBtn = document.getElementById('close-btn');
const aboutBtn = document.getElementById('about-btn');

// Open Menu
hamburger.addEventListener('click', () => {
    sideNav.style.width = "280px";
});

// Close Menu
closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    sideNav.style.width = "0";
});

// About Alert
aboutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    alert('CZ-1 MINI MIDI Editor\nVersion 1.0\nCreated for Behringer CZ-1 Mini\n\nCommunity project - use at your own risk!');
});

// Close menu if clicking anywhere outside the side-nav
window.addEventListener('click', (e) => {
    if (e.target !== hamburger && !hamburger.contains(e.target) && e.target !== sideNav && !sideNav.contains(e.target)) {
        sideNav.style.width = "0";
    }
});

// --- ACCORDION LOGIC ---
const acc = document.getElementsByClassName("accordion-header");

for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        const panel = this.nextElementSibling;
        const isActive = this.classList.contains("active");

        // Close ALL accordion sections first
        for (let j = 0; j < acc.length; j++) {
            acc[j].classList.remove("active");
            acc[j].nextElementSibling.style.maxHeight = null;
        }

        // If the one we clicked wasn't already open, open it now
        if (!isActive) {
            this.classList.add("active");
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
}
