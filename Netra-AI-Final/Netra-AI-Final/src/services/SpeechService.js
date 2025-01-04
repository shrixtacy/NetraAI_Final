import { VoiceSelector } from './speech/VoiceSelector';
import { MessageFormatter } from './speech/MessageFormatter';
import { SpeechDebouncer } from './speech/SpeechDebouncer';
import { SpeechQueue } from './speech/SpeechQueue';

export class SpeechService {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.debouncer = new SpeechDebouncer();
    this.queue = new SpeechQueue();
    this.speaking = false;
  }

  speak(text, threatLevel = 0) {
    const message = MessageFormatter.formatNavigationMessage(text, threatLevel);
    const priority = MessageFormatter.getPriority(message);

    // Only queue if we should speak this message
    if (this.debouncer.shouldSpeak(message)) {
      this.queue.add(message, priority);
      this.processQueue();
    }
  }

  async processQueue() {
    if (this.speaking || this.queue.isEmpty()) return;

    while (!this.queue.isEmpty()) {
      const { text } = this.queue.next();
      await this.speakMessage(text);
      
      // Small pause between messages
      await new Promise(resolve => setTimeout(resolve, 250));
    }
  }

  speakMessage(text) {
    return new Promise((resolve) => {
      this.synthesis.cancel(); // Cancel any ongoing speech
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = VoiceSelector.getOptimalVoice();
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        this.speaking = true;
      };

      utterance.onend = () => {
        this.speaking = false;
        resolve();
      };

      utterance.onerror = () => {
        this.speaking = false;
        resolve();
      };

      this.synthesis.speak(utterance);
    });
  }

  stop() {
    this.synthesis.cancel();
    this.queue.clear();
    this.debouncer.reset();
    this.speaking = false;
  }
}