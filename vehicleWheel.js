let circles = [];
circles.closed = false;
let vehicle = {x: 0, y: 0, targetIndex: 0, firstActivated: false, direction: 1};
let notes = ['C1', 'Db1', 'D1', 'Eb1'];

let collisionCheckers = [];

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES);
//   noLoop();

//   let maxRadius = min(width, height) / 2;
//   let circlesPerRing = 6;
//   let ringGap = 50;

//   for (let r = ringGap; r < maxRadius; r += ringGap) {
//     let circlesInThisRing = circlesPerRing * (r / ringGap);
//     for (let i = 0; i < circlesInThisRing; i++) {
//       let angle = map(i, 0, circlesInThisRing, 0, 360);
//       let x = r * cos(angle);
//       let y = r * sin(angle);
//       let hue = map(i, 0, circlesInThisRing, 0, 360);
//       circles.push({x: x, y: y, hue: hue, activated: false, activatedAt: 0});
//     }
//   }

    let cycles = generateCycles(notes);
    let maxRadius = min(width, height) / 2.5;
    let ringGap = maxRadius / cycles.length;

    for (let r = 0; r < cycles.length; r++) {

    let circlesInThisRing = cycles[r].length;
    for (let i = 0; i < circlesInThisRing; i++) {
            let angle = map(i, 0, circlesInThisRing, 0, 360);
            let x = (r + 1) * ringGap * cos(angle);
            let y = (r + 1) * ringGap * sin(angle);
            let hue = map(i, 0, circlesInThisRing, 0, 360);
            // In the setup function, when creating the circles
            circles.push(new Circle(x, y, hue, cycles[r][i]));
        }
    }

    // Create a collision checker for every circle, a collision checker is just a true or false statement
    for (let i = 0; i < circles.length; i++) {
        collisionCheckers.push(false);
    }

    // Accessing MIDI with webmidi.js
    WebMidi
        .enable()
        .then(onMidiEnabled)
        .catch(err => alert(err));
}

function draw() {
    background(0);
    translate(width / 2, height / 2);
    colorMode(HSB);
  
    for (let circle of circles) {
      let c = circle.activated ? color(0, 0, 100) : color(circle.hue, 100, 100);
      fill(c);
      noStroke(); // remove stroke for the circles
      ellipse(circle.x, circle.y, 25, 25);

      fill(0)
      textSize(10);
      textAlign(CENTER, CENTER); // center the text horizontally and vertically
      text(circle.note, circle.x, circle.y);
    }

    let activatedCircles = circles.filter(circle => circle.activated).sort((a, b) => a.activatedAt - b.activatedAt);

    if (activatedCircles.length > 0) {
        // Draw lines between activated circles
        stroke(255); // white color for the line
        for (let i = 0; i < activatedCircles.length - 1; i++) {
            line(activatedCircles[i].x, activatedCircles[i].y, activatedCircles[i + 1].x, activatedCircles[i + 1].y);
        }

        // If path is closed, draw line between the last and the first activated circle
        if (circles.closed) {
            line(activatedCircles[0].x, activatedCircles[0].y, activatedCircles[activatedCircles.length - 1].x, activatedCircles[activatedCircles.length - 1].y);
        }
    
        let target = activatedCircles[vehicle.targetIndex];
        let distance = dist(vehicle.x, vehicle.y, target.x, target.y);

        if (distance < 1) { // if the vehicle is close enough to the target
            vehicle.targetIndex += vehicle.direction;
            if (vehicle.targetIndex >= activatedCircles.length || vehicle.targetIndex < 0) { // if the vehicle has reached the end of the path
                vehicle.direction *= -1; // reverse direction
                vehicle.targetIndex += vehicle.direction; // move to the next target in the new direction
            }
        } else {
            let moveSpeed = 0.1; // adjust this to change the speed of the vehicle
            vehicle.x = lerp(vehicle.x, target.x, moveSpeed);
            vehicle.y = lerp(vehicle.y, target.y, moveSpeed);
        }
    
        fill(255, 255, 255); // make the vehicle red
        ellipse(vehicle.x, vehicle.y, 10, 10); // draw the vehicle
    }

    // For every circle, check if the vehicle is over it using the checkCollision function
    checkCollision(vehicle, circles);
    
  }
  
