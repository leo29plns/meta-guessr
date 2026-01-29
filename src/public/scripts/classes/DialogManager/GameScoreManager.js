import { DialogManager } from './DialogManager.js';

/**
 * @import { Bus } from '@/scripts/classes/Bus/Bus.js'
 */

export class GameScoreManager extends DialogManager {
  /**
   * @param {Bus} bus
   * @param {string} dialogId
   */
  constructor(bus, dialogId) {
    super(bus, dialogId);

    this.attachEventListeners();
    this.setupListeners();
  }

  attachEventListeners() {
    this.nextBtn.addEventListener('click', () => {
      this.bus.emit('ui:game-restart');
      this.hide();
    });
  }

  setupListeners() {
    this.bus.on('game:ended', (game) => {
      console.log('Game ended. Total score :', game.totalScore);
      this.show();
    });
  }
}
