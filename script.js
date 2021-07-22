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
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function randomBoolean(trueProb) {
    if(!trueProb) trueProb = 50;
    return random(1, 100)<trueProb;
}
Array.prototype.getRandom = function () {
    var array = this;
    return array[random(0, array.length - 1)];
}

const types = [
    { // triads
        name: "Major triad",
        text: {
            short: "|M|Δ",
            long: "maj"
        },
        notes: [0,4,7],
        prob: 50,
    }, {
        name: "Minor triad",
        text: {
            short: "m|-",
            long: "min"
        },
        notes: [0,3,7],
        prob: 50
    }, {
        name: "Augmented triad",
        text: {
            short: "+",
            long: "aug"
        },
        notes: [0,4,8]
    }, {
        name: "Diminished triad",
        text: {
            short: "°",
            long: "dim"
        },
        notes: [0,3,6]
    }, { // seventh chords
        name: "Dominant seventh",
        text: {
            short: "<sup>7</sup>",
            long: "<sup>7</sup>"
        },
        notes: [0,4,7,10]
    }, {
        name: "Major seventh",
        text: {
            short: "M<sup>7</sup>|<sup>maj7</sup>|Δ<sup>7</sup>",
            long: "maj<sup>7</sup>"
        },
        notes: [0,4,7,11]
    }, {
        name: "Minor seventh",
        text: {
            short: "m<sup>7</sup>|-<sup>7</sup>",
            long: "min<sup>7</sup>"
        },
        notes: [0,3,7,10]
    }, { // Ninth chords
        name: "Major ninth",
        text: {
            short: "M<sup>9</sup>|<sup>Δ9</sup>",
            long: "maj<sup>9</sup>"
        },
        notes: [0,4,7,11,2]
    }, {
        name: "Dominant ninth",
        text: {
            short: "<sup>9</sup>",
            long: "<sup>9</sup>"
        },
        notes: [0,4,7,10,2]
    }, {
        name: "Dominant minor ninth",
        text: {
            short: "<sup>7♭9</sup>",
            long: "<sup>7♭9</sup>"
        },
        notes: [0,4,7,10,1]
    }, {
        name: "Minor ninth",
        text: {
            short: "m<sup>9</sup>|-<sup>9</sup>",
            long: "min<sup>9</sup>"
        },
        notes: [0,3,7,10,2]
    }, { // eleventh chords
        name: "Eleventh",
        text: {
            short: "<sup>11</sup>",
            long: "<sup>11</sup>"
        },
        notes: [0,4,7,10,5]
    }, {
        name: "Major eleventh",
        text: {
            short: "M<sup>11</sup>",
            long: "maj<sup>11</sup>"
        },
        notes: [0,4,7,11,2,5]
    }, {
        name: "Minor eleventh",
        text: {
            short: "m<sup>11</sup>|-<sup>11</sup>",
            long: "min<sup>11</sup>"
        },
        notes: [0,3,7,10,2,5]
    }, { // Thirteenth chords
        name: "Major thirteenth",
        text: {
            short: "M<sup>13</sup>|Δ<sup>13</sup>",
            long: "maj<sup>13</sup>"
        },
        notes: [0,4,7,11,2,5,9]
    }, {
        name: "Thirteenth",
        text: {
            short: "<sup>13</sup>",
            long: "<sup>13</sup>"
        },
        notes: [0,4,7,10,2,5,9]
    }, {
        name: "Minor thirteenth",
        text: {
            short: "m<sup>13</sup>|-<sup>13</sup>",
            long: "min<sup>13</sup>"
        },
        notes: [0,3,7,11,2,5,9]
    }, { // added tone chords
        name: "6/9",
        text: {
            short: "<sup>6/9</sup>",
            long: "<sup>6/9</sup>"
        },
        notes: [0,4,7,9,2]
    }
]
const sus = [{
    name: "Suspended fourth",
    text: "<sup>sus4</sup>|<sup>sus</sup>",
    notes: [5]
}, {
    name: "Suspended second",
    text: "<sup>sus2</sup>",
    notes: [2]
}];
const adds = [{
    text: "2|9",
    note: 2
}, {
    text: "6|13",
    note: 9
}, {
    text: "4|11",
    note: 5
}];


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
    chord.type = types[random(0, types.length-1)];
    chord.offset = random(0, 11);
    chord.notes = chord.type.notes;
    chord.add = null;
    chord.sus = null;
    if(randomBoolean(10)) {
        chord.add = adds[random(0, adds.length-1)];
        if(chord.notes.includes(chord.add.note)) {
            console.log(chord.add, chord.notes);
            chord.add = null;
        } else {
            chord.notes.push(chord.add.note);
        }
    } else if(randomBoolean(10)) {
        chord.sus = sus[random(0, sus.length-1)];
        if(chord.sus.notes.every(n => chord.notes.includes(n))) {
            console.log(chord.sus, chord.notes);
            chord.sus = null;
        } else {
            chord.notes.concat(chord.sus.notes);
        }
    }
    var noteText = pickOne(notes[chord.offset]);
    

    console.log($("#notation").value);
    var notation = $("#notation").value==='Short' ? pickOne(chord.type.text.short) : chord.type.text.long;
    if(chord.add) {
        notation += "<sup>add"+pickOne(chord.add.text)+"</sup>";
    }
    if(chord.sus) {
        notation += pickOne(chord.sus.text);
    }
    chord.text = noteText + notation;
    console.error("-----");
    for(var n of chord.notes) {
        console.log(notes[(n+chord.offset)%12]);
    }

    return chord;
}

var chordEl = $("#chord");
chordEl.onclick = () => {
    chord = generateChord();
    chordEl.innerHTML = chord.text;
}
chordEl.click();

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
    var key = event.data[1];
    var down = event.data[0] == 144;
    console.log(event.data);
    if (down) {
        keyboard.push(key);
        var played = true;
        for (var n of chord.notes) {
            var notFound = true;
            for (var k of keyboard) {
                let key = (k) % 12;
                let note = (n + chord.offset) % 12;
                console.log(key, note);
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