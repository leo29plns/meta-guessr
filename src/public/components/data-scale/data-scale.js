export class DataScale extends HTMLElement {
  /** @type {ShadowRoot} */
  #root;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: 'open' });

    const template = /** @type {HTMLTemplateElement | null} */ (
      document.getElementById('template-data-scale')
    );

    if (template) {
      this.#root.appendChild(template.content.cloneNode(true));
    }
  }
}

customElements.define('data-scale', DataScale);
