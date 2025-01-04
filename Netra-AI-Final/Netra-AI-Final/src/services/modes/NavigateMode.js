import { EnvironmentAnalyzer } from '../environment/EnvironmentAnalyzer';
import { NavigationMessage } from '../navigation/NavigationMessage';

export class NavigateMode {
  constructor(canvasWidth) {
    this.environmentAnalyzer = new EnvironmentAnalyzer();
    this.leftThreshold = canvasWidth / 3;
    this.rightThreshold = (canvasWidth / 3) * 2;
  }

  processFrame(predictions) {
    const zoneAnalysis = this.analyzeZones(predictions);
    const navigationMessage = NavigationMessage.getNavigationMessage(
      zoneAnalysis.leftObstacles,
      zoneAnalysis.centerObstacles,
      zoneAnalysis.rightObstacles
    );

    const environmentDescription = this.environmentAnalyzer.analyzeEnvironment(predictions);
    return `${navigationMessage}. ${environmentDescription}`;
  }

  analyzeZones(predictions) {
    let leftObstacles = 0;
    let centerObstacles = 0;
    let rightObstacles = 0;

    predictions.forEach(prediction => {
      const objectCenterX = prediction.bbox[0] + prediction.bbox[2] / 2;
      
      if (objectCenterX < this.leftThreshold) {
        leftObstacles++;
      } else if (objectCenterX > this.rightThreshold) {
        rightObstacles++;
      } else {
        centerObstacles++;
      }
    });

    return { leftObstacles, centerObstacles, rightObstacles };
  }
}