import { Module } from '../Module/Module.js';

/**
 * @import { Bus } from '@/scripts/classes/Bus/Bus.js'
 */

export class DialogManager extends Module {
  /** @type {HTMLDialogElement} */
  #dialog;

  /**
   * @param {Bus} bus
   * @param {string} dialogId
   */
  constructor(bus, dialogId) {
    super(bus);

    const dialog = document.getElementById(dialogId);

    if (!dialog) {
      throw new Error(`Unable to find dialog.`);
    }

    this.#dialog = /** @type {HTMLDialogElement} */ (dialog);
  }

  show() {
    this.#dialog.showModal();
  }

  close() {
    this.#dialog.close();
  }
}
