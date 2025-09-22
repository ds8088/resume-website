import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import { CoreElement } from '../../core/element/element';
import { CoreEventContained } from '../../core/events';

import styles from './cel-slider.scss?inline';

@customElement('cel-slider')
export class CelSlider extends CoreElement(styles) {
    @property({ attribute: false }) value?: number;
    @property({ type: Number, attribute: 'min', reflect: true }) min = 0;
    @property({ type: Number, attribute: 'max', reflect: true }) max = 100;
    @property({ type: Number, attribute: 'step', reflect: true }) step = 1;
    @property({ type: Boolean, attribute: 'percentage', reflect: true }) percentage = false;

    // Try to keep num-ticks in sync with the actual number of ticks we've accumulated during our lifetime,
    // which is currently 2.
    // This may change in the future based on the 2026 forecast of tick activity in the local forests.
    @property({ type: Number, attribute: 'num-ticks', reflect: true }) numTicks = 2;

    private get avg() {
        return (this.max - this.min) / 2 + this.min;
    }

    private onInput(e: Event) {
        const input = e.target as HTMLInputElement;
        this.value = parseInt(input.value, 10);
        if (Number.isNaN(this.value)) {
            this.value = this.avg;
        }

        if (this.percentage) {
            this.value /= 100;
        }

        this.dispatchEvent(new CoreEventContained('value-changed', this.value));
    }

    private *markerGenerator(): Generator<number> {
        const parts = this.numTicks - 1;
        for (let i = 1; i <= this.numTicks - 2; i++) {
            yield Math.round(this.min + ((this.max - this.min) / parts) * i);
        }
    }

    get hasTicks() {
        return this.numTicks >= 2;
    }

    private getValue() {
        if (this.value === undefined) {
            return this.avg;
        }

        return this.percentage ? this.value * 100 : this.value;
    }

    private getLabel(n: number): string {
        return this.percentage ? `${n}%` : n.toString();
    }

    override render() {
        return html`
            <div class="slider">
                <input
                    class="slider__input"
                    part="slider"
                    type="range"
                    min=${this.min}
                    max=${this.max}
                    step=${this.step}
                    .value=${this.getValue()}
                    @input="${this.onInput}"
                    list=${this.hasTicks ? 'markers' : nothing}
                />

                ${this.hasTicks
                    ? html`
                          <datalist class="slider__markers" id="markers">
                              <option value=${this.min} label=${this.getLabel(this.min)}></option>
                              ${repeat(
                                  this.markerGenerator(),
                                  (marker: number) => html`<option value=${marker} label=${this.getLabel(marker)}></option>`
                              )}
                              <option value=${this.max} label=${this.getLabel(this.max)}></option>
                          </datalist>
                      `
                    : nothing}
            </div>
        `;
    }
}
