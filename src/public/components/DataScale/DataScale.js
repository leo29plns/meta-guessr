class DataScale extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>
        p {
          color: rebeccapurple;
        }
      </style>
      <p><slot></p>
    `;
  }
}

customElements.define('data-scale', DataScale);
