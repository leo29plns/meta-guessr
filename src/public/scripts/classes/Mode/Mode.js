import { MODES } from './types.js';

export class Mode {
  /**
   * @type {MediaQueryList}
   */
  #mediaQuery;

  /**
   * @type {typeof MODES[keyof typeof MODES]}
   */
  #storedMode;

  constructor() {
    this.#mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.#storedMode = this.#getStoredMode();

    this.#applyMode();

    this.#mediaQuery.addEventListener('change', () => {
      if (this.#storedMode === MODES.SYSTEM) {
        this.#applyMode();
      }
    });
  }

  /**
   * @returns {typeof MODES[keyof typeof MODES]}
   */
  #getStoredMode() {
    const mode = localStorage.getItem('mode');

    return mode === MODES.LIGHT || mode === MODES.DARK ? mode : MODES.SYSTEM;
  }

  /**
   * @returns {typeof MODES.LIGHT | typeof MODES.DARK}
   */
  #getSystemMode() {
    return this.#mediaQuery.matches ? MODES.DARK : MODES.LIGHT;
  }

  #applyMode() {
    const mode =
      this.#storedMode === MODES.SYSTEM
        ? this.#getSystemMode()
        : this.#storedMode;

    document.body.dataset.mode = mode;
  }

  /**
   * Set a mode and save it as user preference
   * @param {typeof MODES[keyof typeof MODES]} mode
   */
  setMode(mode) {
    localStorage.setItem('mode', mode);
    this.#storedMode = mode;

    this.#applyMode();
  }
}
