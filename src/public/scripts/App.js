import { MGMap } from '@/scripts/classes/MGMap.js';

export class App {
  /**
   * @type {MGMap}
   */
  map;

  constructor() {
    this.map = new MGMap();
  }
}
