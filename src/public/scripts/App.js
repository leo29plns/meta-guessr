import { GeoMap } from '@/scripts/classes/GeoMap/GeoMap.js';
import { Mode } from '@/scripts/classes/Mode/Mode.js';

export class App {
  /**
   * @type {Mode}
   */
  #mode;
  /**
   * @type {GeoMap}
   */
  #geoMap;

  constructor() {
    this.#mode = new Mode();
    this.#geoMap = new GeoMap();

    this.#setupZoomControls();
    this.#setupModeControls();
  }

  #setupZoomControls() {
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');

    if (!zoomInBtn || !zoomOutBtn) throw new Error('No zoom button.');

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
          /** @type {import('./classes/Mode/types').SelectableMode} */ (
            input.value
          ),
        );
      });
    });
  }
}
