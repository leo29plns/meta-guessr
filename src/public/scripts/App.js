import { MGMap } from '@/scripts/classes/MGMap/MGMap.js';
import { Mode } from '@/scripts/classes/Mode/Mode.js';

export class App {
  /**
   * @type {Mode}
   */
  mode;
  /**
   * @type {MGMap}
   */
  map;

  constructor() {
    this.mode = new Mode();
    this.map = new MGMap();
  }
}
