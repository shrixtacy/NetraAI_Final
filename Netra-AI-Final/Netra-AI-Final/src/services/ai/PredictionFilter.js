import { MODEL_SETTINGS } from '../../utils/constants';

export class PredictionFilter {
  static filterPredictions(predictions) {
    return predictions
      .filter(pred => 
        MODEL_SETTINGS.relevantObjects.includes(pred.class) && 
        pred.score >= MODEL_SETTINGS.minConfidence
      )
      .map(pred => ({
        ...pred,
        threatLevel: this.calculateThreatLevel(pred)
      }))
      .sort((a, b) => b.threatLevel - a.threatLevel);
  }
  
  static calculateThreatLevel(prediction) {
    const { score, bbox } = prediction;
    const [, , width, height] = bbox;
    
    // Calculate object size relative to frame
    const area = (width * height) / (640 * 480); // relative to frame size
    
    // Base threat level from confidence score
    let threatLevel = score * 0.4;
    
    // Add size-based threat component
    if (area > MODEL_SETTINGS.sizeThreatThreshold.LARGE) {
      threatLevel += 0.4;
    } else if (area > MODEL_SETTINGS.sizeThreatThreshold.MEDIUM) {
      threatLevel += 0.2;
    }
    
    // Add object type-based threat component
    const objectThreat = this.getObjectTypeThreat(prediction.class);
    threatLevel += objectThreat * 0.2;
    
    return Math.min(1, threatLevel);
  }
  
  static getObjectTypeThreat(objectClass) {
    // High-threat objects (immediate obstacles)
    const highThreatObjects = ['wall', 'stairs', 'column', 'pillar', 'fence'];
    
    // Medium-threat objects (large but usually avoidable)
    const mediumThreatObjects = [
      'car', 'truck', 'bus', 'couch', 'bed', 'dining table',
      'desk', 'cabinet', 'refrigerator'
    ];
    
    if (highThreatObjects.includes(objectClass)) return 1;
    if (mediumThreatObjects.includes(objectClass)) return 0.7;
    return 0.4;
  }
}