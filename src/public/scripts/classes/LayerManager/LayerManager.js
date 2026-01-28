import { layerGroup } from 'leaflet';
import { Module } from '../Module/Module.js';

/**
 * @import { Layer } from 'leaflet'
 * @import { Bus } from '@/scripts/classes/Bus/Bus.js'
 */

export class LayerManager extends Module {
  /** @type {Map<string, Layer>} */
  #layers = new Map([['default', layerGroup()]]);

  /** @type {Layer} */
  #activeLayer;

  /**
   * @param {Bus} bus
   */
  constructor(bus) {
    super(bus);
    this.#activeLayer = /** @type {Layer} */ (this.#layers.get('default'));
  }

  /**
   * @param {string} id
   * @param {Layer} layer
   */
  register(id, layer) {
    this.#layers.set(id, layer);
  }

  /**
   * @param {string} id
   */
  select(id) {
    const next = this.#layers.get(id) || this.#layers.get('default');

    if (this.#activeLayer !== next) {
      this.#activeLayer = /** @type {import('leaflet').Layer} */ (next);
      this.bus.emit('layer:update', this);
    }
  }

  /** @returns {import('leaflet').Layer} */
  get activeLayer() {
    return this.#activeLayer;
  }
}
