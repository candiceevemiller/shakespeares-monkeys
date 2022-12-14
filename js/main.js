/* TODO change from typewriter effect and one generated text to continually generating text and keeping a 
best match. Current generation is displayed but changes quickly, best match will be mostly static and only
updated when there's a new best match*/

let images = [
    '176.jpg',
    'dilbert.gif',
    'monkeys.jpg',
    'simpsons.gif',
    'sonnets.jpeg',
    'tarantino.jpg',
    'typewriter.jpg',
]

// Target text to match is Hamlet's famous soliloquey.
let target = `To be, or not to be, that is the question:
Whether 'tis nobler in the mind to suffer
The slings and arrows of outrageous fortune,
Or to take arms against a sea of troubles
And by opposing end them. To die—to sleep,
No more; and by a sleep to say we end
The heart-ache and the thousand natural shocks
That flesh is heir to: 'tis a consummation
Devoutly to be wish'd. To die, to sleep;
To sleep, perchance to dream—ay, there's the rub:
For in that sleep of death what dreams may come,
When we have shuffled off this mortal coil,
Must give us pause—there's the respect
That makes calamity of so long life.
For who would bear the whips and scorns of time,
Th'oppressor's wrong, the proud man's contumely,
The pangs of dispriz'd love, the law's delay,
The insolence of office, and the spurns
That patient merit of th'unworthy takes,
When he himself might his quietus make
With a bare bodkin? Who would fardels bear,
To grunt and sweat under a weary life,
But that the dread of something after death,
The undiscovere'd country, from whose bourn
No traveller returns, puzzles the will,
And makes us rather bear those ills we have
Than fly to others that we know not of?
Thus conscience doth make cowards of us all,
And thus the native hue of resolution
Is sicklied o'er with the pale cast of thought,
And enterprises of great pith and moment
With this regard their currents turn awry
And lose the name of action.`;

/* In order to give the "monkeys" a better chance maybe strip punctuation and do all lowercase
It'll still be vanishingly unlikely for a match at approx 1 in 27^1350 odds but that's down
from 94^1405*/ 
const asciiChars = " !\"#$%&'()*+,-./01234556789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";

function generateString(inputLength) {
    let result = '';
    const charsLength = asciiChars.length;
    for (let i=0; i< inputLength; i++) {
        result += asciiChars.charAt(Math.floor(Math.random() * charsLength));
    }

    return result;
}

function scoreStrings(generatedStr, targetStr) {
    let matchCount = 0;
    for (let i=0; i < targetStr.length; i++) {
        if (targetStr.charAt(i) === generatedStr.charAt(i)) {
            matchCount += 1;
        }
    }
    console.log(matchCount);
    console.log(targetStr.length)
    return String(((matchCount / targetStr.length) * 100).toFixed(2)) + '%';
}

let i = 0;
let testString = generateString(target.length); /* The text */
let speed = 1; /* The speed/duration of the effect in milliseconds */

function typeWriter() {
  if (i < testString.length) {
    document.getElementById("demo").innerHTML += testString.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  } else {
    document.getElementById('score').innerHTML += scoreStrings(testString, target);
  }
}

let img = document.getElementById('img')
img.src = 'images/' + images[Math.floor(Math.random() * images.length)]
img.style.width = '500px';
img.style.height = 'auto';
img.style.float = 'left';
img.style.margin = '50px';

let target_element = document.getElementById('target')
target_element.innerHTML += '<h1>Target Text: </h1>';
target_element.innerHTML += target;

document.getElementById('demo').innerHTML += '<h1>Generated Text: </h1>';
document.getElementById('score').innerHTML += '<h1>Score: </h1>';

typeWriter();
