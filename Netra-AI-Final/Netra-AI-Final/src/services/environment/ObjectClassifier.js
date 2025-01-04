export class ObjectClassifier {
  classifyObjects(predictions) {
    return {
      structures: this.filterByCategory(predictions, this.isStructure),
      furniture: this.filterByCategory(predictions, this.isFurniture),
      vehicles: this.filterByCategory(predictions, this.isVehicle),
      people: this.filterByCategory(predictions, this.isPerson),
      personalItems: this.filterByCategory(predictions, this.isPersonalItem),
      electronics: this.filterByCategory(predictions, this.isElectronic),
      medical: this.filterByCategory(predictions, this.isMedical),
      kitchenItems: this.filterByCategory(predictions, this.isKitchenItem),
      officeItems: this.filterByCategory(predictions, this.isOfficeItem)
    };
  }

  filterByCategory(predictions, categoryCheck) {
    return predictions.filter(pred => categoryCheck(pred.class));
  }

  isStructure(objectClass) {
    return ['wall', 'door', 'window', 'stairs', 'elevator', 'column', 'pillar'].includes(objectClass);
  }

  isFurniture(objectClass) {
    return [
      'couch', 'bed', 'dining table', 'desk', 'cabinet', 'chair', 'bench',
      'bookshelf', 'shelf', 'wardrobe', 'nightstand', 'ottoman'
    ].includes(objectClass);
  }

  isVehicle(objectClass) {
    return ['car', 'truck', 'bus', 'train', 'motorcycle', 'bicycle'].includes(objectClass);
  }

  isPerson(objectClass) {
    return ['person'].includes(objectClass);
  }

  isPersonalItem(objectClass) {
    return [
      'backpack', 'handbag', 'suitcase', 'wallet', 'purse',
      'glasses', 'sunglasses', 'watch', 'jewelry', 'umbrella',
      'coffee mug', 'water bottle', 'keys'
    ].includes(objectClass);
  }

  isElectronic(objectClass) {
    return [
      'cell phone', 'laptop', 'computer', 'tablet', 'monitor',
      'keyboard', 'mouse', 'printer', 'headphones', 'speaker',
      'remote', 'camera', 'charger'
    ].includes(objectClass);
  }

  isMedical(objectClass) {
    return [
      'medicine bottle', 'pill bottle', 'first aid kit', 'bandage',
      'thermometer', 'wheelchair', 'walker', 'cane', 'hearing aid',
      'glasses', 'contact lens case'
    ].includes(objectClass);
  }

  isKitchenItem(objectClass) {
    return [
      'coffee mug', 'cup', 'glass', 'plate', 'bowl', 'utensils',
      'kettle', 'microwave', 'toaster', 'blender', 'coffee maker',
      'water bottle', 'lunch box'
    ].includes(objectClass);
  }

  isOfficeItem(objectClass) {
    return [
      'pen', 'pencil', 'marker', 'notebook', 'paper', 'book',
      'stapler', 'scissors', 'tape dispenser', 'calculator',
      'file folder', 'document', 'calendar', 'sticky notes'
    ].includes(objectClass);
  }
}