let colors = [
    [255, 0, 0],    // Red
    [255, 127, 0],  // Orange
    [255, 255, 0],  // Yellow
    [127, 255, 0],  // Yellow-Green
    [0, 255, 0],    // Green
    [0, 255, 127],  // Blue-Green
    [0, 255, 255],  // Cyan
    [0, 127, 255],  // Sky Blue
    [0, 0, 255],    // Blue
    [127, 0, 255],  // Violet
    [255, 0, 255],  // Magenta
    [255, 0, 127]   // Rose
];

let shape = [];

// Note numbers array with notes from C2 to C4
let noteNumbers = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59];

// let noteNumbers = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48];
// Note numbers array with white notes only
// let noteNumbers = [36, 38, 40, 41, 43, 45, 47];
let notes = [];

let activatedNotes = [];

let lastBeatTime = 0; // The time of the last beat
let beatInterval = 60 / 160 * 1000; // The interval between beats in milliseconds

let triggerIndex = 0; // The index of the current note to be triggered

function setup() {
    createCanvas(650, 650);
    angleMode(DEGREES); // Change the mode to DEGREES

    // createCircle(noteNames, 80, colors);
    // createRings(noteNames, 100, 40);

    createCircle(80, notes, colors);

    // Accessing MIDI with webmidi.js
    WebMidi
        .enable()
        .then(onMidiEnabled)
        .catch(err => alert(err));
}

function draw() {
    background(0);

    if (millis() - lastBeatTime > beatInterval) {
        lastBeatTime = millis();
    
        // Step through activatedNotes and trigger them one by one, go back to the beginning if you reach the end
        if (activatedNotes.length > 0) {
            activatedNotes[triggerIndex % activatedNotes.length].trigger();
            triggerIndex = (triggerIndex + 1) % activatedNotes.length;
        }
    }

    // Add the x and y coordinates of activatedNotes to the shape array
    shape = activatedNotes.map(note => {
        return { x: note.x, y: note.y };
    });

    // Draw lines between the previous x, y pair in shapes to the next one
    for (let i = 0; i < shape.length - 1; i++) {
        stroke(255);
        strokeWeight(2);
        line(shape[i].x, shape[i].y, shape[i + 1].x, shape[i + 1].y);
    }
    
    for (const note in notes) {
        notes[note].hover();
        notes[note].display();

        // If user clicks on a note, activate it
        if (mouseIsPressed) {
            let d = dist(mouseX, mouseY, notes[note].x, notes[note].y);
            if (d < 10) {
                notes[note].activate();
            }
        }
    }
}

function createCircle(radius, notes, colors) {
    const initialAngle = 0; // Initial angle
    const ellipseCount = 7; // The number of ellipses for each not9u8dr45e3w2q1 `e
    const ellipseSpacing = 35; // The space between each ellipse

    for (let i = 0; i < colors.length; i++) {
        let angle = initialAngle + map(i, 0, colors.length, 0, 360); // Add initialAngle to the calculated angle
        let scales = getMinorScale(noteNumbers[i]); // Get the minor scale for the note
        // console.log(scales)

        for (let j = 0; j < ellipseCount; j++) {
            let ellipseRadius = radius + j * ellipseSpacing; // Calculate the radius for the ellipse
            let x = width / 2 + ellipseRadius * cos(angle); // Calculate the x coordinate for the ellipse
            let y = height / 2 + ellipseRadius * sin(angle); // Calculate the y coordinate for the ellipse

            // Calculate the lightness adjustment
            let lightnessAdjustment = j * 30; // Increase lightness by 20 for each subsequent ellipse

            // Apply the lightness adjustment to the RGB values
            let r = Math.min(colors[i][0] + lightnessAdjustment, 255);
            let g = Math.min(colors[i][1] + lightnessAdjustment, 255);
            let b = Math.min(colors[i][2] + lightnessAdjustment, 255);

            // fill(r, g, b); // Set the fill color with the adjusted lightness
            // ellipse(x, y, 20, 20); // Draw the ellipse

            let note = new Note(x, y, scales[j], color(r, g, b));
            notes.push(note);
        }
    }
}

// Number-based
function getMinorScale(rootNote) {
    const steps = [0, 2, 1, 2, 2, 1, 2, 2]; // Pattern of whole and half steps for a minor scale

    let scale = []; // Start with an empty scale array
    let note = rootNote; // Start with the root note

    for (let step of steps) {
        note += step; // Add the step to the note
        scale.push(note); // Add the note to the scale
    }

    return scale;
}

function midiNumberToNoteName(midiNumber) {
    const noteNames = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
    const octave = Math.floor(midiNumber / 12) - 2; // Subtract 2 instead of 1
    const noteIndex = midiNumber % 12;
    return noteNames[noteIndex] + octave;
}

// Create an object called note
class Note {
    constructor(x, y, noteNum, color) {
        this.x = x;
        this.y = y;
        this.noteNum = noteNum;
        this.noteName = midiNumberToNoteName(noteNum);
        this.color = color;
        this.stroke = color
        this.size = 20;
        this.originalSize = this.size;
        this.originalColor = this.color;
        this.activated = false;
    }

    hover() {
        // If this.activated is false
        if (!this.activated) {
            let d = dist(mouseX, mouseY, this.x, this.y);
            if (d < 10) {
                // Increase the size to 30 with lerp
                this.size = lerp(this.size, 30, 0.1);
            } else {
                // Decrease the size to 20 with lerp
                this.size = lerp(this.size, 20, 0.1);

            }
        }
    }

    activate() {
        this.activated = true;

        // this.color = (255, 255, 255);
        this.stroke = (255)

        // Retain the size at 30
        this.size = 30;

        // If this note is not in the activatedNotes array, add it
        if (!activatedNotes.includes(this)) {
            activatedNotes.push(this);
        }
    }

    deactivate() {
        this.activated = false;

        // this.color = this.originalColor;
        this.stroke = this.originalColor;

        // Retain the size at 20
        this.size = 20;

        // Remove this note from the activatedNotes array
        activatedNotes = activatedNotes.filter(note => note !== this);
    }

    trigger() {
        this.color = 255;

        // Use setTimeout to reset the size and color after a delay
        setTimeout(() => {
            // this.size = this.originalSize;
            this.color = this.originalColor;
        }, 400);

        // Play the note using MIDI
        midiOut.playNote(this.noteNum, 3, {
            velocity: 127,
            duration: 0.75
        });
    }

    display() {
        stroke(this.stroke);
        strokeWeight(2);
        fill(this.color);
        ellipse(this.x, this.y, this.size, this.size);
        fill(0);
        noStroke();
        textSize(8);
        textAlign(CENTER, CENTER);
        text(this.noteName, this.x, this.y);
    }
}

function onMidiEnabled() {
    console.log("WebMidi enabled!") 
  
    // Inputs
    console.log("Inputs:") 
    WebMidi.inputs.forEach(input => console.log(input.manufacturer, input.name));
    
    // Outputs
    console.log("Outputs:") 
    WebMidi.outputs.forEach(output => console.log(output.manufacturer, output.name));
  
    midiOut = WebMidi.getOutputByName("IAC Driver Bus 1");
}