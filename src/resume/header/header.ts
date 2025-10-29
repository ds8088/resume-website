import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { classMap } from 'lit/directives/class-map.js';

import { CoreElement } from '../../core/element/element.ts';
import type { ResumeTitle} from '../../controllers/titles.ts';
import { titleMeta } from '../../controllers/titles.ts';
import { CoreEvent } from '../../core/events.ts';
import { LocalizableElement } from '../../i18n/localizable.ts';
import type { LanguageID } from '../../i18n/language.ts';

import '../../components/cel-button/cel-button.ts';
import '../../components/cel-checkbox/cel-checkbox.ts';
import '../../components/cel-svg/cel-svg.ts';

import styles from './header.scss?inline';

@customElement('resume-header')
export class ResumeHeader extends LocalizableElement(CoreElement(styles)) {
    @state() private readonly selectedTitles = new Set<ResumeTitle>();

    private readonly setTitleState = (title: ResumeTitle, state: boolean) => {
        if (state) {
            this.selectedTitles.add(title);
        } else {
            this.selectedTitles.delete(title);
        }

        this.dispatchEvent(new CoreEvent('titles-changed', this.selectedTitles));
        this.requestUpdate();
    };

    private readonly switchLanguage = (lang: LanguageID) => {
        this.dispatchEvent(new CoreEvent('language-changed', lang));
    };

    override render() {
        const preferredLanguage = this.locale.preferredLanguage;

        return html`<header class="header">
            <div class="header__upper">
                <h1 class="header__name">
                    ${this.localize({
                        en: 'Sedelnikov Dmitriy',
                        ru: 'Седельников Дмитрий',
                    })}
                </h1>

                <ol class="header__languages">
                    <li class=${classMap({ header__language: true, header__language_active: preferredLanguage === 'en' })}>
                        <cel-button
                            passthru
                            class="header__language-button"
                            @button-click=${() => {
                                this.switchLanguage('en');
                            }}
                        >
                            <div class="header__language-contents">
                                <cel-svg
                                    class="header__language-icon"
                                    symbol="flag-en"
                                    alt=${this.localize({
                                        en: 'English',
                                        ru: 'Английский',
                                    })}
                                ></cel-svg>
                                <span>EN</span>
                            </div>
                        </cel-button>
                    </li>
                    <li class=${classMap({ header__language: true, header__language_active: preferredLanguage === 'ru' })}>
                        <cel-button
                            passthru
                            class="header__language-button"
                            @button-click=${() => {
                                this.switchLanguage('ru');
                            }}
                        >
                            <div class="header__language-contents">
                                <cel-svg
                                    class="header__language-icon"
                                    symbol="flag-ru"
                                    alt=${this.localize({
                                        en: 'Russian',
                                        ru: 'Русский',
                                    })}
                                ></cel-svg>
                                <span>RU</span>
                            </div>
                        </cel-button>
                    </li>
                </ol>
            </div>

            <h2 class="header__description">
                ${this.localize({
                    en: 'IT specialist',
                    ru: 'IT-\u{2060}специалист',
                })}
            </h2>

            <div class="header__titles">
                <span>
                    ${this.localize({
                        en: 'Choose the\u{a0}skills that you\u{a0}are interested\u{a0}in:',
                        ru: 'Выберите навыки, которые вас\u{a0}интересуют:',
                    })}
                </span>

                <ol class="titles">
                    ${repeat(
                        titleMeta.entries(),
                        ([title]) => title,
                        ([title, meta]) => html`
                            <li class="title">
                                <cel-checkbox
                                    class=${classMap({
                                        title__checkbox: true,
                                        title__checkbox_darken: this.selectedTitles.size > 0 && !this.selectedTitles.has(title),
                                    })}
                                    .value=${this.selectedTitles.has(title)}
                                    @value-changed=${(v: CustomEvent<boolean>) => {
                                        this.setTitleState(title, v.detail);
                                    }}
                                >
                                    <strong class="title__text">${this.localize(meta.long)}</strong>
                                </cel-checkbox>
                            </li>
                        `
                    )}
                </ol>
            </div>
        </header>`;
    }
}
