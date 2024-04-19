// let noteNames = ['C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2', 'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3']
// let noteNames = ['C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2']
let notes = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48];

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

function setup() {
    createCanvas(600, 600);
    angleMode(DEGREES); // Change the mode to DEGREES

    // createCircle(noteNames, 80, colors);
    // createRings(noteNames, 100, 40);

    drawCircle(80, notes, colors);
}

function draw() {
    // background(0);
    
    // Display all the notes
    // for (let note of notes) {
    //     note.display();
    // }
}

// V1
// function createCircle(noteNames, radius, colors) {
//     const initialAngle = -90; // Initial angle

//     // Fill the notes array 
//     for (let i = 0; i < noteNames.length; i++) {
//         let angle = initialAngle + map(i, 0, noteNames.length, 0, 360); // Add initialAngle to the calculated angle
//         let x = width / 2 + radius * cos(angle); // Calculate the x coordinate
//         let y = height / 2 + radius * sin(angle); // Calculate the y coordinate
//         let color = colors[i % colors.length]; // Get the color from the colors array, looping back to the start if necessary
//         let note = new Note(x, y, noteNames[i], color); // Create a new note object
//         notes.push(note); // Add the note to the notes array
//     }
// }

// V2
// function createCircle(noteNames, radius, colors) {
//     const initialAngle = -90; // Initial angle
//     const scaleRadius = 40; // The distance between each note in the scale
//     let color;

//     // Fill the notes array 
//     for (let i = 0; i < noteNames.length; i++) {
//         // Loop through the colors array and assign a color to the note
//         for (let j = 0; j < colors.length; j++) {
//             if (i % colors.length == j) {
//                 color = colors[j];
//             }
//         }

//         let angle = initialAngle + map(i, 0, noteNames.length, 0, 360); // Add initialAngle to the calculated angle
//         let x = width / 2 + radius * cos(angle); // Calculate the x coordinate
//         let y = height / 2 + radius * sin(angle); // Calculate the y coordinate

//         console.log(color)
//         let note = new Note(x, y, noteNames[i], color); // Create a new note object
//         notes.push(note); // Add the note to the notes array

//         // Get the minor scale for the note
//         let minorScale = getMinorScale(noteNames[i]);

//         // For each note in the minor scale, calculate a position that is vertically above the original note
//         let rotationAngle = 90; // Define a rotation angle outside the loop

//         for (let j = 0; j < minorScale.length; j++) {
//             let scaleAngle = angle - 90 + rotationAngle; // Add the rotation angle to the scale angle
//             let scaleRadiusMultiplier = radius + scaleRadius * (j + 1); // The radius for the scale notes increases with each note
//             let scalex = width / 2 + scaleRadiusMultiplier * cos(scaleAngle); // Calculate the x coordinate for the scale note
//             let scaley = height / 2 + scaleRadiusMultiplier * sin(scaleAngle); // Calculate the y coordinate for the scale note
//             console.log(color)
//             let scaleNote = new Note(scalex, scaley, minorScale[j], color); // Create a new note object for the scale note, using the same color as the original note
//             notes.push(scaleNote); // Add the scale note to the notes array
//         }
//     }
// }


// V3
function drawCircle(radius, notes, colors) {
    const initialAngle = -90; // Initial angle
    const ellipseCount = 7; // The number of ellipses for each note
    const ellipseSpacing = 35; // The space between each ellipse

    for (let i = 0; i < colors.length; i++) {
        let angle = initialAngle + map(i, 0, colors.length, 0, 360); // Add initialAngle to the calculated angle

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

            fill(r, g, b); // Set the fill color with the adjusted lightness
            ellipse(x, y, 20, 20); // Draw the ellipse
        }
    }
}



function createRings(noteNames, initialRadius, radiusIncrement) {
    let radius = initialRadius;

    for (let i = 0; i < noteNames.length; i += 6) {
        let chunk = noteNames.slice(i, i + 6); // Get a chunk of six notes
        createCircle(chunk, radius); // Create a circle with these notes
        radius += radiusIncrement; // Increase the radius for the next circle
    }
}

// Number-based
function getMinorScale(rootNote) {
    const steps = [2, 1, 2, 2, 1, 2, 2]; // Pattern of whole and half steps for a minor scale

    let scale = []; // Start with an empty scale array
    let note = rootNote; // Start with the root note

    for (let step of steps) {
        note += step; // Add the step to the note
        scale.push(note); // Add the note to the scale
    }

    return scale;
}

// Name-based
// function getMinorScale(rootNote) {
//     const allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
//     const steps = [2, 1, 2, 2, 1, 2, 2]; // Pattern of whole and half steps for a minor scale

//     let rootIndex = allNotes.indexOf(rootNote.slice(0, -1)); // Get the index of the root note in the allNotes array
//     let octave = rootNote.slice(-1); // Get the octave of the root note

//     let scale = []; // Start with an empty scale array

//     for (let step of steps) {
//         rootIndex = (rootIndex + step) % allNotes.length; // Calculate the index of the next note in the scale
//         if (rootIndex < step - 1) octave++; // If we've looped back to the start of the array, increment the octave
//         scale.push(allNotes[rootIndex] + octave); // Add the next note to the scale
//     }

//     return scale;
// }

// Create an object called note
// class Note {
//     constructor(x, y, noteName, color) {
//         this.x = x;
//         this.y = y;
//         this.noteName = noteName;
//         this.color = color;
//     }

//     display() {
//         fill(this.color);
//         ellipse(this.x, this.y, 20, 20);
//         fill(0);
//         textSize(8);
//         textAlign(CENTER, CENTER);
//         text(this.noteName, this.x, this.y);
//     }
// }