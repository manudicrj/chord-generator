
// fake jquery
function $(id) {
    if (id.includes("#")) {
        id = id.replace("#", '');
        return document.getElementById(id);
    } else if (id.includes(".")) {
        return document.getElementsByClassName(id);
    }
}

function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max) + 1;
    return Math.floor(Math.random() * (max - min) + min);
}
Array.prototype.getRandom = function () {
    var array = this;
    return array[random(0, array.length - 1)];
}

const notes = [
    "C",
    "C♯|D♭",
    "D",
    "D♯|E♭",
    "E",
    "F",
    "F♯|G♭",
    "G",
    "G♯|A♭",
    "A",
    "A♯|B♭",
    "B"
];
const types = [
    {
        type: "major",
        name: "",
        prob: 45
    }, {
        type: "minor",
        name: "m",
        prob: 45
    }, {
        type: "diminished",
        name: "dim",
        prob: 7
    }, {
        type: "augmented",
        name: "aug",
        prob: 3
    },
];
function getType() {
    let result = null;
    let type = random(1, 100);
    let total = 0;
    for (var t of types) {
        total += t.prob;
        if (total > type) {
            result = t;
            break;
        }
    }
    return result;
}
const extensions = [
    {
        name: "",
        prob: 50,
    }, {
        name: "7",
        prob: 25
    }, {
        name: "9",
        prob: 15
    }, {
        name: "11",
        prob: 5
    }, {
        name: "13",
        prob: 5
    }
];
function getExtension() {
    let result = null;
    let ext = random(1, 100);
    let total = 0;
    for(var e of extensions) {
        total += e.prob;
        console.log(total);
        if(total > ext) {
            result = e;
            break;
        }
    }
    return result;
}




function pickOne(s) {
    return s.split("|").getRandom();
}
function generateChord() {
    var result = "";

    var chord = {};
    chord.type = getType();
    chord.offset = random(0, 11);
    chord.ext = [getExtension()];
    console.log(chord);

    var root = chord.offset;

    var noteText = notes[root];
    noteText = pickOne(noteText);

    result += noteText + new String(chord.type.name) + new String(chord.ext[0].name).sup();

    return result;
}

var chordEl = $("#chord");
chordEl.onclick = () => {
    chordEl.innerHTML = generateChord();
}
