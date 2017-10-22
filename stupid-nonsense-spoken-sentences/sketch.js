const possibleVoices = 'Alex Alice Anna Carmit Daniel Fiona Fred Karen Kyoko Lekha Maged Mei-Jia Melina Moira Samantha Sin-ji Tessa Thomas Ting-Ting Veena Victoria Yuna'.split(' ');
const speech = new p5.Speech('', giveIntro);
const rec = new webkitSpeechRecognition();
let partIndex = 0;
const parts = ['adjectives', 'singular nouns', 'indicative verbs', 'adverbs'];
const adjectives = [];
const nouns = [];
const verbs = [];
const adverbs = [];
const words = [adjectives, nouns, verbs, adverbs];
let running = true;

function setup() {
    noCanvas();
}

function giveIntro() {
    speech.onEnd = () => {
        speech.onEnd = () => {};
        rec.onend = () => handleEnd();
        rec.continuous = true;
        rec.interimResults = false;
        rec.onresult = parseResult;
        promptForWords();
    };
    speech.setVoice('Tessa');
    speech.speak('Hi. Please say done after providing words of each type.');
}

function promptForWords() {
    speech.onEnd = () => {
        rec.start(true, false);
    };
    console.log('asking for words');
    speech.speak(`Give me several ${parts[partIndex]}.`);
}

function speakSentence() {
    if (running) {
        const voiceName = random(possibleVoices);
        const sentence =
            `The ${random(adjectives)} ${random(nouns)} ${random(verbs)} ${random(adverbs)}`;
        speech.setVoice(voiceName);
        speech.speak(sentence);
        createP(`${voiceName}: “${sentence}”`);
    }
}

function parseResult(e) {
    console.log(e);
    if (running && e.returnValue && e.results.length >= 1) {
        const input = e.results[e.results.length-1][0].transcript.trim();
        const newWords = input.split(' ');
        newWords.forEach(word => {
            if (word.toLowerCase() === 'done') {
                rec.abort();
                if (++partIndex < parts.length) {
                    createElement('br');
                } else {
                    document.getElementById('suggestions').remove();
                    const message = 'Here comes some nonsense.';
                    createElement('h2', `${message} When you get bored, just go away, or reload the page.`);
                    speech.onEnd = () => setTimeout(speakSentence, 1000);
                    speech.speak(message);
                }
            } else {
                words[partIndex].push(word);
                createSpan(word + ' ');
            }
        });
    }
}

function handleEnd() {
    console.log('end. calling abort.');
    if (partIndex < parts.length) {
        promptForWords();
    }
}
