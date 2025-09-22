import type { LanguageID } from './language';

export const pluralizers: Record<LanguageID, (num: number, one: string, two: string, multi: string) => string> = {
    en: (num: number, one: string, two: string) => {
        if (Math.abs(num) === 1) {
            return one;
        }

        return two;
    },

    ru: (num: number, one: string, two: string, multi: string) => {
        let n = Math.abs(num) % 100;
        if (n >= 5 && n <= 20) {
            return multi;
        }

        n %= 10;
        if (n === 1) {
            return one;
        }

        if (n >= 2 && n <= 4) {
            return two;
        }

        return multi;
    },
};
