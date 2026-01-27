import { Module } from '../Module/Module.js';

/**
 * @import { Bus } from '@/scripts/classes/Bus/Bus.js'
 * @import { Coordinates } from 'src/types/coordinates.js'
 */

export class GuessManager extends Module {
  /** @type {HTMLFormElement} */
  #form;

  /** @type {HTMLInputElement} */
  #latInput;

  /** @type {HTMLInputElement} */
  #lngInput;

  /**
   * @param {Bus} bus
   * @param {string} formId
   */
  constructor(bus, formId) {
    super(bus);

    this.setupListeners();

    const form = document.getElementById(formId);
    const latInput = document.getElementById('lat');
    const lngInput = document.getElementById('lng');

    if (!form || !latInput || !lngInput) {
      throw new Error('Form element not found.');
    }

    this.#form = /** @type {HTMLFormElement} */ (form);
    this.#latInput = /** @type {HTMLInputElement} */ (latInput);
    this.#lngInput = /** @type {HTMLInputElement} */ (lngInput);

    this.#attachForm();
  }

  setupListeners() {
    this.bus.on('round:ended', () => this.#form.reset());
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
