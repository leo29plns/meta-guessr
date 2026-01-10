import { App } from '@/scripts/App.js';

// Web Components
import '@/components/data-scale/data-scale.js';
import '@/components/ui-icon/ui-icon.js';

// Custom elements
customElements.define('form-group', class extends HTMLElement {});

new App();
