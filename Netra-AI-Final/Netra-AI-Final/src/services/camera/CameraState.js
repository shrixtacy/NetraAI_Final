export class CameraState {
  constructor() {
    this.isInitialized = false;
    this.isActive = false;
    this.hasPermission = false;
    this.lastError = null;
  }

  setInitialized(value) {
    this.isInitialized = value;
  }

  setActive(value) {
    this.isActive = value;
  }

  setPermission(value) {
    this.hasPermission = value;
  }

  setError(error) {
    this.lastError = error;
  }

  reset() {
    this.isInitialized = false;
    this.isActive = false;
    this.lastError = null;
  }
}