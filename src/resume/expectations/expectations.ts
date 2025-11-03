import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { LocalizableElement } from '../../i18n/localizable.ts';
import { CoreElement } from '../../core/element/element.ts';

import '../resume-section.ts';
import '../../components/cel-slider/cel-slider.ts';
import '../../components/cel-svg/cel-svg.ts';
import '../../components/cel-tooltip/cel-tooltip.ts';

import styles from './expectations.scss?inline';

@customElement('resume-expectations')
export class ResumeExpectations extends LocalizableElement(CoreElement(styles)) {
    @state() private weeklyHours = 40;

    private readonly expectedProfit = 250000; // That seems reasonable, right?

    private formatProfit(profitRUR: number) {
        const conversionRate = 1 / 80; // At least for the time being that would be good enough.

        // U+2009 is the Thin Space character.
        return this.localize({
            en: `$\u{2009}${Math.floor(profitRUR * conversionRate)}`,
            ru: `${Math.floor(profitRUR)}\u{a0}₽`,
        });
    }

    private calculateMonthlyProfit() {
        // I'm assuming this would be the place that gets the most attention...
        // If anything - after all, I'm no Business Extraordinaire -
        // as the saying goes, the more dollar, the merrier,
        // even if these numbers are not actually in dollars.

        const minBound = 50000;
        const maxWeeklyHours = 40;
        const hourlyRate = this.expectedProfit / maxWeeklyHours;

        const timeLossHourlyCompensation = 1500;
        const timeLossTotal = Math.max(maxWeeklyHours - this.weeklyHours, 0) * timeLossHourlyCompensation;

        // I should've probably majored in Finance.
        return Math.max(hourlyRate * this.weeklyHours + timeLossTotal, minBound);
    }

