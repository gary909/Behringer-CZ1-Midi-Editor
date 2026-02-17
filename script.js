// Variable to store the selected MIDI output port
let midiOutput = null;

// Variable to store the original text of the MIDI status element
let originalMidiStatusText = '';

// --- MIDI CC NUMBERS CZ-1 MINI ---
// Note: These are typical CC assignments for phase distortion synthesizers
// Adjust based on actual CZ-1 Mini MIDI implementation

// Bank Select
const CC_BANK_SELECT = 0;

// DCO 1
const CC_DCO1_WF1 = 13;
const CC_DCO2_WF2 = 14;
const CC_DCO1_DCW = 15;
const CC_LINE_SELECT = 8;

// Vibrato
const CC_VIBRATO_WAVE = 2;
const CC_VIBRATO_RATE = 3;
const CC_VIBRATO_SYNC = 4;
const CC_VIBRATO_SYNC_RATE = 5;
const CC_VIBRATO_DEPTH = 6;
const CC_VIBRATO_DELAY = 7;

// Detune
const CC_DETUNE_POLARITY = 9;
const CC_DETUNE_OCT = 10;
const CC_DETUNE_NOTE = 11;
const CC_DETUNE_FINE = 12;

// DCO 2
const CC_DCO1_WF1_LINEOFFSET = 16;
const CC_DCO1_WF2_LINEOFFSET = 17;

// DCW Params
const CC_DCO1_DCW_LINEOFFSET = 18;
const CC_DCO1_DCW_KEYFOLLOW = 19;
const CC_DCO1_DCW_KEYFOLLOW_RANGE = 20;
const CC_DCO1_DCW_KEYFOLLOW_LINEOFFSET = 23;
const CC_DCO1_DCW_KEYFOLLOW_RANGE_LINEOFFSET = 24;

// DCA Params
const CC_DCO1_DCA_KEYFOLLOW = 21;
const CC_DCO1_DCA_KEYFOLLOW_RANGE = 22;
const CC_DCO1_DCA_KEYFOLLOW_LINEOFFSET = 25;
const CC_DCO1_DCA_KEYFOLLOW_RANGE_LINEOFFSET = 26;

// DCA Level
const CC_DCA_SUSTAIN_POINT = 27;
const CC_DCA_END_POINT = 28;
const CC_DCA_LEVEL_0 = 29;
const CC_DCA_LEVEL_1 = 30;
const CC_DCA_LEVEL_2 = 31;
const CC_DCA_LEVEL_3 = 32;
const CC_DCA_LEVEL_4 = 33;
const CC_DCA_LEVEL_5 = 34;
const CC_DCA_LEVEL_6 = 35;
const CC_DCA_LEVEL_7 = 36;

// DCA Rate
const CC_DCA_RATE_0 = 37;
const CC_DCA_RATE_1 = 38;
const CC_DCA_RATE_2 = 39;
const CC_DCA_RATE_3 = 40;
const CC_DCA_RATE_4 = 41;
const CC_DCA_RATE_5 = 42;
const CC_DCA_RATE_6 = 43;
const CC_DCA_RATE_7 = 44;

// Pitch Level
const CC_PITCH_SUSTAIN_POINT = 45;
const CC_PITCH_END_POINT = 46;
const CC_PITCH_LEVEL_0 = 47;
const CC_PITCH_LEVEL_1 = 48;
const CC_PITCH_LEVEL_2 = 49;
const CC_PITCH_LEVEL_3 = 50;
const CC_PITCH_LEVEL_4 = 51;
const CC_PITCH_LEVEL_5 = 52;
const CC_PITCH_LEVEL_6 = 53;
const CC_PITCH_LEVEL_7 = 54;

// Pitch Rate
const CC_PITCH_RATE_0 = 55;
const CC_PITCH_RATE_1 = 56;
const CC_PITCH_RATE_2 = 57;
const CC_PITCH_RATE_3 = 58;
const CC_PITCH_RATE_4 = 59;
const CC_PITCH_RATE_5 = 60;
const CC_PITCH_RATE_6 = 61;
const CC_PITCH_RATE_7 = 62;

// DCW Level
const CC_DCW_SUSTAIN_POINT = 63;
const CC_DCW_END_POINT = 64;
const CC_DCW_LEVEL_0 = 65;
const CC_DCW_LEVEL_1 = 66;
const CC_DCW_LEVEL_2 = 67;
const CC_DCW_LEVEL_3 = 68;
const CC_DCW_LEVEL_4 = 69;
const CC_DCW_LEVEL_5 = 70;
const CC_DCW_LEVEL_6 = 71;
const CC_DCW_LEVEL_7 = 72;

