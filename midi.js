// Initialize MIDI.js
MIDI.loadPlugin({
    soundfontUrl: "./soundfont/",
    instrument: "violin",
    onsuccess: function() {
        console.log("MIDI.js is ready!");
    }
});

// Function to play a note
function playMIDINote(note) {
    // Convert note to MIDI note number (e.g., "C4" to 60)
    const midiNoteNumber = MIDI.keyToNote[note];
    MIDI.noteOn(0, midiNoteNumber, 127, 0);
    MIDI.noteOff(0, midiNoteNumber, 0.75);
}

// ... rest of your code ...
