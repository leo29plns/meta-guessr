import geodata from '@/data/geodata.geojson' with { type: 'json' };

/**
 * @import { GeoDataCollection, GeoDataFeature } from 'src/types/data/geodata'
 */

export class GeoData {
  /** @type {GeoDataCollection} */
  #geodata;

  constructor() {
    this.#geodata = /** @type {GeoDataCollection} */ (geodata);
  }

  /**
   * Retrieves N random locations.
   * Optimized to avoid copying the entire array.
   *
   * @param {number} count - The number of locations to select.
   * @returns {GeoDataFeature[]} An array of randomly selected locations.
   */
  getRandomLocations(count) {
    const total = this.#geodata.features.length;

    if (count > total) {
      throw new Error(
        `Cannot retrieve ${count} locations: only ${total} available.`,
      );
    }

    const selection = [];
    const usedIndices = new Set();

    while (selection.length < count) {
      const randomIndex = Math.floor(Math.random() * total);

      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        selection.push(this.#geodata.features[randomIndex]);
      }
    }

    return selection;
  }
}
