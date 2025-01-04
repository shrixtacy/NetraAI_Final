export class ModeSelector {
  constructor(navigationSystem) {
    this.navigationSystem = navigationSystem;
    this.button = this.createButton();
  }

  createButton() {
    const button = document.createElement('button');
    button.className = 'mode-toggle-btn';
    button.textContent = 'Switch to Guide Mode';
    button.addEventListener('click', () => this.toggleMode());
    return button;
  }

  toggleMode() {
    const currentMode = this.navigationSystem.getMode();
    const newMode = currentMode === 'navigate' ? 'guide' : 'navigate';
    this.navigationSystem.setMode(newMode);
    this.updateButtonText(newMode);
  }

  updateButtonText(mode) {
    this.button.textContent = `Switch to ${mode === 'navigate' ? 'Guide' : 'Navigate'} Mode`;
  }

  getElement() {
    return this.button;
  }
}