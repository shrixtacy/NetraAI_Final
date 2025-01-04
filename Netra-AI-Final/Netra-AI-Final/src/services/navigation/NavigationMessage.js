export class NavigationMessage {
  static MESSAGES = {
    CLEAR: 'Path is clear',
    MOVE_LEFT: 'Move to the left',
    MOVE_RIGHT: 'Move to the right',
    CAUTION: 'Proceed with caution',
    STOP: 'Stop! Obstacle ahead'
  };

  static getNavigationMessage(left, center, right) {
    if (left === 0 && center === 0 && right === 0) {
      return this.MESSAGES.CLEAR;
    }
    
    if (center > 0) {
      return left <= right ? this.MESSAGES.MOVE_LEFT : this.MESSAGES.MOVE_RIGHT;
    }
    
    if (left > right) {
      return this.MESSAGES.MOVE_RIGHT;
    }
    
    if (right > left) {
      return this.MESSAGES.MOVE_LEFT;
    }

    return this.MESSAGES.CAUTION;
  }
}