function mousePressed() {
    for (let circle of circles) {
        let distance = dist(mouseX - width / 2, mouseY - height / 2, circle.x, circle.y);
        if (distance < 10) { // assuming the radius of the circle is 10
        if (circle.activated) {
            circles.closed = true;
        } else if (!circles.closed) {
            circle.activated = true;
            circle.activatedAt = frameCount;
            if (!vehicle.firstActivated) { // if this is the first circle being activated
            vehicle.x = circle.x;
            vehicle.y = circle.y;
            vehicle.firstActivated = true;
            }
        }
        }
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

function checkCollision(agent, tiles) {
    // Check collisions between agent and note

    // For every element in the chords array
    for (let i = 0; i < tiles.length; i++) {
    // Check if the tile has a weight greater than 0
    if (tiles[i].activated == true) {
        // Check if the agent is over the tile
        if(tiles[i].contains(agent.x, agent.y)) {
            // If the agent is over the tile, check if the collision checker is false
            if (collisionCheckers[i] == false) {
                    // If the collision checker is false, play a note and set the collision checker to true
                    collisionCheckers[i] = true

                    // Get note from the tile
                    let note = tiles[i].note
                    // Convert note to MIDI note number
                    console.log(note)
                    console.log(noteToMidi(note))
                    let midiNote = noteToMidi(note)

                    midiOut.sendNoteOn(midiNote)
                    
                    // return true
            }
        } else {
            if (collisionCheckers[i] == true) {
                    // If the collision checker is true, stop the note and set the collision checker to false
                    collisionCheckers[i] = false
                    
                    // Get note from the tile
                    let note = tiles[i].note
                    // Convert note to MIDI note number
                    let midiNote = noteToMidi(note)

                    midiOut.sendNoteOff(midiNote)
                    // console.log('Stop')

                    // return false
                }
            }
        }
    }
}

function noteToMidi(note) {
    const noteMap = {
        'C': 0,
        'C#': 1, 'Db': 1,
        'D': 2,
        'D#': 3, 'Eb': 3,
        'E': 4, 'Fb': 4,
        'F': 5, 'E#': 5,
        'F#': 6, 'Gb': 6,
        'G': 7,
        'G#': 8, 'Ab': 8,
        'A': 9,
        'A#': 10, 'Bb': 10,
        'B': 11, 'Cb': 11
    };

    const octave = parseInt(note.slice(-1));
    const key = note.slice(0, note.length - 1);

    return noteMap[key] + (octave + 1) * 12;
}

function midiToNote(midi) {
    const noteMap = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
    const octave = Math.floor(midi / 12);
    const note = noteMap[midi % 12];
    return note + octave;
}

function generateNotes(root) {
    const transformations = [0, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7];
    let midiRoot = noteToMidi(root);
    let notes = [root];

    for (let i = 1; i < transformations.length; i++) {
        midiRoot += transformations[i];
        notes.push(midiToNote(midiRoot));
    }

    return notes;
}

function generateCycles(notes) {
    let cycles = [];

    for (let note of notes) {
        cycles.push(generateNotes(note));
    }

    return cycles;
}

// Get total number of notes in all cycles
function getTotalNotes(cycles) {
    return cycles.reduce((total, cycle) => total + cycle.length, 0);
}

class Circle {
    constructor(x, y, hue, note) {
        this.x = x;
        this.y = y;
        this.hue = hue;
        this.activated = false;
        this.activatedAt = 0;
        this.note = note;
        this.w = 25; // width of the circle
        this.h = 25; // height of the circle
    }

    contains(x, y) {
        return (x > this.x - this.w / 2 && x < this.x + this.w / 2 && y > this.y - this.h / 2 && y < this.y + this.h / 2);
    }
}