import { ObjectDetector } from '../services/ObjectDetector';
import { NavigationSystem } from '../services/NavigationSystem';
import { Visualizer } from '../services/Visualizer';
import { SpeechService } from '../services/SpeechService';
import { Stats } from '../services/Stats';
import { CAMERA_SETTINGS } from '../utils/constants';
import { getElement, updateElement } from '../utils/domUtils';
import { CameraState } from '../services/camera/CameraState';
import { CameraInitializer } from '../services/camera/CameraInitializer';
import { CameraCleanup } from '../services/camera/CameraCleanup';

export class CameraManager {
  constructor() {
    this.initializeElements();
    this.initializeServices();
    this.state = new CameraState();
  }

  initializeElements() {
    this.video = getElement('video');
    this.canvas = getElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.stream = null;
    this.animationFrame = null;

    this.canvas.width = CAMERA_SETTINGS.width;
    this.canvas.height = CAMERA_SETTINGS.height;
  }

  initializeServices() {
    this.detector = new ObjectDetector();
    this.navigation = new NavigationSystem(this.canvas.width);
    this.visualizer = new Visualizer(this.canvas, this.ctx);
    this.speechService = new SpeechService();
    this.stats = new Stats();
  }

  async startCamera() {
    try {
      // Check if camera is already active
      if (this.state.isActive) {
        console.warn('Camera is already active');
        return;
      }

      // Ensure clean state
      await this.ensureCleanState();

      // Request camera permission
      const hasPermission = await CameraInitializer.requestPermission();
      this.state.setPermission(hasPermission);

      if (!hasPermission) {
        throw new Error('Camera permission denied');
      }

      // Initialize detector and camera
      await this.detector.initialize();
      this.stream = await CameraInitializer.initialize(
        this.video,
        CAMERA_SETTINGS.width,
        CAMERA_SETTINGS.height
      );

      // Update state and start detection
      this.state.setInitialized(true);
      this.state.setActive(true);
      this.startDetection();

    } catch (error) {
      this.state.setError(error);
      this.handleCameraError(error);
      throw error;
    }
  }

  async ensureCleanState() {
    // Stop existing stream and verify cleanup
    await this.stopCamera();
    const isClean = await CameraCleanup.verifyCleanup(this.stream);
    
    if (!isClean) {
      throw new Error('Failed to clean up previous camera session');
    }
  }

  handleCameraError(error) {
    let errorMessage = 'Error: Could not access camera. Please ensure camera permissions are granted.';
    
    if (error.name === 'NotAllowedError') {
      errorMessage = 'Camera access denied. Please grant camera permissions to use this feature.';
    } else if (error.name === 'NotFoundError') {
      errorMessage = 'No camera found. Please ensure your device has a camera.';
    } else if (error.name === 'NotReadableError') {
      errorMessage = 'Camera is in use by another application. Please close other applications using the camera.';
    }
    
    updateElement('navigation-instructions', errorMessage);
  }

  async stopCamera() {
    try {
      CameraCleanup.cleanup(this.stream, this.video, this.animationFrame);
      this.stream = null;
      this.animationFrame = null;
      
      this.clearCanvas();
      this.resetUI();
      this.speechService.stop();
      
      this.state.reset();
      
      return true;
    } catch (error) {
      console.error('Error stopping camera:', error);
      return false;
    }
  }

  clearCanvas() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  resetUI() {
    updateElement('navigation-instructions', '');
    this.stats.update([]);
  }

  async detectFrame() {
    if (!this.state.isActive) return;

    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      const predictions = await this.detector.detect(this.video);
      this.updateFrame(predictions);
    }
    
    this.animationFrame = requestAnimationFrame(() => this.detectFrame());
  }

  updateFrame(predictions) {
    this.visualizer.clear();
    this.visualizer.drawVideo(this.video);
    this.visualizer.drawDetections(predictions);
    
    const instruction = this.navigation.analyzeObstacles(predictions);
    updateElement('navigation-instructions', instruction);
    
    const threatLevel = predictions.length > 0 ? 
      Math.max(...predictions.map(p => p.score)) : 0;
    
    this.speechService.speak(instruction, threatLevel);
    this.stats.update(predictions);
  }

  startDetection() {
    if (this.state.isActive) {
      this.detectFrame();
    }
  }
}