export const CAMERA_SETTINGS = {
  width: 640,
  height: 480,
  facingMode: 'environment'
};

export const MODEL_SETTINGS = {
  minConfidence: 0.6,
  relevantObjects: [
    // Large obstacles and structures
    'wall', 'door', 'window', 'stairs', 'elevator',
    'fence', 'barrier', 'column', 'pillar',
    
    // Furniture and large objects
    'couch', 'bed', 'dining table', 'desk', 'cabinet',
    'refrigerator', 'oven', 'sink', 'toilet', 'chair', 'bench',
    'bookshelf', 'shelf', 'wardrobe', 'nightstand', 'ottoman',
    
    // Vehicles and large moving objects
    'car', 'truck', 'bus', 'train', 'motorcycle', 'bicycle',
    
    // People and animals
    'person', 'dog', 'cat',
    
    // Personal items
    'backpack', 'handbag', 'suitcase', 'wallet', 'purse',
    'glasses', 'sunglasses', 'watch', 'jewelry', 'umbrella',
    'coffee mug', 'water bottle', 'keys',
    
    // Electronics
    'cell phone', 'laptop', 'computer', 'tablet', 'monitor',
    'keyboard', 'mouse', 'printer', 'headphones', 'speaker',
    'remote', 'camera', 'charger',
    
    // Medical items
    'medicine bottle', 'pill bottle', 'first aid kit', 'bandage',
    'thermometer', 'wheelchair', 'walker', 'cane', 'hearing aid',
    'glasses', 'contact lens case',
    
    // Kitchen items
    'coffee mug', 'cup', 'glass', 'plate', 'bowl', 'utensils',
    'kettle', 'microwave', 'toaster', 'blender', 'coffee maker',
    'water bottle', 'lunch box',
    
    // Office items
    'pen', 'pencil', 'marker', 'notebook', 'paper', 'book',
    'stapler', 'scissors', 'tape dispenser', 'calculator',
    'file folder', 'document', 'calendar', 'sticky notes',
    
    // Common obstacles
    'traffic light', 'fire hydrant', 'stop sign'
  ],
  threatLevels: {
    HIGH: 0.8,    // Immediate danger (walls, large obstacles)
    MEDIUM: 0.6,  // Potential hazard
    LOW: 0.4      // Minor obstacle
  },
  sizeThreatThreshold: {
    LARGE: 0.3,   // Objects taking up >30% of frame
    MEDIUM: 0.15  // Objects taking up >15% of frame
  }
};

export const ZONES = {
  LEFT: 'LEFT',
  CENTER: 'CENTER',
  RIGHT: 'RIGHT'
};

export const COLORS = {
  SAFE: '#22c55e',
  WARNING: '#ef4444',
  DANGER: '#dc2626',
  ZONE: 'rgba(37, 99, 235, 0.3)'
};