import { ZONES } from '../../utils/constants';
import { ObjectClassifier } from './ObjectClassifier';
import { DescriptionGenerator } from './DescriptionGenerator';

export class EnvironmentAnalyzer {
  constructor() {
    this.objectClassifier = new ObjectClassifier();
    this.descriptionGenerator = new DescriptionGenerator();
  }

  analyzeEnvironment(predictions) {
    const zoneObjects = this.categorizeByZone(predictions);
    const classifiedObjects = this.objectClassifier.classifyObjects(predictions);
    
    return this.descriptionGenerator.generateDescription(zoneObjects, classifiedObjects);
  }

  categorizeByZone(predictions) {
    const zones = {
      [ZONES.LEFT]: [],
      [ZONES.CENTER]: [],
      [ZONES.RIGHT]: []
    };

    predictions.forEach(prediction => {
      const zone = this.determineZone(prediction.bbox);
      zones[zone].push(prediction);
    });

    return zones;
  }

  determineZone(bbox) {
    const [x] = bbox;
    const objectCenterX = x + bbox[2] / 2;
    const frameWidth = 640; // From CAMERA_SETTINGS

    if (objectCenterX < frameWidth / 3) return ZONES.LEFT;
    if (objectCenterX < (frameWidth * 2) / 3) return ZONES.CENTER;
    return ZONES.RIGHT;
  }
}