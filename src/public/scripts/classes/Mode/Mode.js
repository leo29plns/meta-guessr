import { MODES, SELECTABLE_MODES } from './types.js';

export class Mode {
  /**
   * @type {MediaQueryList}
   */
  #mediaQuery;

  /**
   * @type {import('./types.js').SelectableMode}
   */
  #storedMode;

  constructor() {
    this.#mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.#storedMode = this.#getStoredMode();

    this.#applyMode();

    this.#mediaQuery.addEventListener('change', () => {
      if (this.#storedMode === SELECTABLE_MODES.SYSTEM) {
        this.#applyMode();
      }
    });
  }

  /**
   * @returns {import('./types.js').SelectableMode}
   */
  #getStoredMode() {
    const mode = localStorage.getItem('mode');

    return mode === SELECTABLE_MODES.LIGHT || mode === SELECTABLE_MODES.DARK
      ? mode
      : SELECTABLE_MODES.SYSTEM;
  }

  /**
   * @returns {import('./types.js').Mode}
   */
  #getSystemMode() {
    return this.#mediaQuery.matches ? MODES.DARK : MODES.LIGHT;
  }

  #applyMode() {
    const mode =
      this.#storedMode === SELECTABLE_MODES.SYSTEM
        ? this.#getSystemMode()
        : this.#storedMode;

    document.body.dataset.mode = mode;

    const event = new CustomEvent('mode', { detail: { mode } });
    document.dispatchEvent(event);
  }

  /**
   * Set a mode and save it as user preference
   * @param {import('./types.js').SelectableMode} mode
   */
  setMode(mode) {
    localStorage.setItem('mode', mode);
    this.#storedMode = mode;

    this.#applyMode();
  }
}
