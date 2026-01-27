/**
 * @import { Event } from './consts'
 */

export class Bus {
  #target = new EventTarget();

  /**
   * @param {Event} event
   * @param {any} data
   */
  emit(event, data) {
    this.#target.dispatchEvent(new CustomEvent(event, { detail: data }));
  }

  /**
   * @param {Event} event
   * @param {Function} callback
   */
  on(event, callback) {
    this.#target.addEventListener(event, (e) => {
      const customEvent = /** @type {CustomEvent} */ (e);
      callback(customEvent.detail);
    });
  }
}
