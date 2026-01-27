import { GeoMap } from '@/scripts/classes/GeoMap/GeoMap.js';
import { ModeManager } from '@/scripts/classes/ModeManager/ModeManager.js';
import { Bus } from './classes/Bus/Bus.js';
import { RoundScoreManager } from './classes/DialogManager/RoundScoreManager.js';
import { Game } from './classes/Game/Game.js';
import { GuessManager } from './classes/GuessManager/GuessManager.js';

export class App {
  /** @type {Bus} */
  #bus;

  /** @type {ModeManager} */
  #mode;

  /** @type {GeoMap} */
  #geoMap;

  /** @type {Game} */
  #game;

  /** @type {GuessManager} */
  #guessManager;

  /** @type {RoundScoreManager} */
  #roundScoreManager;

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
    this.#game = new Game(this.#bus);
    this.#geoMap = new GeoMap(this.#bus, 'map', idfCenter, 10, 9, idfBoundings);
    this.#guessManager = new GuessManager(this.#bus, 'guess');
    this.#roundScoreManager = new RoundScoreManager(
      this.#bus,
      'round-score',
      'next-round',
    );

    this.#setupZoomControls();
    this.#setupModeControls();

    console.log(this.#mode, this.#geoMap, this.#game, this.#guessManager);
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
