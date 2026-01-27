import { EVENTS } from '../Bus/consts.js';
import { STATUSES } from '../GameRound/consts.js';
import { GameRound } from '../GameRound/GameRound.js';
import { GeoData } from '../GeoData/GeoData.js';
import { Module } from '../Module/Module.js';

/**
 * @import { Coordinates } from 'src/types/coordinates.js'
 * @import { Bus } from '@/scripts/classes/Bus/Bus.js'
 */

export class Game extends Module {
  /** @type {GeoData} */
  #geoData;

  /** @type {GameRound[]} */
  #rounds = [];

  /** @param {Bus} bus */
  constructor(bus) {
    super(bus);

    this.#geoData = new GeoData();

    this.createRounds(6);
    this.startNextRound();

    this.bus.on(EVENTS.GUESS_SUBMITTED, (/** @type {Coordinates} */ data) =>
      this.handleGuess(data),
    );

    this.bus.on(EVENTS.ROUND_STARTED, (/** @type {Coordinates} */ data) =>
      this.startNextRound(),
    );
  }

  startNextRound() {
    const nextRound = this.#nextRound;

    if (!nextRound) {
      console.log('Game Over! Total Score:', this.totalScore);
      return;
    }

    nextRound.start();
  }

  /** @param {number} count */
  createRounds(count) {
    const locations = this.#geoData.getRandomLocations(count);

    this.#rounds = locations.map(
      (location) => new GameRound(this.bus, location),
    );
  }

  /**
   * @param {Coordinates} formData
   */
  handleGuess(formData) {
    this.currentRound?.submitGuess(formData);
  }

  get currentRound() {
    return this.#rounds.find((round) => round.status === STATUSES.IN_PROGRESS);
  }

  get #nextRound() {
    return this.#rounds.find((round) => round.status === STATUSES.PENDING);
  }

  get totalScore() {
    return this.#rounds.reduce((total, round) => total + (round.score ?? 0), 0);
  }
}
