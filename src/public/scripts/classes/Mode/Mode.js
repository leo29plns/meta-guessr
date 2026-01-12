import { MODES, SELECTABLE_MODES } from './consts.js';

export class Mode {
  /**
   * @type {MediaQueryList}
   */
  #mediaQuery;

  /**
   * @type {import('./consts.js').SelectableMode}
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
   * @returns {import('./consts.js').SelectableMode}
   */
  #getStoredMode() {
    const mode = /** @type {import('./consts.js').SelectableMode | null} */ (
      localStorage.getItem('mode')
    );

    return mode && Object.values(SELECTABLE_MODES).includes(mode)
      ? mode
      : SELECTABLE_MODES.SYSTEM;
  }

  /**
   * @returns {import('./consts.js').Mode}
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
   * Set a mode and save it as user preference
   * @param {import('./consts.js').SelectableMode} mode
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
