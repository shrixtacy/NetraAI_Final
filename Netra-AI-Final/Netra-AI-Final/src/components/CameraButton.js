import { toggleDisplay, toggleFlexDisplay } from '../utils/domUtils';

export class CameraButton {
  constructor() {
    this.isActive = false;
    this.button = this.createButton();
    this.setupElements();
  }

  setupElements() {
    this.container = document.querySelector('.video-container');
    this.instructions = document.getElementById('navigation-instructions');
    this.stats = document.querySelector('.stats');
  }

  createButton() {
    const button = document.createElement('button');
    button.className = 'camera-toggle-btn';
    button.textContent = 'Start Camera';
    button.addEventListener('click', () => this.toggleCamera());
    return button;
  }

  toggleCamera() {
    this.isActive = !this.isActive;
    this.updateButtonState();
    this.updateDisplayElements();
    this.emitStateChange();
  }

  updateButtonState() {
    this.button.textContent = this.isActive ? 'Stop Camera' : 'Start Camera';
    this.button.classList.toggle('active', this.isActive);
  }

  updateDisplayElements() {
    toggleDisplay(this.container, this.isActive);
    toggleDisplay(this.instructions, this.isActive);
    toggleFlexDisplay(this.stats, this.isActive);
  }

  emitStateChange() {
    window.dispatchEvent(new CustomEvent('cameraStateChange', { 
      detail: { isActive: this.isActive } 
    }));
  }

  // Add method to force camera state
  setActive(active) {
    if (this.isActive !== active) {
      this.isActive = active;
      this.updateButtonState();
      this.updateDisplayElements();
    }
  }

  getElement() {
    return this.button;
  }

  // Add method to reset button state
  reset() {
    this.isActive = false;
    this.updateButtonState();
    this.updateDisplayElements();
  }
}