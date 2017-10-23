class StupidNonsenseSpokenSentences {
    constructor() {

        this.possibleVoices = 'Alex Alice Anna Carmit Daniel Fiona Fred Karen Kyoko Lekha Maged Mei-Jia Melina Moira Samantha Sin-ji Tessa Ting-Ting Veena Victoria Yuna'.split(' ');

        this.rec = this.setUpRecognition();
        this.speech = window.speechSynthesis;
        this.utterance = new SpeechSynthesisUtterance();
        this.voices = null;

        this.partIndex = 0;
        this.parts = ['adjectives', 'singular nouns', 'indicative verbs', 'adverbs'];
        this.adjectives = [];
        this.nouns = [];
        this.verbs = [];
        this.adverbs = [];
        this.words = [this.adjectives, this.nouns, this.verbs, this.adverbs];

        this.nonsenseNumber = 0;

        this.speech.onvoiceschanged = () => {
            this.voices = this.speech.getVoices();
            this.giveIntro();
        };
    }

    setUpRecognition() {
        const self = this;
        const rec = new webkitSpeechRecognition();
        rec.onend = () => self.handleEnd();
        rec.continuous = true;
        rec.interimResults = false;
        rec.onresult = (event) => self.parseResult(event);
        return rec;
    }

    giveIntro() {
        this.utterance.voice = this.voice('Daniel');
        const self = this;
        this.speak('Hi. Please say done after providing words of each type.',
            () => self.promptForWords());
    }

    voice(voiceName) {
        return this.voices.filter(v => v.name === voiceName)[0];
    }

    promptForWords() {
        const partType = this.parts[this.partIndex];
        const self = this;
        this.speak(`Please give me several ${partType}.`,
            () => self.rec.start(true, false));
    }

    speakSentence() {
        const voiceName = this.randChoice(this.possibleVoices);
        let sentence = 'The';
        this.words.forEach(wordType => sentence += ' ' + this.randChoice(wordType));
        this.utterance.voice = this.voice(voiceName);
        this.speak(sentence);
        const p = $('<p>').attr('id', 'nonsense' + this.nonsenseNumber++);
        p.append(`${voiceName}: ${sentence}`);
        p.appendTo('#nonsense');
        this.removeOldNonsense();
    }

    removeOldNonsense() {
        const expiredNum = this.nonsenseNumber - 6;
        if (expiredNum >= 0) {
            const toRemove = $('#nonsense' + expiredNum);
            toRemove.fadeOut(3000, () => toRemove.remove());
        }
    }

    parseResult(e) {
        if (e.returnValue && e.results.length >= 1) {
            const input = e.results[e.results.length - 1][0].transcript.trim();
            const newWords = input.split(' ');
            newWords.forEach(word => {
                if (word.toLowerCase() === 'done') {
                    this.rec.abort();
                    if (++this.partIndex >= this.parts.length) {
                        this.prepareNonsense();
                    }
                } else {
                    this.collectWord(word);
                }
            });
        }
    }

    collectWord(word) {
        const pidx = this.partIndex;
        this.words[pidx].push(word);
        const dt = $('#' + this.parts[pidx].replace(' ', '-'));
        dt.append(word + ' ');
    }

    prepareNonsense() {
        $('#suggestions').remove();
        const nh = $('#nonsense-heading');
        nh.show();
        const self = this;
        this.speak(nh.text(), () => setTimeout(() => self.speakSentence(), 1000));
    }

    handleEnd() {
        if (this.partIndex < this.parts.length) {
            this.promptForWords();
        }
    }

    speak(message, doAfter) {
        if (doAfter) {
            this.utterance.onend = doAfter;
        }
        this.utterance.text = message;
        this.speech.speak(this.utterance);
    }

    randChoice(sequence) {
        return sequence[Math.floor(Math.random() * sequence.length)];
    }
}

new StupidNonsenseSpokenSentences();
