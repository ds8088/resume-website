import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { Ref } from 'lit/directives/ref.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import type { Placement } from '@floating-ui/dom';
import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';

import { CoreElement } from '../../core/element/element.ts';
import { CoreEvent } from '../../core/events.ts';

import styles from './cel-tooltip.scss?inline';

@customElement('cel-tooltip')
export class CelTooltip extends CoreElement(styles) {
    @property({ type: Number }) showDelay = 200;
    @property({ type: Number }) hideDelay = 200;
    @property({ type: Number }) transitionDuration = 300;

    @property() placement: Placement = 'top-start' satisfies string;
    @property({ type: Number }) offset = 8;
    @property({ type: Boolean }) simple = false;
    @property({ type: Boolean }) underline = false;

    @state() private tooltipActive = false;

    private readonly contentRef: Ref<HTMLElement> = createRef();
    private readonly tooltipRef: Ref<HTMLElement> = createRef();
    private timerID?: number;
    private deferredEventTimerID?: number;
    private readonly activationMethods = new Set<'pointer' | 'focus' | 'tooltip'>();

    private readonly showTooltip = async () => {
        await this.updatePosition();

        this.tooltipActive = true;
        this.tooltipRef.value?.showPopover();
        this.setupAutoUpdate();
        this.dispatchEvent(new CoreEvent('tooltip-show'));
    };

    private readonly hideTooltip = () => {
        this.teardownAutoUpdate();
        this.tooltipRef.value?.hidePopover();
        this.tooltipActive = false;

        // We have to defer the hide event, so it gets fired after the tooltip gets fully hidden.
        if (this.deferredEventTimerID !== undefined) {
            clearTimeout(this.deferredEventTimerID);
        }

        // Add 100ms to the duration to account for CSS/JS timeout discrepancies.
        this.deferredEventTimerID = setTimeout(() => {
            this.dispatchEvent(new CoreEvent('tooltip-hide'));
        }, this.transitionDuration + 100);
    };

    private readonly clearTimer = () => {
        if (this.timerID !== undefined) {
            clearTimeout(this.timerID);
            this.timerID = undefined;
        }
    };

    private readonly activate = (method: typeof this.activationMethods extends Set<infer T> ? T : never) => () => {
        this.activationMethods.add(method);
        this.clearTimer();

        if (this.showDelay <= 0 || method === 'focus') {
            void this.showTooltip();
            return;
        }

        this.timerID = setTimeout(() => {
            void this.showTooltip();
            this.timerID = undefined;
        }, this.showDelay);
    };

    private readonly deactivate = (method: typeof this.activationMethods extends Set<infer T> ? T : never) => () => {
        this.activationMethods.delete(method);

        if (this.activationMethods.size === 0) {
            this.clearTimer();

            // Normally, a keyboard-controlled popup gets shown or hidden immediately.
            // However, this messes up the focus order: the popup gets selected,
            // but it immediately becomes hidden due to the focus loss on the parent.
            // To remediate it, we use a hardcoded 50ms delay for unfocusing keyboard-controlled popups.
            const delay = method === 'focus' ? 50 : this.hideDelay;

            if (delay <= 0) {
                this.hideTooltip();
                return;
            }

            this.timerID = setTimeout(() => {
                this.hideTooltip();
                this.timerID = undefined;
            }, delay);
        }
    };

    private floatingUICleanup?: () => void;

    private readonly updatePosition = async () => {
        if (this.contentRef.value && this.tooltipRef.value) {
            const pos = await computePosition(this.contentRef.value, this.tooltipRef.value, {
                strategy: 'fixed',
                placement: this.placement,
                middleware: [
                    offset(this.offset),
                    shift({
                        padding: 8,
                    }),
                    flip({
                        padding: 8,
                        fallbackAxisSideDirection: 'start',
                    }),
                ],
            });

            // requestAnimationFrame() can be useful here,
            // but it allows a position to be invalid for a single frame,
            // which results in noticeable stuttering
            this.tooltipRef.value.style.left = `${pos.x.toFixed(3)}px`;
            this.tooltipRef.value.style.top = `${pos.y.toFixed(3)}px`;
        }
    };

    override disconnectedCallback(): void {
        this.clearTimer();
        this.teardownAutoUpdate();

        super.disconnectedCallback();
    }

    private teardownAutoUpdate() {
        if (this.floatingUICleanup) {
            this.floatingUICleanup();
            this.floatingUICleanup = undefined;
        }
    }

    private setupAutoUpdate() {
        if (this.contentRef.value && this.tooltipRef.value) {
            this.teardownAutoUpdate();
            this.floatingUICleanup = autoUpdate(this.contentRef.value, this.tooltipRef.value, this.updatePosition as () => void);
        }
    }

    override render() {
        return html`
            <div
                ${ref(this.contentRef)}
                class=${classMap({
                    tooltip__parent: true,
                    tooltip__parent_underline: this.underline,
                })}
                @mouseover=${this.activate('pointer')}
                @mouseout=${this.deactivate('pointer')}
                @focus=${this.activate('focus')}
                @blur=${this.deactivate('focus')}
                tabindex="0"
            >
                <slot></slot>
            </div>

            <div
                ${ref(this.tooltipRef)}
                class=${classMap({
                    tooltip: true,
                    tooltip_active: this.tooltipActive,
                    tooltip_simple: this.simple,
                })}
                style=${styleMap({ '--tooltip-transition-duration': `${this.transitionDuration}ms` })}
                @mouseover=${this.activate('tooltip')}
                @mouseout=${this.deactivate('tooltip')}
                @focusin=${this.activate('focus')}
                @focusout=${this.deactivate('focus')}
                popover="manual"
                tabindex="0"
            >
                <slot name="tooltip"></slot>
            </div>
        `;
    }
}