// DCW Rate
const CC_DCW_RATE_0 = 73;
const CC_DCW_RATE_1 = 74;
const CC_DCW_RATE_2 = 75;
const CC_DCW_RATE_3 = 76;
const CC_DCW_RATE_4 = 77;
const CC_DCW_RATE_5 = 78;
const CC_DCW_RATE_6 = 79;
const CC_DCW_RATE_7 = 80;

// LFO 1
const CC_LFO1_WAVE = 81;
const CC_LFO1_AMOUNT = 82;
const CC_LFO1_RATE = 83;

// Filter EG
const CC_FILTER_ATTACK = 84;
const CC_FILTER_DECAY = 85;
const CC_FILTER_SUSTAIN = 86;
const CC_FILTER_RELEASE = 87;

// Filter
const CC_FILTER_ENV_AMOUNT = 88;
const CC_FILTER_CUTOFF = 89;
const CC_FILTER_RESONANCE = 90;

// Chorus
const CC_CHORUS_RATE = 91;
const CC_CHORUS_DEPTH = 92;

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

// Map sustain point values to point numbers (0-7)
function getSustainPointNumber(val) {
    if (val >= 0 && val <= 18) return '0';
    if (val >= 19 && val <= 36) return '1';
    if (val >= 37 && val <= 54) return '2';
    if (val >= 55 && val <= 72) return '3';
    if (val >= 73 && val <= 90) return '4';
    if (val >= 91 && val <= 108) return '5';
    if (val >= 109 && val <= 126) return '6';
    if (val >= 127 && val <= 127) return '7';
    return 'UNKNOWN';
}

// Map end point values to point numbers (0-8)
function getEndPointNumber(val) {
    if (val >= 0 && val <= 8) return '0';
    if (val >= 9 && val <= 24) return '1';
    if (val >= 25 && val <= 41) return '2';
    if (val >= 42 && val <= 59) return '3';
    if (val >= 60 && val <= 73) return '4';
    if (val >= 74 && val <= 88) return '5';
    if (val >= 89 && val <= 104) return '6';
    if (val >= 105 && val <= 120) return '7';
    if (val >= 121 && val <= 127) return '8';
    return 'UNKNOWN';
}

// Map pitch end point values to point numbers (2-8)
function getPitchEndPointNumber(val) {
    if (val >= 0 && val <= 21) return '2';
    if (val >= 22 && val <= 42) return '3';
    if (val >= 43 && val <= 63) return '4';
    if (val >= 64 && val <= 84) return '5';
    if (val >= 85 && val <= 105) return '6';
    if (val >= 106 && val <= 126) return '7';
    if (val >= 127 && val <= 127) return '8';
    return 'UNKNOWN';
}

