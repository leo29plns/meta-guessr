import { ICONS_PATH } from './consts.js';

/** @type {Map<string, string>} */
const iconCache = new Map();

export class TablerIcon extends HTMLElement {
  static observedAttributes = ['name'];

  /** @type {AbortController} */
  #abortController;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.#abortController = new AbortController();
  }

  attributeChangedCallback() {
    this.#loadIcon();
  }

  connectedCallback() {
    this.#loadIcon();
  }

  async #loadIcon() {
    const name = this.getAttribute('name');
    if (!name) return;

    this.#abortController?.abort();
    this.#abortController = new AbortController();

    const svgContent = await this.#fetchIcon(
      name,
      this.#abortController.signal,
    );

    if (this.#abortController.signal.aborted) return;

    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          width: 1.5em;
          height: 1.5em;
          vertical-align: text-bottom;
        }

        svg {
          display: block;
          width: 100%;
          height: 100%;
          fill: currentColor;
        }
      </style>
      ${svgContent}
      `;
    }
  }

  /**
   * @param {string} name
   * @param {AbortSignal} signal
   */
  async #fetchIcon(name, signal) {
    if (iconCache.has(name)) {
      return /** @type {string} */ (iconCache.get(name));
    }

    const res = await fetch(`${ICONS_PATH}/${name}.svg`, { signal });
    if (!res.ok) throw new Error(`Status ${res.status}`);

    const text = await res.text();
    iconCache.set(name, text);
    return text;
  }
}

customElements.define('tabler-icon', TablerIcon);
