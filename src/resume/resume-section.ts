import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { CoreElement } from '../core/element/element.ts';

import styles from './resume-section.scss?inline';

@customElement('resume-section')
export class ResumeSection extends CoreElement(styles) {
    @property() label = '';
    @property({ type: Boolean }) compact = false;

    override render() {
        return html` <section
            class=${classMap({
                section: true,
                section_compact: this.compact,
            })}
        >
            <h2 class="section__title">
                <slot name="title"> ${this.label} </slot>
            </h2>

            <div class="section__content">
                <slot></slot>
            </div>
        </section>`;
    }
}