// --- PATCH DEFAULTS ---
const ALL_PATCH_CONTROLS = [
    // DCO 1
    { id: 'dco1-wf1', cc: CC_DCO1_WF1, value: 0 },
    { id: 'dco2-wf2', cc: CC_DCO2_WF2, value: 0 },
    { id: 'dco1-dcw', cc: CC_DCO1_DCW, value: 0 },
    { id: 'line-select', cc: CC_LINE_SELECT, value: 0 },
    
    // Vibrato
    { id: 'vibrato-wave', cc: CC_VIBRATO_WAVE, value: 0 },
    { id: 'vibrato-rate', cc: CC_VIBRATO_RATE, value: 0 },
    { id: 'vibrato-sync', cc: CC_VIBRATO_SYNC, value: 0 },
    { id: 'vibrato-sync-rate', cc: CC_VIBRATO_SYNC_RATE, value: 0 },
    { id: 'vibrato-depth', cc: CC_VIBRATO_DEPTH, value: 0 },
    { id: 'vibrato-delay', cc: CC_VIBRATO_DELAY, value: 0 },
    
    // Detune
    { id: 'detune-polarity', cc: CC_DETUNE_POLARITY, value: 0 },
    { id: 'detune-oct', cc: CC_DETUNE_OCT, value: 0 },
    { id: 'detune-note', cc: CC_DETUNE_NOTE, value: 0 },
    { id: 'detune-fine', cc: CC_DETUNE_FINE, value: 0 },
    
    // DCO 2
    { id: 'dco1-wf1-lineoffset', cc: CC_DCO1_WF1_LINEOFFSET, value: 0 },
    { id: 'dco1-wf2-lineoffset', cc: CC_DCO1_WF2_LINEOFFSET, value: 0 },
    
    // DCW Params
    { id: 'dco1-dcw-lineoffset', cc: CC_DCO1_DCW_LINEOFFSET, value: 0 },
    { id: 'dco1-dcw-keyfollow', cc: CC_DCO1_DCW_KEYFOLLOW, value: 0 },
    { id: 'dco1-dcw-keyfollow-range', cc: CC_DCO1_DCW_KEYFOLLOW_RANGE, value: 0 },
    { id: 'dco1-dcw-keyfollow-lineoffset', cc: CC_DCO1_DCW_KEYFOLLOW_LINEOFFSET, value: 0 },
    { id: 'dco1-dcw-keyfollow-range-lineoffset', cc: CC_DCO1_DCW_KEYFOLLOW_RANGE_LINEOFFSET, value: 0 },
    
    // DCA Params
    { id: 'dco1-dca-keyfollow', cc: CC_DCO1_DCA_KEYFOLLOW, value: 0 },
    { id: 'dco1-dca-keyfollow-range', cc: CC_DCO1_DCA_KEYFOLLOW_RANGE, value: 0 },
    { id: 'dco1-dca-keyfollow-lineoffset', cc: CC_DCO1_DCA_KEYFOLLOW_LINEOFFSET, value: 0 },
    { id: 'dco1-dca-keyfollow-range-lineoffset', cc: CC_DCO1_DCA_KEYFOLLOW_RANGE_LINEOFFSET, value: 0 },
    
    // DCA Level
    { id: 'dca-sustain-point', cc: CC_DCA_SUSTAIN_POINT, value: 0 },
    { id: 'dca-end-point', cc: CC_DCA_END_POINT, value: 0 },
    { id: 'dca-level-1', cc: CC_DCA_LEVEL_0, value: 0 },
    { id: 'dca-level-2', cc: CC_DCA_LEVEL_1, value: 0 },
    { id: 'dca-level-3', cc: CC_DCA_LEVEL_2, value: 0 },
    { id: 'dca-level-4', cc: CC_DCA_LEVEL_3, value: 0 },
    { id: 'dca-level-5', cc: CC_DCA_LEVEL_4, value: 0 },
    { id: 'dca-level-6', cc: CC_DCA_LEVEL_5, value: 0 },
    { id: 'dca-level-7', cc: CC_DCA_LEVEL_6, value: 0 },
    { id: 'dca-level-8', cc: CC_DCA_LEVEL_7, value: 0 },
    
    // DCA Rate
    { id: 'dca-rate-1', cc: CC_DCA_RATE_0, value: 0 },
    { id: 'dca-rate-2', cc: CC_DCA_RATE_1, value: 0 },
    { id: 'dca-rate-3', cc: CC_DCA_RATE_2, value: 0 },
    { id: 'dca-rate-4', cc: CC_DCA_RATE_3, value: 0 },
    { id: 'dca-rate-5', cc: CC_DCA_RATE_4, value: 0 },
    { id: 'dca-rate-6', cc: CC_DCA_RATE_5, value: 0 },
    { id: 'dca-rate-7', cc: CC_DCA_RATE_6, value: 0 },
    { id: 'dca-rate-8', cc: CC_DCA_RATE_7, value: 0 },
    
    // Pitch Level
    { id: 'pitch-sustain-point', cc: CC_PITCH_SUSTAIN_POINT, value: 0 },
    { id: 'pitch-end-point', cc: CC_PITCH_END_POINT, value: 0 },
    { id: 'pitch-level-1', cc: CC_PITCH_LEVEL_0, value: 0 },
    { id: 'pitch-level-2', cc: CC_PITCH_LEVEL_1, value: 0 },
    { id: 'pitch-level-3', cc: CC_PITCH_LEVEL_2, value: 0 },
    { id: 'pitch-level-4', cc: CC_PITCH_LEVEL_3, value: 0 },
    { id: 'pitch-level-5', cc: CC_PITCH_LEVEL_4, value: 0 },
    { id: 'pitch-level-6', cc: CC_PITCH_LEVEL_5, value: 0 },
    { id: 'pitch-level-7', cc: CC_PITCH_LEVEL_6, value: 0 },
    { id: 'pitch-level-8', cc: CC_PITCH_LEVEL_7, value: 0 },
    
    // Pitch Rate
    { id: 'pitch-rate-1', cc: CC_PITCH_RATE_0, value: 0 },
    { id: 'pitch-rate-2', cc: CC_PITCH_RATE_1, value: 0 },
    { id: 'pitch-rate-3', cc: CC_PITCH_RATE_2, value: 0 },
    { id: 'pitch-rate-4', cc: CC_PITCH_RATE_3, value: 0 },
    { id: 'pitch-rate-5', cc: CC_PITCH_RATE_4, value: 0 },
    { id: 'pitch-rate-6', cc: CC_PITCH_RATE_5, value: 0 },
    { id: 'pitch-rate-7', cc: CC_PITCH_RATE_6, value: 0 },
    { id: 'pitch-rate-8', cc: CC_PITCH_RATE_7, value: 0 },
    
    // DCW Level
    { id: 'dcw-sustain-point', cc: CC_DCW_SUSTAIN_POINT, value: 0 },
    { id: 'dcw-end-point', cc: CC_DCW_END_POINT, value: 0 },
    { id: 'dcw-level-1', cc: CC_DCW_LEVEL_0, value: 0 },
    { id: 'dcw-level-2', cc: CC_DCW_LEVEL_1, value: 0 },
    { id: 'dcw-level-3', cc: CC_DCW_LEVEL_2, value: 0 },
    { id: 'dcw-level-4', cc: CC_DCW_LEVEL_3, value: 0 },
    { id: 'dcw-level-5', cc: CC_DCW_LEVEL_4, value: 0 },
    { id: 'dcw-level-6', cc: CC_DCW_LEVEL_5, value: 0 },
    { id: 'dcw-level-7', cc: CC_DCW_LEVEL_6, value: 0 },
    { id: 'dcw-level-8', cc: CC_DCW_LEVEL_7, value: 0 },
    
    // DCW Rate
    { id: 'dcw-rate-1', cc: CC_DCW_RATE_0, value: 0 },
    { id: 'dcw-rate-2', cc: CC_DCW_RATE_1, value: 0 },
    { id: 'dcw-rate-3', cc: CC_DCW_RATE_2, value: 0 },
    { id: 'dcw-rate-4', cc: CC_DCW_RATE_3, value: 0 },
    { id: 'dcw-rate-5', cc: CC_DCW_RATE_4, value: 0 },
    { id: 'dcw-rate-6', cc: CC_DCW_RATE_5, value: 0 },
    { id: 'dcw-rate-7', cc: CC_DCW_RATE_6, value: 0 },
    { id: 'dcw-rate-8', cc: CC_DCW_RATE_7, value: 0 },
    
    // LFO 1
    { id: 'lfo1-wave', cc: CC_LFO1_WAVE, value: 0 },
    { id: 'lfo1-amount', cc: CC_LFO1_AMOUNT, value: 0 },
    { id: 'lfo1-rate', cc: CC_LFO1_RATE, value: 0 },
    
    // Filter EG
    { id: 'filter-attack', cc: CC_FILTER_ATTACK, value: 0 },
    { id: 'filter-decay', cc: CC_FILTER_DECAY, value: 0 },
    { id: 'filter-sustain', cc: CC_FILTER_SUSTAIN, value: 0 },
    { id: 'filter-release', cc: CC_FILTER_RELEASE, value: 0 },
    
    // Filter
    { id: 'filter-cutoff', cc: CC_FILTER_CUTOFF, value: 0 },
    { id: 'filter-resonance', cc: CC_FILTER_RESONANCE, value: 0 },
    { id: 'filter-env-amount', cc: CC_FILTER_ENV_AMOUNT, value: 0 },
    
    // Chorus
    { id: 'chorus-rate', cc: CC_CHORUS_RATE, value: 0 },
    { id: 'chorus-depth', cc: CC_CHORUS_DEPTH, value: 0 }
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
    };

    // Attach all sliders
    ALL_PATCH_CONTROLS.forEach(control => {
        // Use waveform name helper for waveform sliders
        if (control.id === 'dco1-wf1') {
            attachSlider(control.cc, control.id, (val) => `DCO 1 WF1: ${getWaveformName(val)}`);
        } else if (control.id === 'dco2-wf2') {
            attachSlider(control.cc, control.id, (val) => `DCO 2 WF2: ${getWaveformName(val)}`);
        } else if (control.id === 'dco1-wf1-lineoffset') {
            attachSlider(control.cc, control.id, (val) => `DCO 2 WF1: ${getWaveformName(val)}`);
        } else if (control.id === 'dco1-wf2-lineoffset') {
            attachSlider(control.cc, control.id, (val) => `DCO 2 WF2: ${getWaveformName(val)}`);
        } else if (control.id === 'line-select') {
            // Line select needs special handling to send both CC 8 and CC 0 (BANK SELECT)
            const slider = document.getElementById(control.id);
            if (slider) {
                slider.addEventListener('mousedown', () => {
                    originalMidiStatusText = statusElement.options[statusElement.selectedIndex].textContent;
                    statusElement.options[statusElement.selectedIndex].textContent = '';
                });
                slider.addEventListener('input', (e) => {
                    const val = parseInt(e.target.value);
                    // Send CC 8 with the actual value
                    sendMidiCC(CC_LINE_SELECT, val);
                    // Send CC 0 (BANK SELECT) based on active line
                    // 0-42: Line 1 (CC 0 = 0), 43-84: Line 2 (CC 0 = 1)
                    // 85-126: Line 1+2 (CC 0 = 0), 127: Line 1+1 (CC 0 = 0)
                    const bankSelect = (val >= 43 && val <= 84) ? 1 : 0;
                    sendMidiCC(CC_BANK_SELECT, bankSelect);
                    statusElement.options[statusElement.selectedIndex].textContent = `LINE SELECT: ${getLineName(val)}`;
                });
                slider.addEventListener('mouseup', () => {
                    setTimeout(() => {
                        statusElement.options[statusElement.selectedIndex].textContent = originalMidiStatusText;
                    }, 1500);
                });
            }
        } else if (control.id === 'pitch-sustain-point') {
            attachSlider(control.cc, control.id, (val) => `PITCH SUSTAIN: ${getSustainPointNumber(val)}`);
        } else if (control.id === 'pitch-end-point') {
            attachSlider(control.cc, control.id, (val) => `PITCH END: ${getPitchEndPointNumber(val)}`);
        } else if (control.id === 'dca-sustain-point') {
            attachSlider(control.cc, control.id, (val) => `DCA SUSTAIN: ${getSustainPointNumber(val)}`);
        } else if (control.id === 'dca-end-point') {
            attachSlider(control.cc, control.id, (val) => `DCA END: ${getEndPointNumber(val)}`);
        } else if (control.id === 'dcw-sustain-point') {
            attachSlider(control.cc, control.id, (val) => `DCW SUSTAIN: ${getSustainPointNumber(val)}`);
        } else if (control.id === 'dcw-end-point') {
            attachSlider(control.cc, control.id, (val) => `DCW END: ${getEndPointNumber(val)}`);
        } else {
            attachSlider(control.cc, control.id);
        }
    });

    // Add waveform indicator updates
    document.getElementById('dco1-wf1').addEventListener('input', (e) => {
        updateWaveformIndicator(1, parseInt(e.target.value));
    });

    document.getElementById('dco2-wf2').addEventListener('input', (e) => {
        updateWaveformIndicator(2, parseInt(e.target.value));
    });

    document.getElementById('dco1-wf1-lineoffset').addEventListener('input', (e) => {
        updateWaveformIndicator(3, parseInt(e.target.value));
    });

    document.getElementById('dco1-wf2-lineoffset').addEventListener('input', (e) => {
        updateWaveformIndicator(4, parseInt(e.target.value));
    });

    // Add sustain point indicator for PITCH RATE
    document.getElementById('pitch-sustain-point').addEventListener('input', (e) => {
        const susValue = parseInt(e.target.value);
        const susNumber = getSustainPointNumber(susValue);
        
        // Remove active class from all rate indicators
        document.querySelectorAll('.rate-sustain-indicator').forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Add active class to the corresponding rate indicator (if sus is 1-7)
        if (susNumber !== '0') {
            const activeIndicator = document.querySelector(`.rate-sustain-indicator[data-rate="${susNumber}"]`);
            if (activeIndicator) {
                activeIndicator.classList.add('active');
            }
        }
    });

    // Add end point indicator for PITCH RATE
    document.getElementById('pitch-end-point').addEventListener('input', (e) => {
        const endValue = parseInt(e.target.value);
        const endNumber = getPitchEndPointNumber(endValue);
        
        // Remove active class from all end indicators
        document.querySelectorAll('.end-sustain-indicator').forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Add active class to the corresponding rate indicator (rates 2-8)
        const activeIndicator = document.querySelector(`.end-sustain-indicator[data-rate="${endNumber}"]`);
        if (activeIndicator) {
            activeIndicator.classList.add('active');
        }
    });

    // Initialize pot controls
    initPotControls();

    // Initialize line select indicator circles
    initLineIndicator();

    document.getElementById('init-patch-button')?.addEventListener('click', initPatch);
    document.getElementById('random-patch-button')?.addEventListener('click', randomPatch);
}

