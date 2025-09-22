import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { CoreElement } from '../../core/element/element';

import styles from './cel-lazyload.scss?inline';

@customElement('cel-lazyload')
export class CelLazyload extends CoreElement(styles) {
    @property({ type: Boolean, reflect: true, useDefault: true, attribute: 'load-state' }) loadState = false;

    @property({ type: Boolean })
    set loaded(l: boolean) {
        if (l && !this.loadState) {
            this.loadState = true;
        }
    }

    get loaded() {
        return this.loadState;
    }

    override render() {
        if (!this.loadState) {
            return nothing;
        }

        return html`<slot></slot>`;
    }
}
