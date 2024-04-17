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

let notes = ['C1', 'Db1', 'D1', 'Eb1'];

console.log(generateCycles(notes));

console.log(getTotalNotes(generateCycles(notes)));