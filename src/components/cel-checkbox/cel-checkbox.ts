import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { Ref } from 'lit/directives/ref.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { CoreElement } from '../../core/element/element';
import { CoreEventContained } from '../../core/events';

import styles from './cel-checkbox.scss?inline';
import { randomString } from '../../utils/random';

@customElement('cel-checkbox')
export class CelCheckbox extends CoreElement(styles) {
    @property({ type: Boolean, reflect: true }) value = false;
    @property() name = '';

    private readonly checkboxRef: Ref<HTMLInputElement> = createRef();

    private onInput() {
        if (this.checkboxRef.value) {
            this.dispatchEvent(new CoreEventContained('value-changed', this.checkboxRef.value.checked));
        }
    }

    override willUpdate(changedProperties: Map<string, unknown>) {
        // Generate a random checkbox name if it becomes empty for any reason
        if (changedProperties.has('name') && this.name === '') {
            this.name = randomString(16);
        }
    }

    public override focus = () => {
        this.checkboxRef.value?.focus();
    };

    override render() {
        return html`
            <label class="checkbox" part="label">
                <input
                    ${ref(this.checkboxRef)}
                    class="checkbox__input"
                    type="checkbox"
                    name=${this.name}
                    part="checkbox"
                    ?checked=${this.value}
                    @input="${this.onInput}"
                />
                <slot></slot>
            </label>
        `;
    }
}