// --- LINE SELECT INDICATOR INITIALIZATION ---
function initLineIndicator() {
    const lineSelect = document.getElementById('line-select');
    const circles = document.querySelectorAll('.line-indicator-circles .circle');
    
    if (!lineSelect || circles.length === 0) return;
    
    // Function to update active circle
    const updateIndicator = () => {
        const value = parseInt(lineSelect.value);
        circles.forEach(circle => {
            const circleValue = parseInt(circle.getAttribute('data-value'));
            
            // Determine which circle should be active based on value ranges
            let shouldBeActive = false;
            if (circleValue === 0 && value >= 0 && value <= 42) shouldBeActive = true;
            else if (circleValue === 42 && value >= 43 && value <= 84) shouldBeActive = true;
            else if (circleValue === 85 && value >= 85 && value <= 126) shouldBeActive = true;
            else if (circleValue === 127 && value === 127) shouldBeActive = true;

            if (shouldBeActive) {
                circle.classList.add('active');
            } else {
                circle.classList.remove('active');
            }
        });
    };
    
    // Update on page load
    updateIndicator();
    
    // Update on slider change
    lineSelect.addEventListener('input', updateIndicator);
}

// --- POT CONTROL INITIALIZATION ---
function initPotControls() {
    const potControls = document.querySelectorAll('.pot-control');
    
    potControls.forEach(potControl => {
        const input = potControl.querySelector('input[type="range"]');
        const knob = potControl.querySelector('.pot-knob');
        const valueDisplay = potControl.querySelector('.pot-value');
        
        if (!input || !knob) return;
        
        // Function to update pot rotation and value display
        const updatePot = () => {
            const value = parseInt(input.value);
            const min = parseInt(input.min);
            const max = parseInt(input.max);
            
            // Calculate rotation (270 degrees range: -135 to +135)
            const percent = (value - min) / (max - min);
            const rotation = (percent * 270) - 135;
            
            knob.style.transform = `rotate(${rotation}deg)`;
            if (valueDisplay) {
                valueDisplay.textContent = value;
            }
        };
        
        // Initialize pot position
        updatePot();
        
        // Update on input change
        input.addEventListener('input', updatePot);
    });
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

// Function to get waveform index (0-7) from MIDI value
function getWaveformIndex(val) {
    if (val >= 0 && val <= 18) return 0; // SAWTOOTH
    if (val >= 19 && val <= 36) return 1; // SQUARE
    if (val >= 37 && val <= 54) return 2; // PULSE
    if (val >= 55 && val <= 72) return 3; // DOUBLESINE
    if (val >= 73 && val <= 90) return 4; // SAW-PULSE
    if (val >= 91 && val <= 108) return 5; // RESONANCE I
    if (val >= 109 && val <= 126) return 6; // RESONANCE II
    return 7; // RESONANCE III (127)
}

// Function to update waveform indicator position
function updateWaveformIndicator(dcoNumber, value) {
    const waveformIndex = getWaveformIndex(value);
    const row = waveformIndex < 4 ? 0 : 1; // Top or bottom row
    const col = waveformIndex % 4; // Column (0-3)
    
    const indicator = document.querySelector(`.wf-dco${dcoNumber}`);
    if (indicator) {
        // Position indicator under the correct waveform
        indicator.style.left = `${col * 25}%`;
        // Top row at 146px, bottom row at 296px
        const topPosition = row === 0 ? 48 : 96; // change this for line indicator position   
        // DCO 1 section: dcoNumber 1 slightly higher than 2
        // DCO 2 section: dcoNumber 3 slightly higher than 4
        let offset;
        if (dcoNumber === 1 || dcoNumber === 3) {
            offset = -4;
        } else {
            offset = -2;
        }
        indicator.style.top = `${topPosition + offset}px`;
    }
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
