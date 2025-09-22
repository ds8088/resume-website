import { html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import type { ClassInfo } from 'lit/directives/class-map.js';
import { classMap } from 'lit/directives/class-map.js';
import type { Ref } from 'lit/directives/ref.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { CoreElement } from '../../core/element/element';
import { CoreEventContained } from '../../core/events';

import styles from './cel-button.scss?inline';

@customElement('cel-button')
export class CelButton extends CoreElement(styles) {
    @property() label = '';
    @property({ type: Boolean }) passthru = false;
    @property({ type: Boolean }) outline = false;

    @state() private readonly buttonRef: Ref<HTMLButtonElement> = createRef();

    private onClick() {
        this.dispatchEvent(new CoreEventContained('button-click'));
    }

    private getClasses(): ClassInfo {
        return {
            button: true,
            button_passthru: this.passthru,
            button_outline: this.outline,
        };
    }

    public override focus = () => {
        this.buttonRef.value?.focus();
    };

    override render() {
        return html`<button ${ref(this.buttonRef)} class=${classMap(this.getClasses())} type="button" part="button" @click=${this.onClick}>
            <slot>${this.label ? html`<span class="button__label">${this.label}</span>` : nothing}</slot>
        </button>`;
    }
}
