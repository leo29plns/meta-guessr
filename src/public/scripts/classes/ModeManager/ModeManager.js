import { MODES, SELECTABLE_MODES } from './consts.js';

/**
 * @import { SelectableMode, Mode } from './consts.js'
 */

export class ModeManager {
  /** @type {MediaQueryList} */
  #mediaQuery;

  /** @type {SelectableMode} */
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
   * @returns {SelectableMode}
   */
  #getStoredMode() {
    const mode = /** @type {SelectableMode | null} */ (
      localStorage.getItem('mode')
    );

    return mode && Object.values(SELECTABLE_MODES).includes(mode)
      ? mode
      : SELECTABLE_MODES.SYSTEM;
  }

  /**
   * @returns {Mode}
   */
  #getSystemMode() {
    return this.#mediaQuery.matches ? MODES.DARK : MODES.LIGHT;
  }

  #applyMode() {
    const mode =
      this.#storedMode === SELECTABLE_MODES.SYSTEM
        ? this.#getSystemMode()
        : this.#storedMode;

    document.documentElement.dataset.mode = mode;

    const event = new CustomEvent('mode', { detail: { mode } });
    document.dispatchEvent(event);
  }

  /**
   * Set a mode and save it as user preference.
   *
   * @param {SelectableMode} mode
   */
  setMode(mode) {
    localStorage.setItem('mode', mode);
    this.#storedMode = mode;

    this.#applyMode();
  }

  /**
   * Returns the currently stored user mode.
   */
  get storedMode() {
    return this.#storedMode;
  }
}
