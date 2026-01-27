import { GeoMap } from '@/scripts/classes/GeoMap/GeoMap.js';
import { ModeManager } from '@/scripts/classes/ModeManager/ModeManager.js';
import { Game } from './classes/Game/Game.js';

export class App {
  /** @type {ModeManager} */
  #mode;

  /** @type {GeoMap} */
  #geoMap;

  /** @type {Game} */
  #game;

  constructor() {
    this.#mode = new ModeManager();
    this.#geoMap = new GeoMap();
    this.#game = new Game();

    this.#setupZoomControls();
    this.#setupModeControls();
    this.#setupLayerControls();

    console.log(this.#mode, this.#geoMap, this.#game);
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
        this.#mode.setMode(
          /** @type {import('./classes/ModeManager/consts.js').SelectableMode} */ (
            input.value
          ),
        );
      });
    });
  }

  #setupLayerControls() {
    /** @type {HTMLSelectElement | null} */
    const layerSelect = document.querySelector('#layer-select');
    if (!layerSelect) return;

    /** @type {Record<string, { show: () => void; hide: () => void }>} */
    const layerActions = {
      towns: {
        show: () => this.#geoMap.showTowns(),
        hide: () => this.#geoMap.hideTowns(),
      },
      roads: {
        show: () => this.#geoMap.showRoads(),
        hide: () => this.#geoMap.hideRoads(),
      },
      monuments: {
        show: () => this.#geoMap.showMonuments(),
        hide: () => this.#geoMap.hideMonuments(),
      },
      noise: {
        show: () => this.#geoMap.showNoise(),
        hide: () => this.#geoMap.hideNoise(),
      },
      pollution: {
        show: () => this.#geoMap.showPollution(),
        hide: () => this.#geoMap.hidePollution(),
      },
      busStops: {
        show: () => this.#geoMap.showBusStops(),
        hide: () => this.#geoMap.hideBusStops(),
      },
      housing: {
        show: () => this.#geoMap.showHousing(),
        hide: () => this.#geoMap.hideHousing(),
      },
    };

    /** @type {string} */
    let _currentLayer = '';

    /**
     * Hides all layers.
     */
    const hideAllLayers = () => {
      Object.values(layerActions).forEach((actions) => {
        actions.hide();
      });
    };

    /**
     * Shows the selected layer.
     * @param {string} layerValue
     */
    const showLayer = (layerValue) => {
      hideAllLayers();
      _currentLayer = layerValue;
      const actions = layerActions[layerValue];
      if (actions) {
        actions.show();
      }
    };

    // Apply initial state
    showLayer(layerSelect.value);

    // Listen for changes
    layerSelect.addEventListener('change', () => {
      showLayer(layerSelect.value);
    });
  }
}
