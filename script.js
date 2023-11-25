let audioContext;

// Function to initialize AudioContext on user interaction
function initAudioContext() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

// Define Possible Notes from G/3 to B/5
const notes = [
    "G/3", "A/3", "B/3",
    "C/4", "D/4", "E/4", "F/4", "G/4", "A/4", "B/4",
    "C/5", "D/5", "E/5", "F/5", "G/5", "A/5", "B/5"
];

// Map notes to corresponding violin finger numbers
const noteToFingerMapping = {
    "G/3": "0", "A/3": "1", "B/3": "2",
    "C/4": "3", "D/4": "0", "E/4": "1", "F/4": "2", "G/4": "3", "A/4": "0", "B/4": "1",
    "C/5": "2", "D/5": "3", "E/5": "0", "F/5": "1", "G/5": "2", "A/5": "3", "B/5": "4"
};

// Function to Select a Random Note
function getRandomNote() {
    const randomIndex = Math.floor(Math.random() * notes.length);
    return notes[randomIndex];
}

// Store the currently displayed note
let currentNote = getRandomNote();

// Function to load audio
function loadAudio(url) {
    return fetch(url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer));
}

// Function to play audio
function playAudio(audioBuffer) {
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
}

// Function to create and render a note
function createAndRenderNote() {
    const VF = Vex.Flow;

    // Create an SVG renderer and attach it to the DIV element named "music-container".
    const div = document.getElementById("music-container");
    div.innerHTML = "";  // Clear the previous rendering
    const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

    // Size our SVG:
    renderer.resize(500, 200); // Adjust as needed

    // And get a drawing context:
    const context = renderer.getContext();

    // Create a stave at position 10, 40 of width 400 on the canvas.
    const stave = new VF.Stave(10, 40, 400);

    // Add a clef and time signature.
    stave.addClef("treble");

    // Connect it to the rendering context and draw!
    stave.setContext(context).draw();

    // Generate a new random note
    currentNote = getRandomNote();

    // Create the random note
    const note = new VF.StaveNote({ clef: "treble", keys: [currentNote], duration: "q" });

    // Create a voice in 4/4 and add the note
    const voice = new VF.Voice({ num_beats: 1, beat_value: 4 });
    voice.addTickables([note]);

    // Format and justify the notes to 400 pixels.
    new VF.Formatter().joinVoices([voice]).format([voice], 400);

    // Render voice
    voice.draw(context, stave);

    // Reset buttons for new note
    document.querySelectorAll("#buttons-container button, #finger-buttons-container button").forEach(button => {
        button.disabled = false; // Re-enable the button
        button.style.backgroundColor = ""; // Reset the color
    });
}

// Function to check if both note and finger are correct, then play sound and generate a new note
function checkAndGenerateNewNote() {
    const correctFinger = noteToFingerMapping[currentNote];
    const isNoteCorrect = document.querySelector(`#buttons-container button[data-note='${currentNote.charAt(0)}']`).style.backgroundColor === "green";
    const isFingerCorrect = document.querySelector(`#finger-buttons-container button[data-finger='${correctFinger}']`).style.backgroundColor === "green";

    if (isNoteCorrect && isFingerCorrect) {
        // Convert note format (e.g., "G/3" to "G3")
        const formattedNote = currentNote.replace('/', '');
        // Create the URL for the audio file
        const noteUrl = `./audio/${formattedNote}.mp3`;
        // Load and play the audio
        loadAudio(noteUrl).then(audioBuffer => {
            playAudio(audioBuffer);
        });

        setTimeout(() => {
            createAndRenderNote(); // Generate a new note
        }, 1000);
    }
}

// Add event listeners to buttons
document.querySelectorAll("#buttons-container button").forEach(button => {
    button.addEventListener("click", function() {
        const selectedNote = this.getAttribute('data-note');
        this.style.backgroundColor = selectedNote === currentNote.charAt(0) ? "green" : "red";
        this.disabled = true;
        checkAndGenerateNewNote();
    });
});

document.querySelectorAll("#finger-buttons-container button").forEach(button => {
    button.addEventListener("click", function() {
        const selectedFinger = this.getAttribute('data-finger');
        const correctFinger = noteToFingerMapping[currentNote];
        this.style.backgroundColor = selectedFinger === correctFinger ? "green" : "red";
        this.disabled = true;
        checkAndGenerateNewNote();
    });
});

// Initialize AudioContext and start the application on button click
document.getElementById('start-button').addEventListener('click', function() {
    initAudioContext();
    this.remove(); // Remove the button after it's clicked
    createAndRenderNote(); // Call this function to render the initial note
});

// Initial rendering of the note (removed as it will now be triggered by the start button)
