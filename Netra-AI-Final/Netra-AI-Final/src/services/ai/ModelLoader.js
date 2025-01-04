import * as tf from '@tensorflow/tfjs';

let modelPromise = null;

export class ModelLoader {
  static async loadModel() {
    if (!modelPromise) {
      console.log('Loading COCO-SSD model...');
      modelPromise = import('@tensorflow-models/coco-ssd').then(cocoSsd => 
        cocoSsd.load({
          base: 'mobilenet_v2',
          modelUrl: undefined,
          threshold: 0.6
        })
      );
    }
    
    try {
      const model = await modelPromise;
      console.log('Model loaded successfully');
      return model;
    } catch (error) {
      console.error('Failed to load model:', error);
      modelPromise = null;
      throw error;
    }
  }
}