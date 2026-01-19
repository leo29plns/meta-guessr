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
}
