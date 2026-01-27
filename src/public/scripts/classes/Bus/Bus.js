/**
 * @import { EventRegistry } from 'src/types/events'
 */

export class Bus {
  #target = new EventTarget();

  /**
   * @template {keyof EventRegistry & string} K
   * @param {K} eventName
   * @param {EventRegistry[K]} [data]
   */
  emit(eventName, data) {
    this.#target.dispatchEvent(new CustomEvent(eventName, { detail: data }));
  }

  /**
   * @template {keyof EventRegistry & string} K
   * @param {K} eventName
   * @param {(data: EventRegistry[K]) => void} callback
   */
  on(eventName, callback) {
    this.#target.addEventListener(eventName, (e) => {
      const customEvent = /** @type {CustomEvent} */ (e);
      callback(customEvent.detail);
    });
  }
}
