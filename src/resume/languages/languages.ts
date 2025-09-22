import { html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { CoreElement } from '../../core/element/element.ts';
import { LocalizableElement } from '../../i18n/localizable.ts';
import { CoreEvent } from '../../core/events.ts';

import '../resume-section.ts';
import '../../components/cel-tooltip/cel-tooltip.ts';

import styles from './languages.scss?inline';

@customElement('resume-languages')
export class ResumeLanguages extends LocalizableElement(CoreElement(styles)) {
    @state() afterSwitchShown = false;

    override render() {
        return html`<resume-section
            compact
            .label=${this.localize({
                en: 'Language proficiency',
                ru: 'Знание языков',
            })}
        >
            <ol class="languages">
                <li class="language">
                    <span>
                        <strong>
                            ${this.localize({
                                en: 'Russian',
                                ru: 'Русский',
                            })}:
                        </strong>
                        ${this.localize({
                            en: 'Native',
                            ru: 'Родной',
                        })}
                    </span>
                </li>
                <li class="language">
                    <span>
                        <strong>
                            ${this.localize({
                                en: 'English',
                                ru: 'Английский',
                            })}:
                        </strong>
                        <cel-tooltip simple underline @tooltip-hide=${() => (this.afterSwitchShown = false)}>
                            ${this.localize({
                                en: 'C2 (Proficiency)',
                                ru: 'C2 (В\u{a0}совершенстве)',
                            })}

                            <div class="language__tooltip" slot="tooltip">
                                <p>
                                    ${this.localize({
                                        en: 'Near-\u{2060}native English fluency: able to\u{a0}converse in\u{a0}English with minimal effort and\u{a0}in\u{a0}any\u{a0}context.',
                                        ru:
                                            'Свободно владею английским языком: читаю документацию в\u{a0}оригинале, без\u{a0}проблем общаюсь на\u{a0}любые темы, ' +
                                            'ясно и\u{a0}грамотно излагаю речь.',
                                    })}
                                </p>

                                ${this.locale.preferredLanguage !== 'en'
                                    ? this.locale.render({
                                          en: nothing,
                                          ru: html`<p>
                                              Вы&nbsp;можете
                                              <a
                                                  href="/?lang=en"
                                                  hreflang="en"
                                                  rel="alternate"
                                                  @click=${(e: Event) => {
                                                      e.preventDefault();
                                                      this.dispatchEvent(new CoreEvent('language-changed', 'en'));
                                                      this.afterSwitchShown = true;
                                                  }}
                                              >
                                                  переключить сайт
                                              </a>
                                              на&nbsp;английский язык, чтобы&nbsp;проверить мои&nbsp;навыки.
                                          </p>`,
                                      })
                                    : nothing}
                                ${this.afterSwitchShown && this.locale.preferredLanguage === 'en'
                                    ? html`<p>You&nbsp;have switched the&nbsp;website language to&nbsp;English.</p>`
                                    : nothing}
                            </div>
                        </cel-tooltip>
                    </span>
                </li>
            </ol>
        </resume-section>`;
    }
}
