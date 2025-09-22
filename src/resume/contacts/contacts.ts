import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Temporal } from 'temporal-polyfill';

import { CoreElement } from '../../core/element/element.ts';
import { LocalizableElement } from '../../i18n/localizable.ts';

import '../resume-section.ts';
import '../../components/cel-tooltip/cel-tooltip.ts';
import '../../components/cel-svg/cel-svg.ts';

import styles from './contacts.scss?inline';

@customElement('resume-contacts')
export class ResumeContacts extends LocalizableElement(CoreElement(styles)) {
    private readonly birthdayDate = new Temporal.PlainDate(1995, 9, 27, 'gregory');

    private getTelegramURL() {
        // Intentionally omit \u{a0}'s here.
        // These messages get sent to the Telegram messenger and I'm not sure if there are any edge cases
        // related to handling non-breaking spaces and other uncommon characters.
        const greeting = this.localize({
            en: 'Hi! I found your CV and would like to discuss it further...',
            ru: 'Привет! Меня заинтересовало твое резюме и хотелось бы пообщаться...',
        });

        return `tg://resolve?domain=pootis_network&text=${encodeURIComponent(greeting)}`;
    }

    private getMailtoURL() {
        // Same, intentionally omit \u{a0}'s here.
        const greeting = this.localize({
            en: 'Regarding your CV',
            ru: 'По поводу работы',
        });

        return `mailto:admin@pootis.network&subject=${encodeURIComponent(greeting)}`;
    }

    private describeCurrentAge() {
        const years = Temporal.Now.plainDateISO().withCalendar('gregory').since(this.birthdayDate, {
            smallestUnit: 'year',
            largestUnit: 'year',
            roundingMode: 'trunc',
        }).years;

        return `${years.toString()} ${this.locale.pluralize(years, {
            en: ['year\u{a0}old', 'years\u{a0}old', 'years\u{a0}old'],
            ru: ['год', 'года', 'лет'],
        })}`;
    }

    override render() {
        return html` <resume-section
            compact
            .label=${this.localize({
                en: 'Contact\u{a0}me',
                ru: 'Контактная информация',
            })}
        >
            <address class="contacts">
                <ul class="contacts__list">
                    <li class="contact">
                        <cel-svg
                            class="contact__icon"
                            symbol="phone"
                            alt=${this.localize({
                                en: 'Phone',
                                ru: 'Телефон',
                            })}
                        ></cel-svg>
                        <a class="contact__link" href="tel:+79634307050" rel="author">+7&nbsp;(963)&nbsp;430-&#8288;70-&#8288;50</a>
                        <cel-tooltip simple class="contact__tooltip">
                            <cel-svg
                                symbol="info"
                                size="20"
                                alt=${this.localize({
                                    en: 'Info',
                                    ru: 'Информация',
                                })}
                            ></cel-svg>

                            <p slot="tooltip">
                                ${this.localize({
                                    en:
                                        "I'm\u{a0}fine with\u{a0}people calling\u{a0}me on\u{a0}my\u{a0}personal cellphone but\u{a0}nevertheless I\u{a0}prefer " +
                                        'text-\u{2060}based conversations (Telegram or\u{a0}e-\u{2060}mail)',
                                    ru: 'На\u{a0}звонки я\u{a0}отвечаю, но\u{a0}больше все\u{a0}же\u{a0}предпочитаю сообщения (Telegram или\u{a0}e-\u{2060}mail).',
                                })}
                            </p>
                        </cel-tooltip>
                    </li>

                    <li class="contact">
                        <cel-svg class="contact__icon" symbol="telegram" alt="Telegram"></cel-svg>
                        <a class="contact__link" href=${this.getTelegramURL()} rel="author">pootis_network</a>
                    </li>

                    <li class="contact">
                        <cel-svg
                            class="contact__icon"
                            symbol="email"
                            alt=${this.localize({
                                en: 'E-\u{2060}mail',
                                ru: 'Электронная почта',
                            })}
                        ></cel-svg>
                        <a class="contact__link" href=${this.getMailtoURL()} rel="author">admin@pootis.network</a>
                    </li>

                    <li class="contact">
                        <cel-svg class="contact__icon" symbol="github" alt="GitHub"></cel-svg>
                        <a class="contact__link" href="https://github.com/ds8088" rel="author noreferrer noopener external" target="_blank">
                            ds8088
                        </a>
                    </li>

                    <li class="contact">
                        <cel-svg
                            class="contact__icon"
                            symbol="calendar"
                            alt=${this.localize({
                                en: 'Birthday',
                                ru: 'Дата рождения',
                            })}
                        ></cel-svg>
                        <time
                            datetime=${this.birthdayDate.toString({
                                calendarName: 'never',
                            })}
                        >
                            ${this.locale.formatDate(this.birthdayDate, {
                                calendar: 'gregory',
                            })}
                            (${this.describeCurrentAge()})
                        </time>
                    </li>

                    <li class="contact">
                        <cel-svg
                            class="contact__icon"
                            symbol="location"
                            alt=${this.localize({
                                en: 'Location',
                                ru: 'Место проживания',
                            })}
                        ></cel-svg>
                        <a
                            class="contact__link"
                            href="https://www.openstreetmap.org/#map=13/58.59653/49.64224"
                            rel="noreferrer noopener nofollow external"
                            target="_blank"
                        >
                            ${this.localize({
                                en: 'Kirov, Kirovskaya oblast',
                                ru: 'Киров, Кировская область',
                            })}
                        </a>
                    </li>
                </ul>
            </address>
        </resume-section>`;
    }
}
