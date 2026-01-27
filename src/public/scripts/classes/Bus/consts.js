/**
 * @import { Coordinates } from 'src/types/coordinates'
 */

export const EVENTS = /** @type {const} */ ({
  GUESS_SUBMITTED: 'guess:submitted',
  SCORE_UPDATED: 'score:updated',
  ROUND_STARTED: 'round:started',
});

/**
 * @typedef {typeof EVENTS[keyof typeof EVENTS]} Event
 */

/**
 * @typedef {Object} EventsType
 * @property {Coordinates} [EVENTS.GUESS_SUBMITTED]
 * @property {{ current: number, total: number }} [EVENTS.SCORE_UPDATED]
 * @property {{ location: Coordinates }} [EVENTS.ROUND_STARTED]
 */
