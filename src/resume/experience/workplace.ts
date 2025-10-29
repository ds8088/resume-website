import { html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { styleMap } from 'lit/directives/style-map.js';
import { Temporal } from 'temporal-polyfill';

import { CoreElement } from '../../core/element/element.ts';
import { LocalizableElement } from '../../i18n/localizable.ts';
import { isRelevantTitle, titleMeta, TitlesController } from '../../controllers/titles.ts';
import { type Achievement, achievementTagTooltips } from './achievement.ts';

import '../../components/cel-button/cel-button.ts';
import '../../components/cel-svg/cel-svg.ts';
import '../../components/cel-tooltip/cel-tooltip.ts';

import styles from './workplace.scss?inline';

@customElement('resume-workplace')
export class ResumeWorkplace extends LocalizableElement(CoreElement(styles)) {
    @property({ attribute: false }) jobTitle = '';
    @property({ attribute: false }) companyName?: string;
    @property({ attribute: false }) companyURL?: string;
    @property({ attribute: false }) subtitle?: string;
    @property({ attribute: false }) startDate?: Temporal.PlainYearMonth;
    @property({ attribute: false }) endDate?: Temporal.PlainYearMonth;
    @property({ type: Boolean }) nonCommercial = false;
    @property({ attribute: false }) achievements: Achievement[] = [];
    @property({ attribute: false }) indexes?: [number, number];

    @state() private relevantAchievementsShown = false;
    @state() private nonRelevantAchievementsShown = false;

    private readonly titlesConsumer = TitlesController.attachConsumer(this, () => {
        // Collapse disclosures if titles have been changed
        this.relevantAchievementsShown = false;
        this.nonRelevantAchievementsShown = false;
    });

    private readonly maxRelevantAchievements = 5;

    private getRawWorkDuration(): string | typeof nothing {
        if (!this.startDate) {
            return nothing;
        }

        // i18n must not be applied here - these strings are intended
        // to be used in the "time" HTML tag
        if (!this.endDate) {
            return this.startDate.toString({
                calendarName: 'never',
            });
        }

        const duration = this.endDate.since(this.startDate);
        return duration.toString({ roundingMode: 'trunc', smallestUnit: 'second' });
    }

    private getFormattedWorkDuration(): string | typeof nothing {
        if (!this.startDate) {
            return nothing;
        }

        let endDate: Temporal.ZonedDateTime | Temporal.PlainYearMonth | undefined = this.endDate;
        endDate ??= Temporal.Now.zonedDateTimeISO(this.locale.timezone).toPlainDate().withCalendar('gregory').toPlainYearMonth();

        const duration = endDate.since(this.startDate, {
            largestUnit: 'year',
            smallestUnit: 'month',
            roundingMode: 'ceil',
        });

        return this.locale.formatDurationLocalized(duration);
    }

    private renderWorkInterval() {
        if (!this.startDate) {
            return nothing;
        }

        const left = this.locale.formatDate(this.startDate, {
            month: 'long',
            calendar: 'gregory',
        });

        const right = this.endDate
            ? this.locale.formatDate(this.endDate, {
                  month: 'long',
                  calendar: 'gregory',
              })
            : this.localize({
                  en: 'Now',
                  ru: 'сейчас',
              });

        return html`
            <cel-tooltip simple underline>
                <span> ${left}&nbsp;— ${right} </span>

                <p slot="tooltip">
                    ${this.localize({
                        en: 'Duration',
                        ru: 'Продолжительность',
                    })}:
                    ${this.getFormattedWorkDuration()}
                </p>
            </cel-tooltip>
        `;
    }

    private renderAchievementText(ach: Achievement) {
        if (typeof ach.text === 'function') {
            return ach.text();
        }

        return html`<p class="achievement__text">${this.localize(ach.text)}</p>`;
    }

    private renderAchievementTag(tag: NonNullable<Achievement['tags']>[0]) {
        // This is a string tag, or a string ID with a LanguageRecord. Check if we have a tooltip for it
        if (typeof tag === 'string' || Array.isArray(tag)) {
            const id = typeof tag === 'string' ? tag : tag[0];
            const val = typeof tag === 'string' ? tag : this.localize(tag[1]);

            const tooltip = achievementTagTooltips.get(id);
            if (tooltip === undefined) {
                // No tooltip; render the string directly
                return html`<span class="achievement__tag">${val}</span>`;
            }

            return html`<cel-tooltip simple class="achievement__tooltip">
                <span class="achievement__tag">${val}</span>

                <p slot="tooltip">
                    ${typeof tooltip === 'string' ? tooltip : typeof tooltip === 'function' ? tooltip(this.locale) : this.localize(tooltip)}
                </p>
            </cel-tooltip>`;
        }

        if (typeof tag === 'function') {
            return html`<div class="achievement__tag">tag()</div>`;
        }

        // This is a LanguageRecord
        return html`<span class="achievement__tag">${this.localize(tag)}</span>`;
    }

    private renderAchievementTags(ach: Achievement) {
        const titleTags: (typeof titleMeta extends Map<unknown, infer T> ? T : never)[] = [];

        if (typeof ach.title === 'string') {
            const meta = titleMeta.get(ach.title);
            if (meta) {
                titleTags.push(meta);
            }
        } else {
            for (const title of ach.title) {
                const meta = titleMeta.get(title);
                if (meta) {
                    titleTags.push(meta);
                }
            }
        }

        return html`
            <ul class="achievement__tags">
                ${repeat(
                    titleTags,
                    (ttag) =>
                        html`<li>
                            <div
                                class="achievement__tag achievement__tag_title"
                                style=${styleMap({ '--tag-light-color': ttag.color.light, '--tag-dark-color': ttag.color.dark })}
                            >
                                ${this.localize(ttag.short ?? ttag.long)}
                            </div>
                        </li>`
                )}
                ${repeat(ach.tags ?? [], (tag) => html` <li>${this.renderAchievementTag(tag)}</li>`)}
            </ul>
        `;
    }

    private renderAchievement(ach: Achievement) {
        return html`<div class="achievement">${this.renderAchievementText(ach)} ${this.renderAchievementTags(ach)}</div>`;
    }

    private renderNonRelevantAchievements(hasAnyRelevant: boolean, nonRelevantAchievements: [Achievement, number][]) {
        if (nonRelevantAchievements.length === 0) {
            return nothing;
        }

        if (!this.nonRelevantAchievementsShown) {
            // The disclosure hasn't been opened. Show a disclosure element.

            const plur = this.locale.pluralize(nonRelevantAchievements.length, {
                en: ['achievements', 'achievements', 'achievements'],
                ru: ['достижение', 'достижения', 'достижений'],
            });

            return html`<li>
                <cel-button class="achievement__more" passthru @button-click=${() => (this.nonRelevantAchievementsShown = true)}>
                    <span>
                        ${!hasAnyRelevant
                            ? this.localize({
                                  en: `${nonRelevantAchievements.length}\u{a0}${plur} in\u{a0}other IT\u{a0}fields`,
                                  ru: `${nonRelevantAchievements.length}\u{a0}${plur} по\u{a0}другим сферам деятельности`,
                              })
                            : this.localize({
                                  en: `...\u{a0}and\u{a0}${nonRelevantAchievements.length}\u{a0}more ${plur} in\u{a0}other IT\u{a0}fields`,
                                  ru: `...\u{a0}и\u{a0}еще ${nonRelevantAchievements.length}\u{a0}${plur} по\u{a0}другим сферам деятельности`,
                              })}
                    </span>
                </cel-button>
            </li>`;
        }

        // Otherwise, iterate over all nonrelevant achievements
        return repeat(nonRelevantAchievements, ([ach]) => html`<li>${this.renderAchievement(ach)}</li>`);
    }

    // renderAchievementBlock works as a HTML generator for the achievement block.
    private *renderAchievementBlock() {
        const relevantAchievements: [Achievement, number][] = [];
        const nonRelevantAchievements: [Achievement, number][] = [];

        for (const ach of this.achievements) {
            let prio = 0;

            if (typeof ach.title === 'string') {
                const meta = titleMeta.get(ach.title);
                prio = meta?.priority ?? 0;
            } else {
                for (const title of ach.title.values()) {
                    const meta = titleMeta.get(title);
                    if (meta?.priority !== undefined && meta.priority > prio) {
                        prio = meta.priority;
                    }
                }
            }

            if (isRelevantTitle(this.titlesConsumer.val, ach.title)) {
                relevantAchievements.push([ach, prio]);
            } else {
                nonRelevantAchievements.push([ach, prio]);
            }
        }

        relevantAchievements.sort((a, b) => b[1] - a[1]);
        nonRelevantAchievements.sort((a, b) => b[1] - a[1]);

        if (relevantAchievements.length === 0) {
            // No relevant achievements.
            yield this.renderNonRelevantAchievements(false, nonRelevantAchievements);
        } else {
            // There are a bunch of relevant achievements.
            // If there are more than 5, AND if the disclosure haven't been triggered yet,
            // display the achievements with a disclosure (and ignore non-relevant ones).
            // Otherwise, display all relevant achievements,
            // with an optional disclosure.

            if (relevantAchievements.length > this.maxRelevantAchievements && !this.relevantAchievementsShown) {
                const remaining = relevantAchievements.length - this.maxRelevantAchievements + 1;

                for (const [ach] of relevantAchievements.slice(0, this.maxRelevantAchievements - 1)) {
                    yield html`<li>${this.renderAchievement(ach)}</li>`;
                }

                const plur = this.locale.pluralize(remaining, {
                    en: ['achievements', 'achievements', 'achievements'],
                    ru: ['достижение', 'достижения', 'достижений'],
                });

                yield html`<li>
                    <cel-button class="achievement__more" passthru @button-click=${() => (this.relevantAchievementsShown = true)}>
                        <span>
                            ${this.localize({
                                en: `...\u{a0}and\u{a0}${remaining}\u{a0}more ${plur}`,
                                ru: `...\u{a0}и\u{a0}еще ${remaining}\u{a0}${plur}`,
                            })}
                        </span>
                    </cel-button>
                </li>`;
            } else {
                // Show all achievements.
                for (const [ach] of relevantAchievements) {
                    yield html`<li>${this.renderAchievement(ach)}</li>`;
                }

                yield this.renderNonRelevantAchievements(true, nonRelevantAchievements);
            }
        }

        return nothing;
    }

    override render() {
        return html`
            <article class="workplace">
                <div class="workplace__upper">
                    <h1 class="workplace__title">${this.jobTitle}</h1>

                    ${this.indexes !== undefined
                        ? html`
                              <span class="workplace__indexes">
                                  ${this.localize({
                                      en: '#',
                                      ru: '№',
                                  })}
                                  ${this.indexes[0]}&nbsp;${this.localize({
                                      en: 'of',
                                      ru: 'из',
                                  })}&nbsp;${this.indexes[1]}
                              </span>
                          `
                        : nothing}
                </div>

                <div class="workplace__info">
                    <div class="workplace__options">
                        ${this.companyName !== undefined
                            ? html`
                                  <address class="workplace__company">
                                      <cel-svg
                                          symbol="building"
                                          alt=${this.localize({
                                              en: 'Company',
                                              ru: 'Компания',
                                          })}
                                      ></cel-svg>

                                      ${this.companyURL !== undefined
                                          ? html`
                                                <a
                                                    class="workplace__company-name"
                                                    target="_blank"
                                                    href=${this.companyURL}
                                                    rel="noreferrer noopener nofollow external"
                                                >
                                                    ${this.companyName}
                                                </a>
                                            `
                                          : html`<span class="workplace__company-name">${this.companyName}</span>`}
                                  </address>
                              `
                            : nothing}
                        ${this.startDate
                            ? html`
                                  <time class="workplace__time" datetime=${this.getRawWorkDuration()}>
                                      <cel-svg
                                          symbol="calendar"
                                          alt=${this.localize({
                                              en: 'Working dates',
                                              ru: 'Даты работы',
                                          })}
                                      ></cel-svg>
                                      ${this.renderWorkInterval()}
                                  </time>
                              `
                            : nothing}
                    </div>

                    ${this.subtitle ? html`<p class="workplace__subtitle">${this.subtitle}</p>` : nothing}
                </div>

                ${this.achievements.length > 0
                    ? html`<ol class="workplace__achievements">
                          ${[...this.renderAchievementBlock()]}
                      </ol>`
                    : nothing}
            </article>
        `;
    }
}
