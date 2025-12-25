import { Map as LeafletMap, TileLayer } from 'leaflet';

export class MGMap {
  /**
   * @type {LeafletMap}
   */
  #map;

  /**
   * @param {string} [containerId]
   * @param {[number, number]} [center]
   * @param {number} [zoom]
   */
  constructor(containerId = 'map', center = [46.493889, 2.602778], zoom = 6) {
    this.#map = new LeafletMap(containerId).setView(center, zoom);

    new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
  }
}
