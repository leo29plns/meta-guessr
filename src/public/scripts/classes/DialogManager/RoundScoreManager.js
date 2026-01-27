import { DialogManager } from './DialogManager.js';

/**
 * @import { Bus } from '@/scripts/classes/Bus/Bus.js'
 */

export class RoundScoreManager extends DialogManager {
  /**
   * @param {Bus} bus
   * @param {string} dialogId
   */
  constructor(bus, dialogId) {
    super(bus, dialogId);

    this.setupListeners();
  }

  setupListeners() {
    this.bus.on('round:ended', (gameRound) => {
      console.log('Round ended. Score :', gameRound.score);
      this.show();
    });

    this.nextBtn.addEventListener('click', () => {
      this.close();
      this.bus.emit('dialog:next-round');
    });
  }
}
