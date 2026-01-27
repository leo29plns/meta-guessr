import { Map as LeafletMap, latLngBounds, TileLayer } from 'leaflet';
import { Module } from '../Module/Module.js';

/**
 * @import { Bounds, Coordinates } from 'src/types/coordinates'
 * @import { Bus } from '@/scripts/classes/Bus/Bus.js'
 */

export class GeoMap extends Module {
  /** @type {LeafletMap} */
  #map;

  /**
   * @param {Bus} bus
   * @param {string} containerId
   * @param {Coordinates} center
   * @param {number} zoom
   * @param {number} minZoom
   * @param {Bounds} maxBounds
   */
  constructor(bus, containerId, center, zoom, minZoom, maxBounds) {
    super(bus);

    this.#map = new LeafletMap(containerId, {
      zoomControl: false,
      minZoom,
      maxBounds: latLngBounds(maxBounds.southWest, maxBounds.northEast),
    }).setView(center, zoom);

    new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
  }

  zoomIn() {
    this.#map.setZoom(this.#map.getZoom() + 1);
  }

  zoomOut() {
    this.#map.setZoom(this.#map.getZoom() - 1);
  }
}
