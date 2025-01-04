import { NavigateMode } from './modes/NavigateMode';
import { GuideMode } from './modes/GuideMode';
import { OPERATION_MODES } from './modes/OperationMode';

export class NavigationSystem {
  constructor(canvasWidth) {
    this.navigateMode = new NavigateMode(canvasWidth);
    this.guideMode = new GuideMode();
    this.currentMode = OPERATION_MODES.NAVIGATE;
  }

  setMode(mode) {
    if (Object.values(OPERATION_MODES).includes(mode)) {
      this.currentMode = mode;
    }
  }

  getMode() {
    return this.currentMode;
  }

  analyzeObstacles(predictions) {
    return this.currentMode === OPERATION_MODES.NAVIGATE
      ? this.navigateMode.processFrame(predictions)
      : this.guideMode.processFrame(predictions);
  }
}