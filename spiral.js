// Create an array of notes from C2 to C4 including sharps
let notes = ['C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2', 'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3', 'C4']

let spiralPoints = []

// Set Canvas height and width
let c = {
    "height": 1000,
    "width": 1000
};

let angle = 0;
let newAngle = 0;
let delta = 1

let oldX = c.width/2;
let oldY = c.height/2;

// Setup Function for pixel clarity, canvas creation, and DOM insertion
function setup() {
    pixelDensity(2.0);
    let canvas = createCanvas(c.width, c.height);
    canvas.parent('sketch-holder');
    background(0);

    size = 338
    spiralWidth = 10;
    angle = 1;

    // sizeSlider = createSlider(1, 1440, 1440);
    // sizeSlider.position(20, 20);
    // widthSlider = createSlider(1, 30, 1, .1);
    // widthSlider.position(20, 50);
    // angleSlider =
    //  createSlider(1, 65, 1, .1);
    // angleSlider.position(20, 80);

    drawSpiral();
}

// Draws the background and calls the function for drawing the dots
function draw() {
    // clear();
    noFill();

    placeNotes();
}

function drawSpiral() {
oldX = c.width/2;
oldY = c.height/2;

    for (let i=0; i<size; i++) {
        newAngle += delta/sqrt(1 + newAngle**2);
        x = (c.width/2) + (spiralWidth * newAngle) * Math.sin(newAngle);
        y = (c.height/2) + (spiralWidth * newAngle) * Math.cos(newAngle);
        
        stroke(100, 100, 100);
        strokeWeight(1);
        line(oldX, oldY, x, y);
        oldX = x;
        oldY = y;
        spiralPoints.push([x, y]);
    }
} 

function placeNotes() {
    // Place a circle every 14th point in the spiral
    for (let i=0; i<spiralPoints.length; i+=14) {
        let x = spiralPoints[i][0];
        let y = spiralPoints[i][1];

        // Each note should receive a different color
        // let hue = map(i, 0, spiralPoints.length, 0, 360);
        stroke(255)
        fill(10, 10, 10);
        
        // Skip the second circle
        // if (i != 14 && i != 14*2) {
            strokeWeight(1);

            // Draw the circle
            ellipse(x, y, 20, 20)

            // Add the note name to the circle
            fill(255)
            textSize(8);
            strokeWeight(0);
            textAlign(CENTER, CENTER);
            // Place the notes in sequence
            text(notes[i/14], x, y);

        // }



    }
}

function mousePressed() {
    console.log(spiralPoints)
}