const possibleVoices = 'Alex Alice Alva Amelie Anna Carmit Damayanti Daniel Diego Ellen Fiona Fred Ioana Joana Jorge Juan Kanya Karen Kyoko Laura Lekha Luca Luciana Maged Mariska Mei-Jia Melina Milena Moira Monica Nora Paulina Samantha Sara Satu Sin-ji Tessa Thomas Ting-Ting Veena Victoria Xander Yelda Yuna Yuri Zosia Zuzana'.split(' ');
const speech = new p5.Speech('', giveIntro);
const speechRec = new p5.SpeechRec('en-US', parseResult);
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
        speechRec.start(true, false);
        promptForWords();
    };
    speech.speak('I\'d like to collect some words from you. Please say done after providing words of each type.');
}

function promptForWords() {
    speech.speak(`Please give me several ${parts[partIndex]}.`);
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

function parseResult() {
    if (speechRec.resultValue && running) {
        const input = speechRec.resultString;
        const newWords = input.split(' ');
        newWords.forEach(word => {
            if (word === 'stop') {
                running = false;
            } else if (word.toLowerCase() === 'done') {
                if (++partIndex < parts.length) {
                    createElement('br');
                    promptForWords();
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

