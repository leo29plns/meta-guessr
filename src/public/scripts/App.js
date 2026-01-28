import { circleMarker, geoJSON } from 'leaflet';
import monumentsData from '@/data/monuments.geojson' with { type: 'json' };
import roadsData from '@/data/roads.geojson' with { type: 'json' };
import sonAir3Data from '@/data/son_air3.geojson' with { type: 'json' };
import townsData from '@/data/towns.geojson' with { type: 'json' };
import { GeoMap } from '@/scripts/classes/GeoMap/GeoMap.js';
import { ModeManager } from '@/scripts/classes/ModeManager/ModeManager.js';
import { Bus } from './classes/Bus/Bus.js';
import { GameScoreManager } from './classes/DialogManager/GameScoreManager.js';
import { RoundScoreManager } from './classes/DialogManager/RoundScoreManager.js';
import { Game } from './classes/Game/Game.js';
import { GuessManager } from './classes/GuessManager/GuessManager.js';
import { LayerManager } from './classes/LayerManager/LayerManager.js';
import { MapMetadataManager } from './classes/MapMetadataManager/MapMetadataManager.js';

/**
 * @import { SelectableMode } from '@/scripts/classes/ModeManager/consts.js'
 */

export class App {
  /** @type {Bus} */
  #bus;

  /** @type {ModeManager} */
  #mode;

  /** @type {GeoMap} */
  #geoMap;

  /** @type {Game} */
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: private instance
  #game;

  /** @type {GuessManager} */
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: private instance
  #guessManager;

  /** @type {RoundScoreManager} */
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: private instance
  #roundScoreManager;

  /** @type {GameScoreManager} */
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: private instance
  #gameScoreManager;

  /** @type {MapMetadataManager} */
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: private instance
  #mapMetadataManager;

  /** @type {LayerManager} */
  #layerManager;

  constructor() {
    const idfCenter = { lat: 48.709167, lng: 2.504722 };
    const idfBoundings = {
      southWest: {
        lat: idfCenter.lat - 0.7,
        lng: idfCenter.lng - 1.3,
      },
      northEast: {
        lat: idfCenter.lat + 0.7,
        lng: idfCenter.lng + 1.3,
      },
    };

    this.#bus = new Bus();
    this.#mode = new ModeManager();
    this.#mapMetadataManager = new MapMetadataManager(this.#bus, 'metadata');
    this.#geoMap = new GeoMap(this.#bus, 'map', idfCenter, 10, 9, idfBoundings);
    this.#layerManager = new LayerManager(this.#bus);
    this.#guessManager = new GuessManager(this.#bus, 'guess');
    this.#roundScoreManager = new RoundScoreManager(this.#bus, 'round-score');
    this.#gameScoreManager = new GameScoreManager(this.#bus, 'game-score');
    this.#game = new Game(this.#bus);

    this.#setupZoomControls();
    this.#setupModeControls();
    this.#setupLayers();
  }

  #setupZoomControls() {
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');

    if (!zoomInBtn || !zoomOutBtn) return;

    zoomInBtn.addEventListener('click', () => this.#geoMap.zoomIn());
    zoomOutBtn.addEventListener('click', () => this.#geoMap.zoomOut());
  }

  #setupModeControls() {
    /** @type {NodeListOf<HTMLInputElement>} */
    const radioInputs = document.querySelectorAll('input[name="mode"]');

    radioInputs.forEach((input) => {
      if (input.value === this.#mode.storedMode) input.checked = true;

      input.addEventListener('change', (_) => {
        this.#mode.setMode(/** @type {SelectableMode} */ (input.value));
      });
    });
  }

  #setupLayers() {
    const monumentsLayer = geoJSON(monumentsData, {
      onEachFeature: (feature, layer) => {
        layer.bindPopup(`<b>${feature.properties.nom_du_site}</b>`);
      },
    });
    this.#layerManager.register('monuments', monumentsLayer);

    const townsLayer = geoJSON(townsData, {
      style: {
        color: '#4a90e2',
        weight: 2,
        fillOpacity: 0.2,
      },
    });
    this.#layerManager.register('towns', townsLayer);

    const roadsLayer = geoJSON(roadsData, {
      style: {
        color: '#666',
        weight: 1.5,
      },
    });
    this.#layerManager.register('roads', roadsLayer);

    const sonAirLayer = geoJSON(sonAir3Data, {
      pointToLayer: (_, latlng) => {
        return circleMarker(latlng, {
          radius: 6,
          fillColor: '#2ecc71',
          color: '#27ae60',
          weight: 1,
          fillOpacity: 0.8,
        });
      },
    });
    this.#layerManager.register('son_air3', sonAirLayer);

    this.#layerManager.select('son_air3');
  }
}
