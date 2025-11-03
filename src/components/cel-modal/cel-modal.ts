import type { PropertyValues } from 'lit';
import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Ref } from 'lit/directives/ref.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';

import { CoreElement } from '../../core/element/element.ts';
import { CoreEventContained } from '../../core/events.ts';
import { LocalizableElement } from '../../i18n/localizable.ts';

import '../cel-svg/cel-svg.ts';
import '../cel-button/cel-button.ts';

import styles from './cel-modal.scss?inline';

@customElement('cel-modal')
export class CelModal extends LocalizableElement(CoreElement(styles)) {
    @property({ type: Boolean, attribute: 'open', reflect: true }) open = false;
    @property({ type: Number, attribute: 'width' }) width = 500;
    @property({ type: Boolean, attribute: 'no-close' }) noClose = false;
    @property({ type: Boolean, attribute: 'no-overlay' }) noOverlay = false;
    @property({ type: Boolean, attribute: 'cascade' }) cascade = false;

    private static modalsOpened = 0;

    private readonly dialogRef: Ref<HTMLDialogElement> = createRef();

    private closeModal() {
        if (!this.noClose) {
            this.open = false;
            this.sendEvent();
        }
    }

    private sendEvent() {
        this.dispatchEvent(new CoreEventContained('open-changed', this.open));
    }

    private readonly onPointerDown = (event: PointerEvent) => {
        const canBeClosed = (event: Event) => {
            return !this.noClose && this.dialogRef.value && event.currentTarget && event.target === this.dialogRef.value;
        };

        const closeOnClick = (event: Event) => {
            if (canBeClosed(event)) {
                this.dialogRef.value?.close();
            }
        };

        if (canBeClosed(event)) {
            this.dialogRef.value?.removeEventListener('click', closeOnClick);

            this.dialogRef.value?.addEventListener(
                'pointerup',
                (event) => {
                    if (canBeClosed(event)) {
                        this.dialogRef.value?.addEventListener('click', closeOnClick, { once: true });
                    }
                },
                { once: true }
            );
        }
    };

    private readonly onCancel = (event: Event) => {
        if (this.noClose) {
            event.preventDefault();
        }
    };

    private readonly onKeydown = (event: KeyboardEvent) => {
        if (this.noClose && event.key === 'Escape') {
            event.preventDefault();
        }
    };

    protected override willUpdate(changedProperties: PropertyValues<this>): void {
        if (changedProperties.has('open')) {
            const oldState = changedProperties.get('open');

            if ((oldState === undefined && this.open) || (oldState && !this.open)) {
                CelModal.modalsOpened += this.open ? 1 : -1;
            }
        }
    }

    override disconnectedCallback(): void {
        if (this.open) {
            CelModal.modalsOpened--;
        }
    }

    override updated(changedProperties: Map<string, unknown>) {
        if (changedProperties.has('open')) {
            if (this.open) {
                this.dialogRef.value?.showModal();
            } else {
                this.dialogRef.value?.close();

                if (this.noClose) {
                    this.sendEvent();
                }
            }
        }
    }

    private get modalWidth(): number {
        if (!this.cascade) {
            return this.width;
        }

        const depth = Math.max(1, Math.min(3, CelModal.modalsOpened));
        return this.width - depth * 24;
    }

    private get modalExtraPadding(): number {
        if (!this.cascade) {
            return 0;
        }

        const depth = Math.max(1, Math.min(3, CelModal.modalsOpened));
        return depth * 16;
    }

    override render() {
        return html`
            <dialog
                ${ref(this.dialogRef)}
                popover="auto"
                class=${classMap({ modal: true, modal_overlay: !this.noOverlay })}
                style="${styleMap({
                    width: this.modalWidth.toFixed(0) + 'px',
                    '--modal-extra-height': this.modalExtraPadding.toFixed(0) + 'px',
                })}"
                tabindex="0"
                @close=${this.closeModal}
                @pointerdown=${this.onPointerDown}
                @cancel=${this.onCancel}
                @keydown=${this.onKeydown}
            >
                ${this.noClose
                    ? nothing
                    : html`
                          <cel-button
                              class="modal__close"
                              passthru
                              @button-click="${() => {
                                  this.dialogRef.value?.close();
                                  this.closeModal();
                              }}"
                          >
                              <cel-svg
                                  class="modal__close-icon"
                                  symbol="cross"
                                  alt=${this.localize({
                                      en: 'Close',
                                      ru: 'Закрыть',
                                  })}
                              ></cel-svg>
                          </cel-button>
                      `}

                <div class="modal__body">
                    <slot></slot>
                </div>
            </dialog>
        `;
    }
}
