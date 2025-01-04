export class StopCommandHandler {
  constructor(cameraManager, voiceAssistant) {
    this.cameraManager = cameraManager;
    this.voiceAssistant = voiceAssistant;
    this.reactivationTimeout = null;
  }

  async handle() {
    try {
      // Stop camera feed
      await this.cameraManager.stopCamera();
      
      // Reset camera button state
      const cameraButton = document.querySelector('.camera-toggle-btn');
      if (cameraButton) {
        const buttonInstance = cameraButton.__proto__.constructor;
        if (buttonInstance && buttonInstance.reset) {
          buttonInstance.reset();
        } else {
          // Fallback to click if reset not available
          if (cameraButton.classList.contains('active')) {
            cameraButton.click();
          }
        }
      }
      
      // Stop voice recognition
      this.voiceAssistant.pause();

      // Wait 5 seconds before asking to reactivate
      this.reactivationTimeout = setTimeout(() => {
        this.askToReactivate();
      }, 5000);
      
      return true;
    } catch (error) {
      console.error('Error handling stop command:', error);
      return false;
    }
  }

  async askToReactivate() {
    const message = "Would you like to enable voice recognition again? Say 'yes' to enable.";
    await this.voiceAssistant.speak(message);
    this.voiceAssistant.setTemporaryHandler(this.handleReactivationResponse.bind(this));
    this.voiceAssistant.resumeTemporarily();
  }

  async handleReactivationResponse(command) {
    if (command.includes('yes')) {
      this.voiceAssistant.resume();
      await this.voiceAssistant.speak('Voice recognition enabled');
    } else {
      this.voiceAssistant.stop();
      await this.voiceAssistant.speak('Voice recognition will remain disabled');
    }
  }

  cleanup() {
    if (this.reactivationTimeout) {
      clearTimeout(this.reactivationTimeout);
      this.reactivationTimeout = null;
    }
  }
}