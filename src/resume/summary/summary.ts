import { html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import { CoreElement } from '../../core/element/element.ts';
import type { ResumeTitle} from '../../controllers/titles.ts';
import { splitByTitleRelevancy, TitlesController } from '../../controllers/titles.ts';
import { LocalizableElement } from '../../i18n/localizable.ts';
import type { LanguageRecord } from '../../i18n/language.ts';

import '../resume-section.ts';
import '../../components/cel-button/cel-button.ts';
import '../../components/cel-svg/cel-svg.ts';

import styles from './summary.scss?inline';

interface Skill {
    title: ResumeTitle | Set<ResumeTitle>;
    text: string | LanguageRecord<string>;
    symbol?: string;
}

@customElement('resume-summary')
export class ResumeSummary extends LocalizableElement(CoreElement(styles)) {
    @state() nonRelevantSkillsShown = false;

    private readonly titlesConsumer = TitlesController.attachConsumer(this, () => {
        this.nonRelevantSkillsShown = false;
    });

    private readonly allSkills: Skill[] = [
        {
            title: new Set(['devops', 'sysadmin']),
            text: 'Windows',
            symbol: 'windows',
        },
        {
            title: new Set(['devops', 'sysadmin', 'fullstack']),
            text: 'Linux',
            symbol: 'linux',
        },
        {
            title: 'backend',
            text: 'Golang\u{a0}(Go)',
            symbol: 'golang',
        },
        {
            title: 'fullstack',
            text: 'TypeScript\u{a0}(TS)',
            symbol: 'typescript',
        },
        {
            title: 'fullstack',
            text: 'JavaScript\u{a0}(JS)',
            symbol: 'javascript',
        },
        {
            title: 'backend',
            text: 'Zig',
            symbol: 'zig',
        },
        {
            title: 'frontend',
            text: 'Vue',
            symbol: 'vue',
        },
        {
            title: 'frontend',
            text: 'Lit',
            symbol: 'lit',
        },
        {
            title: new Set(['backend', 'devops', 'sysadmin']),
            text: 'SQL',
            symbol: 'sql',
        },
        {
            title: new Set(['devops', 'sysadmin']),
            text: 'Ansible',
            symbol: 'ansible',
        },
        {
            title: 'devops',
            text: 'Kubernetes\u{a0}(k8s)',
            symbol: 'k8s',
        },
    ];

    private renderSkill(skill: Skill, comma: boolean) {
        return html`
            <span class="skill__inner">
                ${skill.symbol
                    ? html`
                          <cel-svg
                              class="skill__icon"
                              symbol=${skill.symbol}
                              alt=${typeof skill.text === 'string' ? skill.text : this.localize(skill.text)}
                          ></cel-svg>
                      `
                    : nothing}

                <span class="skill__text"
                    >${typeof skill.text === 'string' ? skill.text : this.localize(skill.text)}${comma ? ',' : nothing}</span
                ></span
            >
        `;
    }

    private renderSkills() {
        const { relevant, nonRelevant } = splitByTitleRelevancy(this.allSkills, this.titlesConsumer.val, (skill) => skill.title);
        if (relevant.length === 0 && nonRelevant.length === 0) {
            return nothing;
        }

        const displayedSkills = [...relevant, ...(this.nonRelevantSkillsShown ? nonRelevant : [])];

        return html` <div>
            <strong class="skills__title">
                ${this.localize({
                    en: 'Skills: ',
                    ru: 'Навыки: ',
                })}
            </strong>

            <ul class="skills">
                ${repeat(
                    displayedSkills,
                    (skill, index) => html`<li class="skill">${this.renderSkill(skill, index < displayedSkills.length - 1)}</li>`
                )}
                ${!this.nonRelevantSkillsShown && nonRelevant.length > 0
                    ? html`
                          <li class="skill skill_last">
                              <cel-button class="skill__more" passthru @button-click=${() => (this.nonRelevantSkillsShown = true)}>
                                  <span class="skill__inner skill__inner_link">
                                      ${this.localize({
                                          en: 'and\u{a0}many others.',
                                          ru: 'и\u{a0}другие технологии.',
                                      })}
                                  </span>
                              </cel-button>
                          </li>
                      `
                    : html`
                          <li class="skill skill_last">
                              <span class="skill__inner">
                                  ${this.localize({
                                      en: 'and\u{a0}many others.',
                                      ru: 'и\u{a0}другие технологии.',
                                  })}
                              </span>
                          </li>
                      `}
            </ul>
        </div>`;
    }

    override render() {
        return html`<resume-section
            compact
            .label=${this.localize({
                en: 'At\u{a0}a\u{a0}glance',
                ru: 'Вкратце',
            })}
        >
            <p>
                ${this.localize({
                    en:
                        'An\u{a0}IT\u{a0}professional with a\u{a0}large field of\u{a0}expertise. Jack-\u{2060}of-\u{2060}all-\u{2060}trades ' +
                        '(and a\u{a0}master of\u{a0}at\u{a0}least some). 15\u{a0}years of\u{a0}experience. ' +
                        'Developed more\u{a0}than 50\u{a0}commercial projects across the\u{a0}last 5\u{a0}years. ' +
                        'Modern, cutting-\u{2060}edge tech stack and\u{a0}first-\u{2060}class security approach.',
                    ru:
                        'Универсальный IT-\u{2060}специалист с\u{a0}15-\u{2060}летним непрерывным опытом работы. ' +
                        'За последние\u{a0}5\u{a0}лет реализовал более\u{a0}50 коммерческих проектов. ' +
                        'Современный технологический стек и\u{a0}безопасность на\u{a0}первом месте.',
                })}
            </p>

            ${this.renderSkills()}

            <p>
                ${this.localize({
                    en: 'Currently looking for\u{a0}work, preferably a\u{a0}full-\u{2060}time position.',
                    ru: 'На\u{a0}данный момент нахожусь в\u{a0}активном поиске работы.',
                })}
            </p>
            <p>
                ${this.localize({
                    en:
                        'Seeking for\u{a0}a\u{a0}role that aligns\u{a0}well with my\u{a0}skills and\u{a0}offers opportunities ' +
                        'to\u{a0}enhance\u{a0}them even\u{a0}more.',
                    ru: 'Ищу такую работу, где\u{a0}можно было\u{a0}бы успешно применить и\u{a0}усилить мои\u{a0}знания.',
                })}
            </p>
        </resume-section>`;
    }
}
