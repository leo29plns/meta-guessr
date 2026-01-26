import { Map as LeafletMap, latLngBounds, TileLayer } from 'leaflet';

/**
 * @import { Bounds, Coordinates } from 'src/types/coordinates'
 */

export class GeoMap {
  /** @type {LeafletMap} */
  #map;

  /**
   * @param {string} [containerId]
   * @param {Coordinates} [center]
   * @param {number} [zoom]
   * @param {Bounds} [maxBounds]
   */
  constructor(
    containerId = 'map',
    center = { lat: 48.709167, lng: 2.504722 },
    zoom = 9,
    maxBounds,
  ) {
    this.#map = new LeafletMap(containerId, {
      zoomControl: false,
      maxBounds:
        maxBounds && latLngBounds(maxBounds.southWest, maxBounds.northEast),
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
