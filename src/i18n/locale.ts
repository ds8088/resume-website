import type { nothing, TemplateResult } from 'lit';
import type { Temporal } from 'temporal-polyfill';

import type { LanguageID, LanguageRecord} from './language';
import { supportedLanguages } from './language';
import { pluralizers } from './pluralizer';

export class Locale {
    public readonly localeIDs: string[] = [];
    public readonly timezone: string;
    public readonly languages = new Set<LanguageID>();
    public readonly pluralizer: (num: number, one: string, two: string, multi: string) => string;

    private readonly dateFormatter: Intl.DateTimeFormat;
    private readonly timeFormatter: Intl.DateTimeFormat;
    private readonly dateTimeFormatter: Intl.DateTimeFormat;

    private readonly dateFormatOptions: Intl.DateTimeFormatOptions;
    private readonly timeFormatOptions: Intl.DateTimeFormatOptions;
    private readonly dateTimeFormatOptions: Intl.DateTimeFormatOptions;

    constructor(localeIDs: string[], timezone: string, dateOptions?: Intl.DateTimeFormatOptions, timeOptions?: Intl.DateTimeFormatOptions) {
        for (let localeID of localeIDs) {
            localeID = localeID.trim();
            if (localeID === '') {
                continue;
            }

            try {
                Intl.getCanonicalLocales(localeID);
            } catch {
                continue;
            }

            const splitted = localeID.split('-');
            if (splitted.length > 0 && splitted[0]) {
                const language = splitted[0].toLowerCase() as LanguageID;
                if (supportedLanguages.has(language)) {
                    this.languages.add(language);
                }
            }

            this.localeIDs.push(localeID);
        }

        // If we didn't manage to obtain even a single locale,
        // use supportedLanguageIDs as fallback
        if (this.localeIDs.length === 0) {
            this.localeIDs = [...supportedLanguages.values()];
        }

        this.pluralizer = pluralizers[this.preferredLanguage];

        this.timezone = timezone;

        this.dateFormatOptions = dateOptions ?? {
            dateStyle: 'short',
        };

        this.timeFormatOptions = timeOptions ?? {
            timeStyle: 'short',
        };

        this.dateTimeFormatOptions = {
            ...(dateOptions ?? {
                dateStyle: 'short',
            }),

            ...(timeOptions ?? {
                timeStyle: 'short',
            }),
        };

        this.dateFormatter = new Intl.DateTimeFormat(this.localeIDs, this.dateFormatOptions);
        this.timeFormatter = new Intl.DateTimeFormat(this.localeIDs, this.timeFormatOptions);
        this.dateTimeFormatter = new Intl.DateTimeFormat(this.localeIDs, this.dateTimeFormatOptions);
    }

    get preferredLanguage(): LanguageID {
        if (this.languages.size === 0) {
            return [...supportedLanguages.values()][0];
        }

        return [...this.languages.values()][0];
    }

    formatDate(
        d: Date | Temporal.ZonedDateTime | Temporal.Instant | Temporal.PlainDate | Temporal.PlainYearMonth,
        opts?: Intl.DateTimeFormatOptions
    ): string {
        if (d instanceof Date) {
            return this.dateFormatter.format(d);
        }

        return d.toLocaleString(this.localeIDs, {
            calendar: 'iso8601',
            ...this.dateFormatOptions,
            ...opts,
        });
    }

    formatTime(d: Date | Temporal.ZonedDateTime | Temporal.Instant | Temporal.PlainTime): string {
        if (d instanceof Date) {
            return this.timeFormatter.format(d);
        }

        return d.toLocaleString(this.localeIDs, { ...this.timeFormatOptions });
    }

    formatTimeHHMM(t: Temporal.PlainTime): string {
        return t.toString({ smallestUnit: 'minute' });
    }

    formatDateTime(d: Date | Temporal.ZonedDateTime | Temporal.Instant, opts?: Intl.DateTimeFormatOptions): string {
        if (d instanceof Date) {
            return this.dateTimeFormatter.format(d);
        }

        return d.toLocaleString(this.localeIDs, {
            calendar: 'iso8601',
            ...this.dateTimeFormatOptions,
            ...opts,
        });
    }

    formatDuration(d: Temporal.Duration): string {
        const n = d.total({ unit: 'second' });

        const h = Math.floor(n / (60 * 60))
            .toString()
            .padStart(2, '0');
        const m = Math.floor((n / 60) % 60)
            .toString()
            .padStart(2, '0');
        const s = Math.floor(n % 60)
            .toString()
            .padStart(2, '0');

        return `${h}:${m}:${s}`;
    }

    formatDurationLocalized(d: Temporal.Duration, opts?: Intl.DateTimeFormatOptions | { style?: 'long' | 'short' }): string {
        return d.toLocaleString(this.localeIDs, {
            ...this.dateTimeFormatOptions,
            ...opts,
        });
    }

    translate(trs: string | LanguageRecord<string>): string {
        if (typeof trs === 'string') {
            return trs;
        }

        for (const language of this.languages) {
            if (typeof trs[language] !== 'undefined') {
                return trs[language];
            }
        }

        return Object.values(trs)[0];
    }

    render(trs: LanguageRecord<TemplateResult | typeof nothing>): TemplateResult | typeof nothing {
        for (const language of this.languages) {
            if (typeof trs[language] !== 'undefined') {
                return trs[language];
            }
        }

        return Object.values(trs)[0];
    }

    pluralize(n: number, trs: LanguageRecord<[string, string, string]>): string {
        for (const language of this.languages) {
            if (typeof trs[language] !== 'undefined') {
                const plr = trs[language];
                return this.pluralizer(n, plr[0], plr[1], plr[2]);
            }
        }

        return Object.keys(trs)[0][2];
    }
}

export const DefaultLocale = new Locale(
    [...supportedLanguages.values()],
    'UTC',
    {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    },
    {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }
);
