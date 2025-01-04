import { SpeechRecognizer } from './SpeechRecognizer';
import { SpeechSynthesizer } from './SpeechSynthesizer';
import { CommandProcessor } from './CommandProcessor';
import { VoiceState } from './VoiceState';
import { VoiceInitializer } from './VoiceInitializer';
import { formatGreeting } from './greetings';

export class VoiceAssistant {
  constructor(cameraManager) {
    this.recognizer = new SpeechRecognizer();
    this.synthesizer = new SpeechSynthesizer();
    this.state = new VoiceState();
    this.commandProcessor = new CommandProcessor(cameraManager, this);
    this.initializer = new VoiceInitializer(this.synthesizer, this.recognizer);
    this.temporaryHandler = null;
  }

  async initialize(autoStart = false) {
    try {
      await this.initializer.initialize();
      this.setupEventListeners();
      if (autoStart) {
        await this.greet();
        this.start();
      }
    } catch (error) {
      console.error('Failed to initialize voice assistant:', error);
    }
  }

  setupEventListeners() {
    this.recognizer.onResult(async (command) => {
      if (this.state.isEnabled()) {
        const response = await this.commandProcessor.process(command);
        await this.speak(response);
      }
    });

    this.recognizer.onError((error) => {
      console.error('Speech recognition error:', error);
    });
  }

  async greet() {
    await this.speak(formatGreeting());
  }

  async speak(message) {
    await this.synthesizer.speak(message);
  }

  start() {
    this.state.enable();
    this.recognizer.start();
  }

  stop() {
    this.state.disable();
    this.recognizer.stop();
  }

  pause() {
    this.recognizer.stop();
  }

  resume() {
    if (this.state.isEnabled()) {
      this.recognizer.start();
    }
  }

  resumeTemporarily() {
    this.recognizer.start();
  }

  setTemporaryHandler(handler) {
    this.temporaryHandler = handler;
  }
}