    override render() {
        return html`<resume-section
            compact
            .label=${this.localize({
                en: 'Workplace expectations',
                ru: 'Ожидания от\u{a0}работы',
            })}
        >
            <ol class="expectations">
                <li class="expectation">
                    <cel-svg
                        class="expectation__icon"
                        symbol="cash"
                        alt=${this.localize({
                            en: 'Salary (monthly)',
                            ru: 'Заработная плата',
                        })}
                    ></cel-svg>

                    <div class="expectation__value">
                        <strong>
                            ${this.localize({
                                en: 'Salary (monthly)',
                                ru: 'Заработная плата',
                            })}:
                        </strong>

                        <cel-tooltip simple underline>
                            ${this.localize({
                                en: `starting\u{a0}at ${this.formatProfit(this.expectedProfit)} (net)`,
                                ru: `от ${this.formatProfit(this.expectedProfit)} (на\u{a0}руки)`,
                            })}

                            <div class="profit-info" slot="tooltip">
                                <p>
                                    ${this.localize({
                                        en:
                                            'This\u{a0}is the\u{a0}minimum monthly salary that will\u{a0}be\u{a0}comfortable for\u{a0}me for\u{a0}a\u{a0}40-\u{2060}hours ' +
                                            'working week (8\u{a0}hours per\u{a0}day).',
                                        ru: 'Указана минимально комфортная\u{a0}ЗП при\u{a0}стандартной 40-\u{2060}часовой рабочей неделе (8\u{a0}часов в\u{a0}день).',
                                    })}
                                </p>

                                <p slot="tooltip">
                                    ${this.localize({
                                        en:
                                            'If\u{a0}your work conditions imply fewer weekly hours, you\u{a0}could approximate my\u{a0}comfortable monthly salary ' +
                                            'by\u{a0}using the\u{a0}slider below:',
                                        ru:
                                            'Если ваш\u{a0}проект или\u{a0}рабочий график подразумевает меньше часов в\u{a0}неделю, то\u{a0}можете посчитать, ' +
                                            'какая\u{a0}ЗП будет для\u{a0}меня комфортной:',
                                    })}
                                </p>

                                <div class="profit-info__calc">
                                    <strong class="profit-info__hours">
                                        ${this.localize({
                                            en: 'Hours',
                                            ru: 'Часы',
                                        })}
                                        ${`(${this.weeklyHours}):`}
                                    </strong>
                                    <cel-slider
                                        class="profit-info__slider"
                                        min="0"
                                        max="40"
                                        num-ticks="6"
                                        .value=${this.weeklyHours}
                                        @value-changed=${(v: CustomEvent<number>) => (this.weeklyHours = v.detail)}
                                    ></cel-slider>
                                    <strong>
                                        ${this.localize({
                                            en: 'Salary:',
                                            ru: 'ЗП:',
                                        })}
                                    </strong>

                                    <div class="profit-info__profit">
                                        <strong>${this.formatProfit(this.calculateMonthlyProfit())}</strong>
                                        <span>
                                            ${this.localize({
                                                en: '(net)',
                                                ru: 'на\u{a0}руки',
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </cel-tooltip>
                    </div>
                </li>

                <li class="expectation">
                    <cel-svg
                        class="expectation__icon"
                        symbol="home"
                        alt=${this.localize({
                            en: 'Work format',
                            ru: 'Формат работы',
                        })}
                    ></cel-svg>

                    <div class="expectation__value">
                        <strong>
                            ${this.localize({
                                en: 'Work format',
                                ru: 'Формат работы',
                            })}:
                        </strong>

                        <cel-tooltip simple underline>
                            ${this.localize({
                                en: 'remote',
                                ru: 'удаленно',
                            })}

                            <p slot="tooltip">
                                ${this.locale.render({
                                    en: html`<p>
                                        I&nbsp;am&nbsp;okay with an&nbsp;<em>occasional</em> office visit; however, the&nbsp;office
                                        must&nbsp;be&nbsp;located in&nbsp;Kirov city (Russia) or&nbsp;nearby environs.
                                    </p>`,
                                    ru: html`<p>
                                        В&nbsp;городе Кирове <em>иногда</em> (при&nbsp;необходимости) могу&nbsp;работать из&nbsp;офиса.
                                    </p>`,
                                })}
                            </p>
                        </cel-tooltip>
                    </div>
                </li>

                <li class="expectation">
                    <cel-svg
                        class="expectation__icon"
                        symbol="time"
                        alt=${this.localize({
                            en: 'Working hours',
                            ru: 'График работы',
                        })}
                    ></cel-svg>

                    <div class="expectation__value">
                        <strong>
                            ${this.localize({
                                en: 'Working hours',
                                ru: 'График работы',
                            })}:
                        </strong>

                        ${this.localize({
                            en: 'any',
                            ru: 'не\u{a0}имеет значения',
                        })}
                    </div>
                </li>

                <li class="expectation">
                    <cel-svg
                        class="expectation__icon"
                        symbol="work"
                        alt=${this.localize({
                            en: 'Contract format',
                            ru: 'Трудоустройство',
                        })}
                    ></cel-svg>

                    <div class="expectation__value">
                        <strong>
                            ${this.localize({
                                en: 'Contract format',
                                ru: 'Трудоустройство',
                            })}:
                        </strong>

                        <cel-tooltip simple underline>
                            ${this.localize({
                                en: 'any',
                                ru: 'любое',
                            })}

                            <p slot="tooltip">
                                ${this.localize({
                                    en:
                                        'The most preferable option for\u{a0}me is\u{a0}an\u{a0}employment contract in\u{a0}accordance to\u{a0}the\u{a0}Russian Labor Code, ' +
                                        "but I'm\u{a0}also\u{a0}OK with other employment formats.",
                                    ru: 'Для\u{a0}меня желательно все\u{a0}же заключение трудового договора согласно ТК\u{a0}РФ, но\u{a0}готов рассмотреть и\u{a0}другие варианты.',
                                })}
                            </p>
                        </cel-tooltip>
                    </div>
                </li>
            </ol>
        </resume-section>`;
    }
}
