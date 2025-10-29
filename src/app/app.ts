import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { CoreElement } from '../core/element/element.ts';
import { LocaleController } from '../controllers/locale.ts';
import type { ResumeTitle } from '../controllers/titles.ts';
import { TitlesController } from '../controllers/titles.ts';
import { Locale } from '../i18n/locale.ts';
import type { LanguageID } from '../i18n/language.ts';
import { loadFonts } from '../utils/font-loader.ts';
import { pluralizeYoE, totalYoE } from '../utils/yoe.ts';

import '../resume/legacy-bar/legacy-bar.ts';
import '../resume/header/header.ts';
import '../resume/contacts/contacts.ts';
import '../resume/summary/summary.ts';
import '../resume/experience/experience.ts';
import '../resume/expectations/expectations.ts';
import '../resume/languages/languages.ts';
import '../resume/action/action.ts';
import '../resume/footer/footer.ts';

import styles from './app.scss?inline';

loadFonts();

@customElement('resume-app')
export class ResumeApp extends CoreElement(styles) {
    private readonly localeProvider = LocaleController.attachProvider(this);
    private readonly titlesProvider = TitlesController.attachProvider(this);

    constructor() {
        super();
        this.setupLocale();

        this.addCustomEventListener('titles-changed', (e: CustomEvent<Set<ResumeTitle>>) => {
            this.titlesProvider.setValue(e.detail, true);
        });

        this.addCustomEventListener('language-changed', (e: CustomEvent<LanguageID>) => {
            this.changeLocale([e.detail, ...window.navigator.languages], true);
        });
    }

    // changeLocale is the main entrypoint for triggering the locale change across the entire app.
    private changeLocale(languageIDs: string[], changeQuery: boolean) {
        const locale = new Locale(
            languageIDs,
            Intl.DateTimeFormat(window.navigator.languages).resolvedOptions().timeZone,
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

        // Trigger the locale change.
        this.localeProvider.value = locale;

        // Perform additional locale-related work here.
        // We can delegate this to a dummy Lit element but doing it here is simpler.

        const title = locale.translate({
            en: 'CV | Sedelnikov Dmitriy',
            ru: 'Резюме | Седельников Дмитрий',
        });

        const description = locale.translate({
            en: `CV of an IT specialist: ${totalYoE} ${pluralizeYoE(totalYoE, locale)} of experience and more than 50 commercial projects.`,
            ru: `Резюме IT-специалиста: ${totalYoE} ${pluralizeYoE(totalYoE, locale)} опыта и более 50 коммерческих проектов.`,
        });

        document.title = title;
        document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
        document.querySelectorAll('meta[name="description"], meta[property="og:description"]').forEach((e) => {
            e.setAttribute('content', description);
        });

        document.querySelector('meta[name="author"]')?.setAttribute(
            'content',
            locale.translate({
                en: 'Sedelnikov Dmitriy',
                ru: 'Дмитрий Седельников',
            })
        );

        document.querySelector('meta[property="og:profile:first_name"]')?.setAttribute(
            'content',
            locale.translate({
                en: 'Dmitriy',
                ru: 'Дмитрий',
            })
        );

        document.querySelector('meta[property="og:profile:last_name"]')?.setAttribute(
            'content',
            locale.translate({
                en: 'Sedelnikov',
                ru: 'Седельников',
            })
        );

        document.documentElement.lang = locale.preferredLanguage;

        // Replace the history entry.
        if (changeQuery) {
            const location = new URL(window.location.toString());
            location.searchParams.set('lang', locale.preferredLanguage);
            history.pushState(null, '', location);
        }
    }

    private setupLocale() {
        let languages = [...window.navigator.languages];

        const queryParams = new URLSearchParams(window.location.search);
        const queryLanguage = queryParams.get('lang');

        if (queryLanguage) {
            languages = [queryLanguage, ...languages];
        }

        this.changeLocale(languages, false);
    }

    override render() {
        return html`
            <resume-legacy-bar></resume-legacy-bar>

            <div class="app">
                <resume-header></resume-header>
                <resume-contacts></resume-contacts>
                <resume-summary></resume-summary>
                <resume-experience></resume-experience>
                <resume-expectations></resume-expectations>
                <resume-languages></resume-languages>

                <div class="app__lower">
                    <resume-action></resume-action>
                    <resume-footer></resume-footer>
                </div>
            </div>
        `;
    }
}
