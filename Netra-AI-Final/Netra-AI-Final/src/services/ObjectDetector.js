import { ModelLoader } from './ai/ModelLoader';
import { PredictionFilter } from './ai/PredictionFilter';

export class ObjectDetector {
  constructor() {
    this.model = null;
  }

  async initialize() {
    try {
      this.model = await ModelLoader.loadModel();
      return true;
    } catch (error) {
      console.error('Failed to load model:', error);
      return false;
    }
  }

  async detect(video) {
    if (!this.model) return [];
    
    try {
      const rawPredictions = await this.model.detect(video);
      const filteredPredictions = PredictionFilter.filterPredictions(rawPredictions);
      
      // Sort predictions by threat level
      return filteredPredictions.sort((a, b) => 
        PredictionFilter.calculateThreatLevel(b) - PredictionFilter.calculateThreatLevel(a)
      );
    } catch (error) {
      console.error('Detection error:', error);
      return [];
    }
  }
}