import { Temporal } from 'temporal-polyfill';
import { type Locale } from '../i18n/locale';

// Actually it all started in late 2002, but that might look way too obscene,
// even according to my standards.
// Setting it to 2009 somewhat rounds the discrepancy.
// Moreover, using my birthday's month and day components works so that
// both the age and experience counters get updated on the same date.
export const experienceStartDate = new Temporal.PlainDate(2009, 9, 27, 'gregory');

export const totalYoE = Temporal.Now.plainDateISO().withCalendar('gregory').since(experienceStartDate, {
    smallestUnit: 'year',
    largestUnit: 'year',
    roundingMode: 'trunc',
}).years;

export const commercialExperienceStartDate = new Temporal.PlainDate(2018, 11, 1, 'gregory');

export const totalCommercialYoE = Temporal.Now.plainDateISO().withCalendar('gregory').since(commercialExperienceStartDate, {
    smallestUnit: 'year',
    largestUnit: 'year',
    roundingMode: 'trunc',
}).years;

export const pluralizeYoE = (yoe: number, locale: Locale) =>
    locale.pluralize(yoe, {
        en: ['year', 'years', 'years'],
        ru: ['год', 'года', 'лет'],
    });
