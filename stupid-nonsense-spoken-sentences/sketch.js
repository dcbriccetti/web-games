const possibleVoices = 'Alex Alice Anna Carmit Daniel Fiona Fred Karen Kyoko Lekha Maged Mei-Jia Melina Moira Samantha Sin-ji Tessa Ting-Ting Veena Victoria Yuna'.split(' ');
const rec = new webkitSpeechRecognition();
const speech = window.speechSynthesis;
let voices;
const utterance = new SpeechSynthesisUtterance();
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
    speech.onvoiceschanged = () => {
        voices = speech.getVoices();
        giveIntro();
    }
}

function giveIntro() {
    utterance.onend = () => {
        utterance.onend = () => {};
        rec.onend = () => handleEnd();
        rec.continuous = true;
        rec.interimResults = false;
        rec.onresult = parseResult;
        promptForWords();
    };
    utterance.voice = voice('Tessa');
    speak('Hi. Please say done after providing words of each type.');
}

function speak(message) {
    utterance.text = message;
    speech.speak(utterance);
}

function voice(voiceName) {
    return voices.filter(v => v.name === voiceName )[0];
}

function promptForWords() {
    utterance.onend = () => {
        rec.start(true, false);
    };
    speak(`Give me several ${parts[partIndex]}.`);
}

function speakSentence() {
    if (running) {
        const voiceName = random(possibleVoices);
        const sentence =
            `The ${random(adjectives)} ${random(nouns)} ${random(verbs)} ${random(adverbs)}`;
        utterance.voice = voice(voiceName);
        speak(sentence);
        createP(`${voiceName}: “${sentence}”`);
    }
}

function parseResult(e) {
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
                    const message = 'Here comes some stupid nonsense.';
                    createElement('h2', message);
                    utterance.onend = () => setTimeout(speakSentence, 1000);
                    speak(message);
                }
            } else {
                words[partIndex].push(word);
                createSpan(word + ' ');
            }
        });
    }
}

function handleEnd() {
    if (partIndex < parts.length) {
        promptForWords();
    }
}
