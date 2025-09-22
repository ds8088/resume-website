import { html, nothing, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { StyleInfo} from 'lit/directives/style-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { CoreElement } from '../../core/element/element.ts';

import symbolBundle from '../../assets/icons/bundle.svg?no-inline';
import styles from './cel-svg.scss?inline';

@customElement('cel-svg')
export class CelSVG extends CoreElement(styles) {
    @property() symbol = '';
    @property({ type: Number }) size = 24;
    @property() alt?: string;

    private getStyles(): StyleInfo {
        return {
            '--icon-size': `${this.size.toFixed(0)}px`,
        };
    }

    override render() {
        return html`
            <svg class="svg" aria-label="${ifDefined(this.alt)}" style=${styleMap(this.getStyles())}>
                ${this.alt ? svg`<title>${this.alt}</title>` : nothing}
                <use href="${symbolBundle}#${this.symbol}" />
            </svg>
        `;
    }
}
