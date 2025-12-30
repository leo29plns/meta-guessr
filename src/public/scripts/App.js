import { MgMap } from '@/scripts/classes/MgMap/MgMap.js';
import { Mode } from '@/scripts/classes/Mode/Mode.js';

export class App {
  /**
   * @type {Mode}
   */
  #mode;
  /**
   * @type {MgMap}
   */
  #mgMap;

  constructor() {
    this.#mode = new Mode();
    this.#mgMap = new MgMap();

    this.#setupZoomControls();
    this.#setupModeControls();
  }

  #setupZoomControls() {
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');

    if (!zoomInBtn || !zoomOutBtn) throw new Error('No zoom button.');

    zoomInBtn.addEventListener('click', () => this.#mgMap.zoomIn());
    zoomOutBtn.addEventListener('click', () => this.#mgMap.zoomOut());
  }

  #setupModeControls() {
    /** @type {NodeListOf<HTMLInputElement>} */
    const radioInputs = document.querySelectorAll('input[name="mode"]');

    radioInputs.forEach((input) => {
      input.addEventListener('change', (_) => {
        this.#mode.setMode(input.value);
      });
    });
  }
}
