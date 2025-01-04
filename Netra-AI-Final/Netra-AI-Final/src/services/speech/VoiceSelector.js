export class VoiceSelector {
  static getOptimalVoice() {
    const voices = speechSynthesis.getVoices();
    
    // Prefer these voices in order
    const preferredVoices = [
      'Google UK English Female',
      'Microsoft Libby Online (Natural)',
      'Alex'
    ];
    
    // Try to find a preferred voice
    for (const preferred of preferredVoices) {
      const voice = voices.find(v => v.name === preferred);
      if (voice) return voice;
    }
    
    // Fallback to first English voice
    return voices.find(v => v.lang.startsWith('en')) || voices[0];
  }
}