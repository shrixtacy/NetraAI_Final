import { ObjectClassifier } from '../environment/ObjectClassifier';

export class GuideMode {
  constructor() {
    this.objectClassifier = new ObjectClassifier();
  }

  processFrame(predictions) {
    if (predictions.length === 0) {
      return 'No objects detected in view';
    }

    const classified = this.objectClassifier.classifyObjects(predictions);
    return this.generateDescription(classified);
  }

  generateDescription(classified) {
    const descriptions = [];

    // Add detected objects by category
    Object.entries(classified).forEach(([category, objects]) => {
      if (objects.length > 0) {
        const uniqueObjects = [...new Set(objects.map(obj => obj.class))];
        const categoryName = this.formatCategoryName(category);
        descriptions.push(`${categoryName}: ${uniqueObjects.join(', ')}`);
      }
    });

    return descriptions.join('. ');
  }

  formatCategoryName(category) {
    return category
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }
}