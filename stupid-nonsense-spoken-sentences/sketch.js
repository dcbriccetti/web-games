const possibleVoices = 'Alex Alice Anna Carmit Daniel Fiona Fred Karen Kyoko Lekha Maged Mei-Jia Melina Moira Samantha Sin-ji Tessa Ting-Ting Veena Victoria Yuna'.split(' ');

const rec = setUpRecognition();
const speech = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance();
let voices;

let partIndex = 0;
const parts = ['adjectives', 'singular nouns', 'indicative verbs', 'adverbs'];
const adjectives = [];
const nouns = [];
const verbs = [];
const adverbs = [];
const words = [adjectives, nouns, verbs, adverbs];

let nonsenseNumber = 0;

speech.onvoiceschanged = () => {
    voices = speech.getVoices();
    giveIntro();
};

function setUpRecognition() {
    const rec = new webkitSpeechRecognition();
    rec.onend = () => handleEnd();
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = parseResult;
    return rec;
}

function giveIntro() {
    utterance.voice = voice('Daniel');
    speak('Hi. Please say done after providing words of each type.',
        promptForWords);
}

function voice(voiceName) {
    return voices.filter(v => v.name === voiceName)[0];
}

function promptForWords() {
    speak(`Please give me several ${parts[partIndex]}.`,
        () => rec.start(true, false));
}

function speakSentence() {
    const voiceName = randChoice(possibleVoices);
    let sentence = 'The';
    words.forEach(wordType => sentence += ' ' + randChoice(wordType));
    utterance.voice = voice(voiceName);
    speak(sentence);
    const p = $('<p>').attr('id', 'nonsense' + nonsenseNumber++);
    p.append(`${voiceName}: ${sentence}`);
    p.appendTo('#nonsense');
    removeOldNonsense();
}

function removeOldNonsense() {
    const expiredNum = nonsenseNumber - 6;
    if (expiredNum >= 0) {
        const toRemove = $('#nonsense' + expiredNum);
        toRemove.fadeOut(3000, () => toRemove.remove());
    }
}

function parseResult(e) {
    if (e.returnValue && e.results.length >= 1) {
        const input = e.results[e.results.length - 1][0].transcript.trim();
        const newWords = input.split(' ');
        newWords.forEach(word => {
            if (word.toLowerCase() === 'done') {
                rec.abort();
                if (++partIndex >= parts.length) {
                    prepareNonsense();
                }
            } else {
                collectWord(word);
            }
        });
    }
}

function collectWord(word) {
    words[partIndex].push(word);
    const dt = $('#' + parts[partIndex].replace(' ', '-'));
    dt.append(word + ' ');
}

function prepareNonsense() {
    $('#suggestions').remove();
    const nh = $('#nonsense-heading');
    nh.show();
    speak(nh.text(), () => setTimeout(speakSentence, 1000));
}

function handleEnd() {
    if (partIndex < parts.length) {
        promptForWords();
    }
}

function speak(message, doAfter) {
    if (doAfter) {
        utterance.onend = doAfter;
    }
    utterance.text = message;
    speech.speak(utterance);
}

function randChoice(sequence) {
    return sequence[Math.floor(Math.random() * sequence.length)];
}
