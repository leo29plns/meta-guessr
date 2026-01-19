import { Map as LeafletMap, TileLayer } from 'leaflet';

export class GeoMap {
  /** @type {LeafletMap} */
  #map;

  /**
   * @param {string} [containerId]
   * @param {[number, number]} [center]
   * @param {number} [zoom]
   */
  constructor(containerId = 'map', center = [48.709167, 2.504722], zoom = 9) {
    this.#map = new LeafletMap(containerId, {
      zoomControl: false,
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
