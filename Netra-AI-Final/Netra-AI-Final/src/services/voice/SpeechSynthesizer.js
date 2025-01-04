export class SpeechSynthesizer {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.voice = null;
  }

  async initialize() {
    if (!('speechSynthesis' in window)) {
      throw new Error('Speech synthesis not supported in this browser');
    }

    // Wait for voices to load
    await new Promise(resolve => {
      if (this.synthesis.getVoices().length) {
        resolve();
      } else {
        this.synthesis.onvoiceschanged = resolve;
      }
    });

    this.voice = this.selectVoice();
  }

  selectVoice() {
    const voices = this.synthesis.getVoices();
    return voices.find(voice => 
      voice.lang.startsWith('en') && voice.name.includes('Female')
    ) || voices[0];
  }

  async speak(text) {
    return new Promise((resolve) => {
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = this.voice;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = resolve;
      utterance.onerror = resolve;

      this.synthesis.speak(utterance);
    });
  }

  stop() {
    this.synthesis.cancel();
  }
}