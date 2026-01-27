import { DialogManager } from './DialogManager.js';

export class GameScoreManager extends DialogManager {
  setupListeners() {
    this.bus.on('game:ended', (_) => {
      this.show();
    });

    this.nextBtn.addEventListener('click', () => {
      this.close();
    });
  }
}
