import { haversineDistance } from '@/scripts/utils/haversineDistance';
import { MAX_SCORE, MAX_SCORE_RADIUS, SCORE_SCALE } from './consts.js';

/**
 * @import { GeoDataFeature } from 'src/types/data/geodata.js'
 * @import { Coordinates } from 'src/types/coordinates.js'
 */

export class GameRound {
  /** @type {GeoDataFeature} */
  #poi;

  /** @type {number | undefined} */
  #score;

  /** @type {number | undefined} */
  #distance;

  /** @type {Coordinates | undefined} */
  #guess;

  /** @type {[number, number] | undefined} */
  #target;

  /** @param {GeoDataFeature} poi */
  constructor(poi) {
    this.#poi = poi;
  }

  /** @returns {number | undefined} */
  get score() {
    return this.#score;
  }

  /** @returns {number | undefined} */
  get distance() {
    return this.#distance;
  }

  /** @returns {Coordinates | undefined} */
  get guess() {
    return this.#guess;
  }

  /** @returns {[number, number] | undefined} */
  get target() {
    return this.#target;
  }

  /**
   * Processes user guess and calculates results.
   * Updates internal state solely.
   *
   * @param {number} lat
   * @param {number} lng
   * @returns {void}
   */
  submitGuess(lat, lng) {
    const [targetLng, targetLat] = this.#poi.geometry.coordinates;
    const distance = haversineDistance(lat, lng, targetLat, targetLng);

    this.#target = [targetLng, targetLat];

    this.#guess = { lat, lng };

    this.#distance = distance;
    this.#score = this.#calculateScore(distance);
  }

  /**
   * Computes score using exponential decay.
   * @param {number} distance - Meters
   * @returns {number} 0-5000
   */
  #calculateScore(distance) {
    if (distance < MAX_SCORE_RADIUS) return MAX_SCORE;

    return Math.round(
      Math.max(0, MAX_SCORE * Math.exp(-distance / SCORE_SCALE)),
    );
  }
}
