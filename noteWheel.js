let circles = [];
circles.closed = false;

let notes = ['C1', 'Db1', 'D1', 'Eb1'];

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
          circles.push({x: x, y: y, hue: hue, activated: false, activatedAt: 0, note: cycles[r][i]});
      }
    }
}

function draw() {
    background(0);
    translate(width / 2, height / 2);
    colorMode(HSB);
  
    for (let circle of circles) {
      let c = circle.activated ? color(0, 0, 100) : color(circle.hue, 100, 100);

      fill(c);
      noStroke(); // remove stroke for the circles
      ellipse(circle.x, circle.y, 24, 24);

      fill(0)
      // In the draw function, when drawing the circles
      textSize(10);
      textAlign(CENTER, CENTER); // center the text horizontally and vertically
      text(circle.note, circle.x, circle.y);
    }

    let activatedCircles = circles.filter(circle => circle.activated).sort((a, b) => a.activatedAt - b.activatedAt);

    for (let i = 0; i < activatedCircles.length; i++) {
      if (i < activatedCircles.length - 1) { // don't draw a line for the last circle
        stroke(255); // white color for the line
        line(activatedCircles[i].x, activatedCircles[i].y, activatedCircles[i + 1].x, activatedCircles[i + 1].y);
      }
    }

    if (circles.closed) {
        let firstCircle = activatedCircles[0];
        stroke(255); // white color for the line
        line(activatedCircles[activatedCircles.length - 1].x, activatedCircles[activatedCircles.length - 1].y, firstCircle.x, firstCircle.y);
      }
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

    return noteMap[key] + octave * 12;
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
