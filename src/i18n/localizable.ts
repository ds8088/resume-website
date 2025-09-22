import type { LitElement } from 'lit';
import { LocaleController } from '../controllers/locale';
import type { LanguageRecord } from './language';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LocalizableElement = <T extends new (...args: any[]) => LitElement>(element: T) => {
    return class extends element {
        private readonly localeController = LocaleController.attachConsumer(this);

        protected get locale() {
            return this.localeController.val;
        }

        protected localize(trs: string | LanguageRecord<string>): string {
            return this.locale.translate(trs);
        }
    };
};
