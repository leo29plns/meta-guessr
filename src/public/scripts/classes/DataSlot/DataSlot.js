/**
 * @import { SlotData } from 'src/types/slot'
 */

export class DataSlot {
  #span;
  #formatter;

  /**
   * @param {HTMLElement} span
   */
  constructor(span) {
    this.#span = span;
    this.#formatter = new Intl.NumberFormat('fr-FR');
  }

  /**
   * @param {SlotData} slotData
   */
  update(slotData) {
    /** @type {NodeListOf<HTMLElement>} */
    const slots = this.#span.querySelectorAll('[data-slot]');

    for (const slot of slots) {
      const key = slot.dataset.slot;

      if (key && key in slotData) {
        const value = slotData[key];

        slot.innerText =
          typeof value === 'number'
            ? this.#formatter.format(value)
            : String(value ?? '');
      }
    }
  }
}
