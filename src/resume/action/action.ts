import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { CoreElement } from '../../core/element/element.ts';
import { LocalizableElement } from '../../i18n/localizable.ts';

import '../../components/cel-button/cel-button.ts';
import '../../components/cel-modal/cel-modal.ts';
import '../../components/cel-tooltip/cel-tooltip.ts';
import '../../components/cel-svg/cel-svg.ts';

import styles from './action.scss?inline';

@customElement('resume-action')
export class ResumeAction extends LocalizableElement(CoreElement(styles)) {
    @state() private contactsModal = false;

    override render() {
        return html`
            <section class="action">
                <p class="action__paragraph">
                    ${this.localize({
                        en: "Let's discuss how\u{a0}my\u{a0}skills in\u{a0}IT could help your business to\u{a0}achieve its\u{a0}goals.",
                        ru: 'Давайте обсудим\u{a0}то, как мои\u{a0}навыки и\u{a0}опыт в\u{a0}IT могут помочь вашему бизнесу в\u{a0}решении задач.',
                    })}
                </p>
                <cel-button
                    class="action__button"
                    label=${this.localize({ en: 'Contact\u{a0}Me', ru: 'Связаться со\u{a0}мной' })}
                    @button-click=${() => (this.contactsModal = true)}
                ></cel-button>
            </section>

            <cel-modal ?open=${this.contactsModal} @open-changed=${(v: CustomEvent<boolean>) => (this.contactsModal = v.detail)}>
                <section class="contacts">
                    <h1 class="contacts__header">
                        ${this.localize({
                            en: 'Contact\u{a0}Me',
                            ru: 'Связаться со\u{a0}мной',
                        })}
                    </h1>

                    <p>
                        ${this.localize({
                            en: 'Feel\u{a0}free to\u{a0}contact\u{a0}me through one\u{a0}of\u{a0}these channels:',
                            ru: 'Вы\u{a0}можете связаться со\u{a0}мной любым удобным способом:',
                        })}
                    </p>

                    <ol class="contacts__list">
                        <li class="contacts__item">
                            <cel-svg
                                symbol="phone"
                                alt=${this.localize({
                                    en: 'Phone',
                                    ru: 'Телефон',
                                })}
                            ></cel-svg>
                            <strong>
                                ${this.localize({
                                    en: 'Phone',
                                    ru: 'Телефон',
                                })}:
                            </strong>
                            <span class="contacts__link">
                                <a href="tel:+79634307050" rel="author">+7 (963) 430-70-50</a>
                                <cel-tooltip simple class="contacts__tooltip">
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
                                                "I'm fine with people calling\u{a0}me on\u{a0}my\u{a0}personal cellphone but\u{a0}nevertheless I\u{a0}prefer " +
                                                'text-\u{2060}based conversations (Telegram or\u{a0}e-\u{2060}mail)',
                                            ru: 'На\u{a0}звонки я\u{a0}отвечаю, но\u{a0}больше все\u{a0}же предпочитаю сообщения (Telegram или\u{a0}e-\u{2060}mail).',
                                        })}
                                    </p>
                                </cel-tooltip>
                            </span>
                        </li>
                        <li class="contacts__item">
                            <cel-svg symbol="telegram" alt="Telegram"></cel-svg>
                            <strong>Telegram:</strong>
                            <a class="contacts__link" href="tg://resolve?domain=pootis_network" rel="author">pootis_network</a>
                        </li>
                        <li class="contacts__item">
                            <cel-svg
                                symbol="email"
                                alt=${this.localize({
                                    en: 'E-\u{2060}mail',
                                    ru: 'Почта',
                                })}
                            ></cel-svg>
                            <strong>
                                ${this.localize({
                                    en: 'E-\u{2060}mail',
                                    ru: 'Почта',
                                })}:
                            </strong>
                            <a class="contacts__link" href="mailto:admin@pootis.network" rel="author">admin@pootis.network</a>
                        </li>
                    </ol>

                    <cel-button
                        class="contacts__button"
                        label=${this.localize({
                            en: 'OK',
                            ru: 'Хорошо',
                        })}
                        @button-click=${() => (this.contactsModal = false)}
                    ></cel-button>
                </section>
            </cel-modal>
        `;
    }
}
