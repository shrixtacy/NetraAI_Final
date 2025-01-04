export class SpeechRecognizer {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.restartTimeout = null;
    this.startAttempts = 0;
    this.maxStartAttempts = 3;
    this.noSpeechTimeout = null;
    this.commandGapTimeout = null;
    this.commandGapDuration = 1500; // 1.5 second gap between commands
  }

  async initialize() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      throw new Error('Speech recognition not supported in this browser');
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    this.setupRecognition();
  }

  setupRecognition() {
    this.recognition.continuous = false; // Changed to false to process one command at a time
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.startNoSpeechTimer();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.clearNoSpeechTimer();
      
      // Add gap before restarting recognition
      this.commandGapTimeout = setTimeout(() => {
        if (this.shouldRestart()) {
          this.start();
        }
      }, this.commandGapDuration);
    };

    this.recognition.onerror = (event) => {
      if (event.error === 'no-speech') {
        this.restartWithDelay();
        return;
      }

      if (event.error === 'aborted') {
        this.isListening = false;
        this.startAttempts = 0;
        return;
      }
      
      if (this.shouldRestart()) {
        this.restartWithDelay();
      }
    };

    this.recognition.onnomatch = () => {
      if (this.shouldRestart()) {
        this.restartWithDelay();
      }
    };
  }

  startNoSpeechTimer() {
    this.clearNoSpeechTimer();
    this.noSpeechTimeout = setTimeout(() => {
      if (this.isListening) {
        this.stop();
        this.restartWithDelay();
      }
    }, 10000); // 10 seconds of no speech
  }

  clearNoSpeechTimer() {
    if (this.noSpeechTimeout) {
      clearTimeout(this.noSpeechTimeout);
      this.noSpeechTimeout = null;
    }
  }

  clearCommandGapTimer() {
    if (this.commandGapTimeout) {
      clearTimeout(this.commandGapTimeout);
      this.commandGapTimeout = null;
    }
  }

  shouldRestart() {
    return this.startAttempts < this.maxStartAttempts;
  }

  restartWithDelay() {
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
    }

    this.restartTimeout = setTimeout(() => {
      this.start();
    }, this.commandGapDuration);
  }

  onResult(callback) {
    this.recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const command = event.results[last][0].transcript.trim().toLowerCase();
      
      // Special handling for "stop" command
      if (command.includes('stop')) {
        // Increase recognition confidence for "stop" command
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
      }
      
      this.startAttempts = 0;
      this.startNoSpeechTimer();
      callback(command);
      
      // Stop current recognition to enforce gap
      this.stop();
    };
  }

  onError(callback) {
    const originalOnError = this.recognition.onerror;
    this.recognition.onerror = (event) => {
      originalOnError(event);
      
      if (event.error !== 'aborted' && event.error !== 'no-speech') {
        callback(event.error);
        this.startAttempts++;
      }
    };
  }

  start() {
    if (this.isListening) {
      return;
    }

    this.clearCommandGapTimer();

    try {
      this.recognition.start();
      this.startAttempts++;
    } catch (error) {
      if (error.name === 'InvalidStateError') {
        this.stop();
        setTimeout(() => this.start(), 100);
      } else {
        console.error('Speech recognition error:', error);
      }
    }
  }

  stop() {
    this.clearNoSpeechTimer();
    this.clearCommandGapTimer();
    
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }
    
    if (this.isListening) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
    
    this.isListening = false;
    this.startAttempts = 0;
  }
}