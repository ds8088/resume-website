import type { LanguageRecord } from '../i18n/language';
import { Controller } from './controller';

export type ResumeTitle = 'backend' | 'frontend' | 'fullstack' | 'devops' | 'sysadmin';

export const TitlesController = new Controller<Set<ResumeTitle>>(
    new Set(['backend', 'frontend', 'fullstack', 'devops', 'sysadmin']),
    'ctxTitles'
);

export const titleMeta = new Map<
    ResumeTitle,
    {
        color: {
            light: string;
            dark: string;
        };
        long: LanguageRecord<string>;
        short?: LanguageRecord<string>;
        priority?: number;
    }
>([
    [
        'backend',
        {
            color: {
                light: 'oklch(0.81 0.19 72)',
                dark: 'oklch(0.4 0.08 75)',
            },
            long: {
                en: 'Backend',
                ru: 'Бэкэнд',
            },
            priority: 3,
        },
    ],
    [
        'frontend',
        {
            color: {
                light: 'oklch(0.96 0.17 110)',
                dark: 'oklch(0.65 0.16 111)',
            },
            long: {
                en: 'Frontend',
                ru: 'Фронтэнд',
            },
            priority: 2,
        },
    ],
    [
        'fullstack',
        {
            color: {
                light: 'oklch(0.85 0.09 289)',
                dark: 'oklch(0.46 0.12 285)',
            },
            long: {
                en: 'Full-\u{2060}stack',
                ru: 'Фуллстек',
            },
            priority: 5,
        },
    ],
    [
        'devops',
        {
            color: {
                light: 'oklch(0.82 0.21 334)',
                dark: 'oklch(0.52 0.11 333)',
            },
            long: {
                en: 'DevOps',
                ru: 'DevOps',
            },
            priority: 1,
        },
    ],
    [
        'sysadmin',
        {
            color: {
                light: 'oklch(0.92 0.16 152)',
                dark: 'oklch(0.42 0.08 151)',
            },
            short: {
                en: 'Sysadmin',
                ru: 'Сисадмин',
            },
            long: {
                en: 'System Administration',
                ru: 'Системное администрирование',
            },
        },
    ],
]);

const isRelevantTitleSingle = (selected: Set<ResumeTitle>, title: ResumeTitle): boolean => {
    // If our skillset is empty, skip the relevance checks
    if (selected.size === 0) {
        return true;
    }

    // A title which is explicitly selected is always relevant
    if (selected.has(title)) {
        return true;
    }

    // If we have "backend" or "frontend" selected, and the title is "fullstack",
    // assume it's relevant
    if ((selected.has('backend') || selected.has('frontend')) && title === 'fullstack') {
        return true;
    }

    // Same, but in reverse: if the title is either "backend" or "frontend",
    // and we have "fullstack" selected, it's relevant
    if (selected.has('fullstack') && (title === 'backend' || title === 'frontend')) {
        return true;
    }

    return false;
};

export const isRelevantTitle = (selected: Set<ResumeTitle>, title: ResumeTitle | Set<ResumeTitle>): boolean => {
    if (title instanceof Set) {
        for (const t of title.values()) {
            if (isRelevantTitleSingle(selected, t)) {
                return true;
            }
        }

        return false;
    }

    return isRelevantTitleSingle(selected, title);
};

export const splitByTitleRelevancy = <T>(
    elements: T[],
    selected: Set<ResumeTitle>,
    extractor: (elem: T) => ResumeTitle | Set<ResumeTitle>
): {
    relevant: T[];
    nonRelevant: T[];
} => {
    const relevant: T[] = [];
    const nonRelevant: T[] = [];

    for (const elem of elements) {
        const title = extractor(elem);
        if (isRelevantTitle(selected, title)) {
            relevant.push(elem);
        } else {
            nonRelevant.push(elem);
        }
    }

    return {
        nonRelevant,
        relevant,
    };
};
