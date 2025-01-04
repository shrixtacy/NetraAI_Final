export class SpeechDebouncer {
  constructor(minInterval = 2000) { // 2 seconds minimum between same messages
    this.lastSpokenTime = {};
    this.minInterval = minInterval;
  }

  shouldSpeak(message) {
    const now = Date.now();
    const lastTime = this.lastSpokenTime[message] || 0;
    
    if (now - lastTime < this.minInterval) {
      return false;
    }

    this.lastSpokenTime[message] = now;
    return true;
  }

  reset() {
    this.lastSpokenTime = {};
  }
}