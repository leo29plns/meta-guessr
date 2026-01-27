import { EVENTS } from '../Bus/consts.js';
import { DialogManager } from './DialogManager.js';

/**
 * @import { Bus } from '@/scripts/classes/Bus/Bus.js'
 */

export class RoundScoreManager extends DialogManager {
  /** @type {HTMLButtonElement} */
  #nextBtn;

  /**
   * @param {Bus} bus
   * @param {string} dialogId
   * @param {string} nextBtnId
   */
  constructor(bus, dialogId, nextBtnId) {
    super(bus, dialogId);

    const nextBtn = document.getElementById(nextBtnId);

    this.#nextBtn = /** @type {HTMLButtonElement} */ (nextBtn);

    this.#setupListeners();
  }

  #setupListeners() {
    this.bus.on(EVENTS.ROUND_ENDED, (/** @type {any} */ _) => {
      this.#updateUI();
      this.show();
    });

    this.#nextBtn.addEventListener('click', () => {
      this.close();
      this.bus.emit(EVENTS.ROUND_STARTED, {});
    });
  }

  #updateUI() {}
}
