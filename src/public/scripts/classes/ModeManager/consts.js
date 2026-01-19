export const MODES = /** @type {const} */ ({
  LIGHT: 'light',
  DARK: 'dark',
});

/**
 * @typedef {typeof MODES[keyof typeof MODES]} Mode
 */

export const SELECTABLE_MODES = /** @type {const} */ ({
  ...MODES,
  SYSTEM: 'system',
});

/**
 * @typedef {typeof SELECTABLE_MODES[keyof typeof SELECTABLE_MODES]} SelectableMode
 */
