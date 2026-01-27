import { Module } from '../Module/Module.js';

/**
 * @import { Bus } from '@/scripts/classes/Bus/Bus.js'
 * @import { GeoDataFeature, GeoDataProperties } from 'src/types/data/geodata.js'
 */

export class MapMetadataManager extends Module {
  /** @type {HTMLElement} */
  #container;

  /**
   * @param {Bus} bus
   * @param {string} containerId - L'ID de l'élément <aside id="metadata">
   */
  constructor(bus, containerId) {
    super(bus);

    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Metadata container #${containerId} not found`);

    this.#container = el;

    this.setupListeners();
  }

  setupListeners() {
    this.bus.on('round:started', (gameRound) =>
      this.#render(gameRound.poi.properties),
    );
  }

  /**
   * @param {GeoDataProperties} props
   */
  #render(props) {
    // On cible la liste dans ton aside
    const list = this.#container.querySelector('ul');
    if (!list) return;

    // Exemple de rendu dynamique basé sur ton HTML actuel
    list.innerHTML = `
      <li>
        <p>Commune</p>
        <data-group>
          <data>${props['Nom commune']}</data>
        </data-group>
      </li>
      <li>
        <p>Population (2020)</p>
        <data-group>
          <data value="${props['Population 2020']}">${Number(props['Population 2020']).toLocaleString()}</data> hab.
        </data-group>
      </li>
      <li>
        <p>Revenu médian</p>
        <data-group>
          <data>${props['Revenus median 2020']} €</data>
        </data-group>
      </li>
      <li>
        <p>Rue la plus proche</p>
        <data-group>
          <data>${props['Nom rue la plus proche'] || 'Inconnue'}</data>
        </data-group>
      </li>
    `;
  }
}

// TODO : this class is ABSOLUTELY not ready. Needs to use html template for ul list
