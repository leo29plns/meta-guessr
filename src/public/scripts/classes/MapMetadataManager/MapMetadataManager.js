import { DataSlot } from '../DataSlot/DataSlot.js';
import { Module } from '../Module/Module.js';

/**
 * @import { Bus } from '@/scripts/classes/Bus/Bus.js'
 * @import { GeoDataProperties } from 'src/types/data/geodata.js'
 * @import { SlotData } from 'src/types/slot'
 */

export class MapMetadataManager extends Module {
  /** @type {HTMLElement} */
  #container;

  /**
   * @param {Bus} bus
   * @param {string} containerId
   */
  constructor(bus, containerId) {
    super(bus);

    const container = document.getElementById(containerId);

    if (!container) {
      throw new Error(`Metadata container #${containerId} not found`);
    }

    this.#container = container;

    this.setupListeners();
  }

  setupListeners() {
    this.bus.on('round:started', (gameRound) =>
      this.#render(gameRound.poi.properties),
    );
  }

  /**
   * @param {GeoDataProperties} props
   */
  #render(props) {
    const dataSlot = new DataSlot(this.#container);
    dataSlot.update({ ...props });
  }
}
