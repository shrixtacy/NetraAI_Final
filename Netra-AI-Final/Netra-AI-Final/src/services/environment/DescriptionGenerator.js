export class DescriptionGenerator {
  generateDescription(zoneObjects, classifiedObjects) {
    const descriptions = [];

    // Add overall environment summary
    descriptions.push(this.generateOverallSummary(classifiedObjects));

    // Add zone-specific descriptions
    Object.entries(zoneObjects).forEach(([zone, objects]) => {
      if (objects.length > 0) {
        descriptions.push(this.generateZoneDescription(zone, objects));
      }
    });

    // Add safety recommendations
    descriptions.push(this.generateSafetyRecommendations(classifiedObjects));

    return descriptions.join(' ');
  }

  generateOverallSummary(classified) {
    const elements = [];

    if (classified.structures.length > 0) {
      elements.push(`structural elements like ${this.listObjects(classified.structures)}`);
    }
    if (classified.people.length > 0) {
      elements.push(`${classified.people.length} people nearby`);
    }
    if (classified.furniture.length > 0) {
      elements.push(`furniture including ${this.listObjects(classified.furniture)}`);
    }

    return elements.length > 0 
      ? `Environment contains ${elements.join(', ')}. `
      : 'No major objects detected in the environment. ';
  }

  generateZoneDescription(zone, objects) {
    if (objects.length === 0) return '';

    const objectDescriptions = this.listObjects(objects);
    return `${zone.toLowerCase()} zone contains ${objectDescriptions}. `;
  }

  generateSafetyRecommendations(classified) {
    const recommendations = [];

    if (classified.structures.length > 0) {
      recommendations.push('watch for structural obstacles');
    }
    if (classified.people.length > 0) {
      recommendations.push('maintain safe distance from people');
    }
    if (classified.vehicles.length > 0) {
      recommendations.push('be cautious of moving vehicles');
    }

    return recommendations.length > 0
      ? `Safety recommendations: ${recommendations.join(', ')}.`
      : '';
  }

  listObjects(objects) {
    const uniqueObjects = [...new Set(objects.map(obj => obj.class))];
    return uniqueObjects.join(', ');
  }
}