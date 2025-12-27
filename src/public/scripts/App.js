import { MGMap } from '@/scripts/classes/MGMap/MGMap.js';
import { Mode } from '@/scripts/classes/Mode/Mode.js';

export class App {
  /**
   * @type {Mode}
   */
  #mode;
  /**
   * @type {MGMap}
   */
  #mgMap;

  constructor() {
    this.#mode = new Mode();
    this.#mgMap = new MGMap();

    this.#setupZoomControls();
  }

  #setupZoomControls() {
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');

    if (!zoomInBtn || !zoomOutBtn) throw new Error('No zoom button.');

    zoomInBtn.addEventListener('click', () => this.#mgMap.zoomIn());
    zoomOutBtn.addEventListener('click', () => this.#mgMap.zoomOut());
  }
}
