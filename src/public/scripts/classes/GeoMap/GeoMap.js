import { Map as LeafletMap, latLngBounds, marker, TileLayer } from 'leaflet';
import { Module } from '../Module/Module.js';

/**
 * @import { Marker } from 'leaflet'
 * @import { Bounds, Coordinates } from 'src/types/coordinates'
 * @import { Bus } from '@/scripts/classes/Bus/Bus.js'
 */

export class GeoMap extends Module {
  /** @type {LeafletMap} */
  #map;

  /** @type {Marker | null} */
  #pointer = null;

  /** @type {Coordinates | null} */
  #pointerCoordinates = null;

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

    this.#setupClickEvent();
    this.setupListeners();
  }

  setupListeners() {
    this.bus.on('round:started', () => this.removePointer());
  }

  zoomIn() {
    this.#map.setZoom(this.#map.getZoom() + 1);
  }

  zoomOut() {
    this.#map.setZoom(this.#map.getZoom() - 1);
  }

  #setupClickEvent() {
    this.#map.on('click', (e) => {
      this.#pointerCoordinates = e.latlng;
      this.movePointer(e.latlng);

      this.bus.emit('map:moved-pointer', this);
    });
  }

  /**
   * @param {Coordinates} coords
   */
  movePointer(coords) {
    if (!this.#pointer) {
      this.#pointer = marker([coords.lat, coords.lng]).addTo(this.#map);
    } else {
      this.#pointer.setLatLng(coords);
    }
  }

  removePointer() {
    if (!this.#pointer) return;

    this.#pointer.remove();
    this.#pointer = null;
    this.#pointerCoordinates = null;
  }

  get pointerCoordinates() {
    if (!this.#pointerCoordinates) {
      throw new Error('No pointer coordinates');
    }

    return this.#pointerCoordinates;
  }
}
