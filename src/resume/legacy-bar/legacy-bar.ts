import { html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import { CoreElement } from '../../core/element/element.ts';
import { LocalizableElement } from '../../i18n/localizable.ts';
import { type LanguageRecord } from '../../i18n/language.ts';

import '../../components/cel-button/cel-button.ts';
import '../../components/cel-svg/cel-svg.ts';
import '../../components/cel-tooltip/cel-tooltip.ts';

import styles from './legacy-bar.scss?inline';

@customElement('resume-legacy-bar')
export class ResumeLegacyBar extends LocalizableElement(CoreElement(styles)) {
    @property({ attribute: 'open', type: Boolean, reflect: true }) open = false;
    @state() private readonly unsupportedFeatures: (LanguageRecord<string> | string)[] = [];
    @state() private isLegacyBrowser = false;

    constructor() {
        super();
        this.checkBrowserFeatures();
    }

    // We have to explicitly require only a bunch of essential features.
    // The website should still work if a non-essential feature is missing, for example,
    // if transitioning on an `overlay` property is not supported by the browser.
    private checkBrowserFeatures() {
        // No oklch() means the entire color palette breaks.
        // We also intentionally do not provide a RGB fallback.
        if (!CSS.supports('color', 'oklch(1 0 0)')) {
            this.unsupportedFeatures.push({
                en: 'oklch() colors',
                ru: 'цвет в\u{a0}формате oklch()',
            });
        }

        // Still unsure if we can avoid relative color syntax. Chrome 131+.
        if (!CSS.supports('color', 'hsl(from white h s l)')) {
            this.unsupportedFeatures.push({
                en: 'relative color syntax',
                ru: 'синтаксис смешивания цветов',
            });
        }

        // Popover support is strictly required for modals and tooltips.
        // Additionally, treat the lack of Popover API as a legacy browser signal.
        if (!Object.hasOwn(HTMLElement.prototype, 'popover')) {
            this.unsupportedFeatures.push('Popover\u{a0}API');
            this.isLegacyBrowser = true;
        }

        this.open = this.unsupportedFeatures.length > 0;
    }

    override render() {
        if (!this.open) {
            return nothing;
        }

        return html`<div class="legacy-bar">
            <span>
                ${this.isLegacyBrowser
                    ? this.localize({
                          en: 'Your browser seems\u{a0}to\u{a0}be out-\u{2060}of-\u{2060}date.',
                          ru: 'Похоже,\u{a0}что ваш\u{a0}браузер устарел.',
                      })
                    : html`
                          ${this.localize({
                              en: "Your browser doesn't support",
                              ru: 'Ваш браузер поддерживает',
                          })}

                          <cel-tooltip simple underline class="legacy-bar__tooltip">
                              <span
                                  >${this.localize({
                                      en: 'some\u{a0}of\u{a0}the functionality',
                                      ru: 'не\u{a0}все функции',
                                  })}
                              </span>

                              <p slot="tooltip">
                                  ${this.localize({
                                      en: 'Unsupported features: ',
                                      ru: 'Неподдерживаемые функции: ',
                                  })}
                                  ${repeat(
                                      this.unsupportedFeatures,
                                      (e, i) =>
                                          html`<strong class="legacy-bar__feature">
                                              ${this.localize(e)}${i < this.unsupportedFeatures.length - 1 ? ',' : nothing}
                                          </strong>`
                                  )}
                              </p> </cel-tooltip
                          >${this.localize({
                              en: ' required by\u{a0}this\u{a0}website.',
                              ru: ', требуемые для\u{a0}работы сайта.',
                          })}
                      `}
                ${this.localize({
                    en: 'The\u{a0}resume might\u{a0}be displayed incorrectly.',
                    ru: 'Из-\u{2060}за этого резюме может отображаться некорректно.',
                })}
            </span>

            <cel-button
                passthru
                @button-click=${() => {
                    this.open = false;
                }}
            >
                <cel-svg
                    symbol="cross"
                    alt=${this.localize({
                        en: 'Close',
                        ru: 'Закрыть',
                    })}
                ></cel-svg>
            </cel-button>
        </div>`;
    }
}
