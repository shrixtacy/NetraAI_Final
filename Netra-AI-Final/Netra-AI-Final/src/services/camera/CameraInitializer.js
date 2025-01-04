import { CAMERA_SETTINGS } from '../../utils/constants';

export class CameraInitializer {
  static async requestPermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: CAMERA_SETTINGS.facingMode },
        audio: false
      });
      
      // Immediately stop the test stream
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  }

  static async initialize(video, width, height) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: CAMERA_SETTINGS.facingMode,
          width: { ideal: width },
          height: { ideal: height }
        },
        audio: false
      });

      video.srcObject = stream;
      
      return new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve(stream);
        };
      });
    } catch (error) {
      console.error('Camera initialization error:', error);
      throw error;
    }
  }
}