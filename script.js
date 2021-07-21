var midi = null;
onMIDISuccess = (access) => {
    console.log("MIDI Ready!");
    midi = access;
    console.log(listInputsAndOutputs(midi));
}
onMIDIFailure = (msg) => {
    console.error("Failed to get MIDI Access - " + msg);
}
navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

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

var keyboard = [];

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
        prob: 45,
        value: [0, 4, 7]
    }, {
        type: "minor",
        name: "m",
        prob: 45,
        value: [0, 3, 7]
    }, {
        type: "diminished",
        name: "dim",
        prob: 7,
        value: [0, 3, 6]
    }, {
        type: "augmented",
        name: "aug",
        prob: 3,
        value: [0, 4, 8]
    },
];
function getType() {
    let result = null;
    let type = random(1, 100);
    let total = 0;
    for (var t of types) {
        total += t.prob;
        if (total >= type) {
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
        value: []
    }, {
        name: "7",
        prob: 25,
        value: [10]
    }, {
        name: "9",
        prob: 15,
        value: [10, 2]
    }, {
        name: "11",
        prob: 5,
        value: [10, 2, 5]
    }, {
        name: "13",
        prob: 5,
        value: [10, 2, 5, 9]
    }
];
function getExtension() {
    let result = null;
    let ext = random(1, 100);
    let total = 0;
    for (var e of extensions) {
        total += e.prob;
        if (total >= ext) {
            result = e;
            break;
        }
    }
    return result;
}




function pickOne(s) {
    return s.split("|").getRandom();
}
var chord = {};
function generateChord() {

    var chord = {};
    chord.type = getType();
    chord.offset = random(0, 11);
    chord.ext = [getExtension()];
    chord.notes = chord.type.value.concat(chord.ext[0].value);
    console.log(chord.notes);

    var root = chord.offset;

    var noteText = notes[root];
    noteText = pickOne(noteText);

    chord.text = noteText + new String(chord.type.name) + new String(chord.ext[0].name).sup();

    return chord;
}

var chordEl = $("#chord");
chordEl.onclick = () => {
    chord = generateChord();
    chordEl.innerHTML = chord.text;
}

function listInputsAndOutputs(midiAccess) {
    for (var entry of midiAccess.inputs) {
        var input = entry[1];
        console.log("Input port [type:'" + input.type + "'] id:'" + input.id +
            "' manufacturer:'" + input.manufacturer + "' name:'" + input.name +
            "' version:'" + input.version + "'");
    }

    startLoggingMIDIInput(midiAccess);
}

var waitForKeysUp = false;
var notCorrect = false;
function onMIDIMessage(event) {
    var str = "MIDI message received at timestamp " + event.timestamp + "[" + event.data.length + " bytes]: ";
    //var key = notes[Math.floor((event.data[1]-53)%12)];
    /*
    if(key===chordEl.innerHTML[0]) {
        chordEl.click();
    }*/
    //var key = Math.floor((event.data[1]+7)%12);
    var key = event.data[1];
    var down = event.data[0] == 144;
    if (down) {
        keyboard.push(key);
        var played = true;
        for (var n of chord.notes) {
            var notFound = true;
            for (var k of keyboard) {
                let key = (k - 5) % 12;
                let note = (n + chord.offset) % 12;
                if (key == note) {
                    notFound = false;
                    break;
                }
            }
            if (notFound) played = false;
        }
        if (played) {
            waitForKeysUp = true;
            chordEl.style.color = '#32a852';
        } else {
            notCorrect = true;
            chordEl.style.color = '#a31808';
        }

    } else {
        keyboard = keyboard.filter(x => x != key);
        if(!keyboard.length) {
            chordEl.style.color = '#696969';
            notCorrect = false;
            if(waitForKeysUp) {
                waitForKeysUp = false;
                chordEl.click();
            } 
        }
    }





    //console.log("State:"+event.data[0]+" Key:"+key+" Velocity:"+event.data[2]);
}

function startLoggingMIDIInput(midiAccess, indexOfPort) {
    midiAccess.inputs.forEach(function (entry) { entry.onmidimessage = onMIDIMessage; });
}