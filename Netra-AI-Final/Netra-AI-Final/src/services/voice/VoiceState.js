export class VoiceState {
  constructor() {
    this.enabled = true;
    this.currentContext = 'home';
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  isEnabled() {
    return this.enabled;
  }

  setContext(context) {
    this.currentContext = context;
  }

  getContext() {
    return this.currentContext;
  }
}