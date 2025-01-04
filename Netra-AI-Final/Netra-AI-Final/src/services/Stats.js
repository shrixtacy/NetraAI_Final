export class Stats {
  constructor() {
    this.objectsCount = document.getElementById('objects-count');
    this.avgConfidence = document.getElementById('avg-confidence');
    this.fps = document.getElementById('fps');
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.lastFpsUpdate = performance.now();
  }

  update(predictions) {
    // Update objects count
    this.objectsCount.textContent = predictions.length;

    // Update average confidence
    if (predictions.length > 0) {
      const avgConf = predictions.reduce((acc, pred) => acc + pred.score, 0) / predictions.length;
      this.avgConfidence.textContent = `${Math.round(avgConf * 100)}%`;
    } else {
      this.avgConfidence.textContent = '0%';
    }

    // Update FPS
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastFpsUpdate > 1000) {
      const fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
      this.fps.textContent = `${fps} FPS`;
      this.frameCount = 0;
      this.lastFpsUpdate = now;
    }
  }
}