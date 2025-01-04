export class CameraCleanup {
  static cleanup(stream, video, animationFrame) {
    if (stream) {
      stream.getTracks().forEach(track => {
        if (track.readyState === 'live') {
          track.stop();
        }
      });
    }

    if (video) {
      video.srcObject = null;
      video.load(); // Reset video element
    }

    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  }

  static async verifyCleanup(stream) {
    if (stream) {
      const tracks = stream.getTracks();
      return tracks.every(track => track.readyState === 'ended');
    }
    return true;
  }
}