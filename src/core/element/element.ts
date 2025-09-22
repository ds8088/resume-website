import type { CSSResultGroup } from 'lit';
import { LitElement, unsafeCSS } from 'lit';

import commonStyles from './element.scss?inline';

export interface LifecycleSignaler {
    get lifetimeSignal(): AbortSignal | undefined;
}

export const CoreElement = (style?: string) => {
    return class extends LitElement {
        static override styles: CSSResultGroup = [unsafeCSS(commonStyles), ...(style ? [unsafeCSS(style)] : [])];
        static override shadowRootOptions: ShadowRootInit = { mode: 'open' };

        protected addCustomEventListener<T>(name: string, callback: (event: CustomEvent<T>) => void) {
            this.addEventListener(name, callback as (evt: Event) => void);
        }
    };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AbortableElement = <T extends new (...args: any[]) => LitElement>(element: T) => {
    return class extends element implements LifecycleSignaler {
        private abortController?: AbortController;

        override connectedCallback() {
            super.connectedCallback();
            this.abortController = new AbortController();
        }

        override disconnectedCallback() {
            this.abortController?.abort();
            super.disconnectedCallback();
        }

        get lifetimeSignal(): AbortSignal | undefined {
            if (this.abortController) {
                return this.abortController.signal;
            }

            return undefined;
        }
    };
};
