import type { PropertyValues } from 'lit';
import { html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { CoreElement } from '../../core/element/element';

import styles from './cel-code.scss?inline';

export type SchemaSpec = '\n' | [string, number, number];

export const generalizedMap = new Map<string, [string, string]>([
    ['_', ['#333', '#fff']],
    ['s', ['#00f', '#00f']],
    ['i', ['#0f0', '#00f']],
]);

@customElement('cel-code')
export class CelCode extends CoreElement(styles) {
    @property({ attribute: false }) code = '';
    @property({ attribute: false }) schema: SchemaSpec[] = [];
    @property({ type: Boolean }) language = false;
    @property({ attribute: false }) colorMap: Map<string, [string, string]> = generalizedMap;

    @state() private compiledCode: string[] = [];
    @state() private compiledNodes: (HTMLSpanElement | Text)[] = [];

    private compileCode() {
        this.compiledCode = [];

        let initialSpaces = -1;
        let spaceStr = '';

        const splitted = this.code.split('\n');

        for (let line of splitted) {
            if (initialSpaces === -1) {
                const sp = line.length - line.trimStart().length;
                if (sp < line.length) {
                    initialSpaces = sp;
                    spaceStr = ' '.repeat(sp);
                }
            }

            if (initialSpaces >= 0) {
                if (line.startsWith(spaceStr)) {
                    // Fast path: simply cut off the expected prefix
                    line = line.slice(initialSpaces);
                } else {
                    // Slow path: the prefix is smaller than expected
                    const spacesToRemove = Math.min(line.length - line.trimStart().length, initialSpaces);
                    line = line.slice(spacesToRemove);
                }

                this.compiledCode.push(line);
            }
        }
    }

    private getIdentColor(ident: string): [string, string] {
        const colors = this.colorMap.get(ident);
        if (colors === undefined) {
            console.warn(`schema does not support code block ident: ${ident}`);
            return ['var(--color-text)', 'var(--color-text)'];
        }

        return colors;
    }

    private compileSchema() {
        this.compiledNodes = [];

        let ci = 0;
        let lpos = 0;
        for (let i = 0; i < this.schema.length && ci < this.compiledCode.length; i++) {
            const spec = this.schema[i];

            // '\n' should navigate to the next code line.
            if (spec === '\n') {
                this.compiledNodes.push(new Text(this.compiledCode[ci].slice(lpos)));
                this.compiledNodes.push(document.createElement('br'));

                ci++;
                lpos = 0;
                continue;
            }

            const colors = this.getIdentColor(spec[0]);
            const start = spec[1];
            const count = spec[2];

            if (start < lpos) {
                // Starting position went backwards; assume an implicit newline.
                this.compiledNodes.push(new Text(this.compiledCode[ci].slice(lpos)));
                this.compiledNodes.push(document.createElement('br'));
                ci++;
                lpos = 0;

                if (ci >= this.compiledCode.length) {
                    break;
                }
            }

            // Do we have any code before the starting spec?
            if (lpos < start) {
                this.compiledNodes.push(new Text(this.compiledCode[ci].slice(lpos, start)));
            }

            // This is an ident; add it as a HTMLSpanElement.
            const ident = document.createElement('span');
            ident.style.setProperty('--ident-color-light', colors[0]);
            ident.style.setProperty('--ident-color-dark', colors[1]);
            ident.appendChild(new Text(this.compiledCode[ci].slice(start, start + count)));
            this.compiledNodes.push(ident);
            lpos = start + count;
        }

        // Add remaining text nodes
        for (let i = ci; i < this.compiledCode.length; i++) {
            this.compiledNodes.push(new Text(this.compiledCode[i].slice(lpos)));

            if (i < this.compiledCode.length - 1) {
                this.compiledNodes.push(document.createElement('br'));
            }

            lpos = 0;
        }
    }

    protected override willUpdate(changedProperties: PropertyValues): void {
        if (changedProperties.has('code')) {
            // Schema depends on code, so recompile both
            this.compileCode();
            this.compileSchema();
            return;
        }

        if (changedProperties.has('schema') || changedProperties.has('colorMap')) {
            this.compileSchema();
        }
    }

    override render() {
        return html`
            <div class="code">
                ${this.language
                    ? html`<div class="code__language">
                          <slot name="language"></slot>
                      </div>`
                    : nothing}

                <pre class="code__block"><code class="code__inner">${this.compiledNodes}</code></pre>
            </div>
        `;
    }
}
