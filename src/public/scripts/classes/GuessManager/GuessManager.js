import { Module } from '../Module/Module.js';

/**
 * @import { Bus } from '@/scripts/classes/Bus/Bus.js'
 * @import { Coordinates } from 'src/types/coordinates.js'
 */

export class GuessManager extends Module {
  /** @type {HTMLFormElement} */
  #form;

  /**
   * @param {Bus} bus
   * @param {string} formId
   */
  constructor(bus, formId) {
    super(bus);

    const form = document.getElementById(formId);

    if (!form) {
      throw new Error('Form element not found.');
    }

    this.#form = /** @type {HTMLFormElement} */ (form);
    this.#attachForm();
  }

  #attachForm() {
    this.#form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = new FormData(this.#form);

      /** @type {Coordinates} */
      const coords = {
        lat: Number(data.get('lat')),
        lng: Number(data.get('lng')),
      };

      this.bus.emit('guess:submitted', coords);
    });
  }
}
