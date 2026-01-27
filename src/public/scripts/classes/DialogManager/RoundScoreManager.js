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
    this.bus.on('round:ended', (_) => {
      this.#updateUI();
      this.show();
    });

    this.nextBtn.addEventListener('click', () => {
      this.close();
      this.bus.emit('round:started');
    });
  }

  #updateUI() {}
}
