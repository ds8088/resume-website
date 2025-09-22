import { html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import { CoreElement } from '../../core/element/element.ts';
import { LocalizableElement } from '../../i18n/localizable.ts';

import '../../components/cel-svg/cel-svg.ts';
import '../../components/cel-tooltip/cel-tooltip.ts';

import styles from './footer.scss?inline';

@customElement('resume-footer')
export class ResumeFooter extends LocalizableElement(CoreElement(styles)) {
    private readonly stack: [string, string][] = [
        ['https://lit.dev', 'Lit'],
        ['https://sass-lang.com', 'Sass'],
        ['https://typescriptlang.org', 'TypeScript'],
        ['https://vite.dev', 'Vite'],
    ];

    override render() {
        return html`
            <footer class="footer">
                <cel-tooltip class="footer__tooltip-parent" simple underline>
                    <span class="footer__left">
                        <cel-svg
                            symbol="nature"
                            alt=${this.localize({
                                en: '100% natural',
                                ru: '100% натуральный продукт',
                            })}
                        ></cel-svg>

                        ${this.localize({
                            en: '100%\u{a0}natural: LLM- and\u{a0}AI-\u{2060}free',
                            ru: '100%\u{a0}натуральный продукт, без\u{a0}LLM и\u{a0}AI',
                        })}
                    </span>

                    <div class="footer__tooltip" slot="tooltip">
                        <p>
                            ${this.localize({
                                en: 'No LLMs were\u{a0}used in\u{a0}making this\u{a0}website.',
                                ru: 'Этот\u{a0}сайт разработан полностью без\u{a0}применения LLM.',
                            })}
                        </p>
                    </div>
                </cel-tooltip>

                <a
                    class="footer__middle"
                    href="https://github.com/ds8088/resume-website"
                    rel="noreferrer noopener external"
                    target="_blank"
                >
                    <cel-svg symbol="github" alt="GitHub" size="20"></cel-svg>
                    ${this.localize({
                        en: 'Website repository',
                        ru: 'Репозиторий сайта',
                    })}
                </a>

                <span class="footer__right">
                    ${this.localize({
                        en: 'Tech stack',
                        ru: 'Стек сайта',
                    })}:
                    ${repeat(
                        this.stack,
                        (st, idx) => html`
                            <strong>
                                <a class="footer__url" href=${st[0]} rel="noreferrer noopener nofollow external" target="_blank"
                                    >${st[1]}</a
                                ></strong
                            >${idx !== this.stack.length - 1 ? ',' : nothing}
                        `
                    )}
                </span>
            </footer>
        `;
    }
}
