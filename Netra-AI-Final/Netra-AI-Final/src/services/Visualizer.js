import { COLORS } from '../utils/constants';

export class Visualizer {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.colors = COLORS;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawVideo(video) {
    this.ctx.drawImage(video, 0, 0, this.canvas.width, this.canvas.height);
  }

  drawDetections(predictions) {
    predictions.forEach(prediction => {
      const [x, y, width, height] = prediction.bbox;
      const threatLevel = prediction.threatLevel || prediction.score;
      
      // Color based on threat level
      const color = this.getColorForThreat(threatLevel);
      const alpha = Math.max(0.4, threatLevel);
      
      // Enhanced glow effect for walls and large obstacles
      this.ctx.shadowColor = color;
      this.ctx.shadowBlur = this.isLargeObstacle(prediction) ? 25 : 15;
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = this.isLargeObstacle(prediction) ? 4 : 3;
      this.ctx.strokeRect(x, y, width, height);
      
      // Reset shadow for text
      this.ctx.shadowBlur = 0;
      
      // Draw background for text
      this.ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
      const text = `${prediction.class} (${Math.round(threatLevel * 100)}%)`;
      const textWidth = this.ctx.measureText(text).width;
      this.ctx.fillRect(x, y > 10 ? y - 25 : y + height, textWidth + 10, 25);
      
      // Draw text
      this.ctx.fillStyle = color;
      this.ctx.font = 'bold 16px Inter';
      this.ctx.fillText(
        text,
        x + 5,
        y > 10 ? y - 8 : y + height + 17
      );
    });

    this.drawNavigationZones();
  }

  getColorForThreat(threatLevel) {
    if (threatLevel > 0.8) return this.colors.DANGER;
    if (threatLevel > 0.6) return this.colors.WARNING;
    return this.colors.SAFE;
  }

  isLargeObstacle(prediction) {
    const largeObjects = ['wall', 'stairs', 'column', 'pillar', 'fence'];
    return largeObjects.includes(prediction.class);
  }

  drawNavigationZones() {
    const zoneWidth = this.canvas.width / 3;
    
    this.ctx.strokeStyle = this.colors.ZONE;
    this.ctx.lineWidth = 2;
    
    // Draw zones with gradient
    for (let i = 0; i < 3; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(zoneWidth * i, 0);
      this.ctx.lineTo(zoneWidth * i, this.canvas.height);
      this.ctx.stroke();
      
      // Add zone labels
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      this.ctx.font = '14px Inter';
      this.ctx.fillText(
        ['LEFT', 'CENTER', 'RIGHT'][i],
        (zoneWidth * i) + (zoneWidth / 2) - 20,
        30
      );
    }
  }
}