// Import core services and utilities
import { CameraManager } from './managers/CameraManager';
import { VoiceAssistant } from './services/voice/VoiceAssistant';
import { setupNavigation } from './utils/navigation';
import { CameraButton } from './components/CameraButton';
import { ModeSelector } from './components/ModeSelector';

// Initialize core services
const initializeServices = async () => {
  try {
    // Setup navigation
    setupNavigation();

    // Initialize camera components
    const cameraManager = new CameraManager();
    const cameraButton = new CameraButton();
    
    // Create mode selector
    const modeSelector = new ModeSelector(cameraManager.navigation);

    // Initialize voice assistant but don't start it yet
    const voiceAssistant = new VoiceAssistant(cameraManager);
    await voiceAssistant.initialize(false); // Pass false to prevent auto-start

    // Add buttons to demo section
    const demoContainer = document.querySelector('.container');
    if (demoContainer) {
      demoContainer.insertBefore(cameraButton.getElement(), demoContainer.firstChild);
      demoContainer.insertBefore(modeSelector.getElement(), demoContainer.firstChild);
    }

    // Setup event listeners
    setupEventListeners(cameraButton, cameraManager, voiceAssistant);

  } catch (error) {
    console.error('Error initializing services:', error);
  }
};

// Setup event listeners
const setupEventListeners = (cameraButton, cameraManager, voiceAssistant) => {
  window.addEventListener('cameraStateChange', async (event) => {
    if (event.detail.isActive) {
      await cameraManager.startCamera();
    } else {
      cameraManager.stopCamera();
    }
  });

  window.addEventListener('activateCamera', () => {
    if (!cameraButton.isActive) {
      cameraButton.toggleCamera();
    }
  });

  window.addEventListener('stopAllActions', () => {
    if (cameraButton.isActive) {
      cameraButton.toggleCamera();
    }
  });

  // Add click handler for "Try Live Demo" button
  const demoButton = document.querySelector('a[href="#demo"].cta-button');
  if (demoButton) {
    demoButton.addEventListener('click', async (e) => {
      e.preventDefault();
      document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
      await voiceAssistant.greet(); // Start voice assistant introduction
      voiceAssistant.start(); // Start listening after greeting
    });
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeServices);