export class VoiceInitializer {
  constructor(synthesizer, recognizer) {
    this.synthesizer = synthesizer;
    this.recognizer = recognizer;
  }

  async initialize() {
    try {
      await Promise.all([
        this.synthesizer.initialize(),
        this.recognizer.initialize()
      ]);
      return true;
    } catch (error) {
      console.error('Failed to initialize voice services:', error);
      throw error;
    }
  }
}