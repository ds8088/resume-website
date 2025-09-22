import type { nothing, TemplateResult } from 'lit';
import { html } from 'lit';

import type { ResumeTitle } from '../../controllers/titles';
import type { LanguageRecord } from '../../i18n/language';
import type { Locale } from '../../i18n/locale';

export interface Achievement {
    title: ResumeTitle | Set<ResumeTitle>;
    text: LanguageRecord<string> | (() => string | TemplateResult);
    tags?: (string | LanguageRecord<string> | [string, LanguageRecord<string>] | (() => string | TemplateResult))[];
}

// We can't initialize a Map by passing a discriminated iterable inside a Map's constructor.
// I think there may be a way to work around it, but for now,
// we simply override the iterable type.
// A `satisfies` operator ensures that we correctly construct the iterable.
export const achievementTagTooltips = new Map<
    string,
    string | LanguageRecord<string> | ((locale: Locale) => string | TemplateResult | typeof nothing)
>([
    ['JS', 'JavaScript'],
    ['TS', 'TypeScript'],
    ['Go', 'Golang'],
    [
        'knex',
        (locale) =>
            html`${locale.translate({
                    en: 'SQL\u{a0}query builder for\u{a0}JavaScript: ',
                    ru: 'SQL\u{a0}query builder для\u{a0}JavaScript: ',
                })}<a href="https://knexjs.org" rel="noreferrer noopener nofollow external" target="_blank">https://knexjs.org</a>`,
    ],
    [
        'hapi',
        (locale) =>
            html`${locale.translate({
                    en: 'A\u{a0}JavaScript framework: ',
                    ru: 'JavaScript-\u{2060}фреймворк: ',
                })}<a href="https://hapi.dev" rel="noreferrer noopener nofollow external" target="_blank">https://hapi.dev</a>`,
    ],
    [
        'pug',
        (locale) =>
            html`${locale.translate({
                    en: 'A\u{a0}templating engine for\u{a0}JavaScript: ',
                    ru: 'Шаблонизатор для\u{a0}JavaScript: ',
                })}<a href="https://pugjs.org" rel="noreferrer noopener nofollow external" target="_blank">https://pugjs.org</a>`,
    ],
    [
        'joi',
        (locale) =>
            html`${locale.translate({
                    en: 'Data validation engine for\u{a0}JavaScript: ',
                    ru: 'Валидатор данных для\u{a0}JavaScript: ',
                })}<a href="https://joi.dev" rel="noreferrer noopener nofollow external" target="_blank">https://joi.dev</a>`,
    ],
    [
        'LXC',
        {
            en: "Low-\u{2060}level tooling for\u{a0}managing containers based\u{a0}on Linux kernel's cgroups and\u{a0}namespaces",
            ru: 'Низкоуровневая технология Linux-\u{2060}контейнеризации на\u{a0}основе cgroups и\u{a0}namespaces',
        },
    ],
    [
        // I wanted to see what would happen if I nest a bunch of tooltips together...
        'Soldering iron',
        (locale) =>
            html`${locale.render({
                en: html`Everyone knows what a
                    <cel-tooltip simple underline style="display: inline-block;">
                        <span>soldering iron</span>
                        <a
                            slot="tooltip"
                            href="https://en.wikipedia.org/wiki/Nowe_Ateny#Legacy"
                            rel="noreferrer noopener nofollow external"
                            target="_blank"
                        >
                            Koń jaki&nbsp;jest, każdy widzi.
                        </a>
                    </cel-tooltip>
                    is.`,
                ru: html`Все&nbsp;знают, что&nbsp;такое
                    <cel-tooltip simple underline style="display: inline-block;">
                        паяльник
                        <a
                            slot="tooltip"
                            href="https://en.wikipedia.org/wiki/Nowe_Ateny#Legacy"
                            rel="noreferrer noopener nofollow external"
                            target="_blank"
                        >
                            Koń jaki&nbsp;jest, każdy widzi.
                        </a> </cel-tooltip
                    >.`,
            })}`,
    ],
    [
        'IaC',
        {
            en: 'Infrastructure as\u{a0}Code',
            ru: 'Infrastructure as\u{a0}Code: инфраструктура в\u{a0}виде кода',
        },
    ],
    [
        'WinRM',
        {
            en: 'Windows Remote Management: a\u{a0}Windows-\u{2060}native remote management instrumentation, somewhat similar to\u{a0}SSH',
            ru: 'Windows Remote Management: встроенный в\u{a0}Windows механизм удаленного управления. Слегка напоминает SSH',
        },
    ],
    [
        'IKEv2',
        {
            en: 'A\u{a0}relatively modern key\u{a0}management protocol for\u{a0}IPsec',
            ru: 'Довольно современнный протокол управления ключами для\u{a0}IPsec',
        },
    ],
    [
        'VXLAN',
        {
            en: 'Virtual Extensible LAN: in\u{a0}a\u{a0}nutshell, VLAN with a\u{a0}sprinkle of\u{a0}MPLS/VPLS',
            ru: 'Virtual Extensible LAN: если вкратце, то\u{a0}VLAN в\u{a0}совмещении с\u{a0}MPLS/VPLS',
        },
    ],
    [
        'MTA-STS',
        {
            en:
                'An\u{a0}email security standard. Authenticates a\u{a0}mail server by\u{a0}delegating the\u{a0}authentication ' +
                'to\u{a0}both\u{a0}TLS and\u{a0}Web\u{a0}PKI.',
            ru:
                'Стандарт безопасности обмена почтовыми сообщениями. Использует\u{a0}TLS и\u{a0}Web\u{a0}PKI для\u{a0}аутентификации ' +
                'почтового сервера.',
        },
    ],
    [
        'BIMI',
        {
            en: 'Enables an\u{a0}DMARC-\u{2060}authenticated mail server to\u{a0}declare its\u{a0}preferred brand logo',
            ru: 'Позволяет почтовому серверу, аутентифицированному по\u{a0}DMARC, показывать лого своего бренда в\u{a0}списке почтовых сообщений',
        },
    ],
    [
        'PJSIP',
        {
            en: 'A\u{a0}modern SIP\u{a0}stack for\u{a0}Asterisk',
            ru: 'Современный SIP-\u{2060}стек для\u{a0}Asterisk',
        },
    ],
    [
        'SIPS',
        {
            en: 'SIP with TLS',
            ru: 'SIP, но\u{a0}с\u{a0}TLS',
        },
    ],
    [
        'SRTP',
        {
            en: 'RTP with an\u{a0}authentication, encryption and\u{a0}integrity layer',
            ru: 'RTP с\u{a0}уровнем шифрования, аутентификации и\u{a0}целостности',
        },
    ],
    [
        'CDR',
        {
            en:
                'Call Detail Records. In\u{a0}this\u{a0}context it\u{a0}means a\u{a0}service that\u{a0}handles aggregation ' +
                'of\u{a0}call information and\u{a0}call records',
            ru:
                'Call Detail Records. Здесь имеется в\u{a0}виду сервис, который обрабатывает ' +
                'и\u{a0}агрегирует как\u{a0}информацию о\u{a0}звонках, так\u{a0}и\u{a0}записи разговора.',
        },
    ],
    [
        'Restic',
        (locale) =>
            html`${locale.translate({
                    en: 'Simple and\u{a0}effective backup solution: ',
                    ru: 'Простое и\u{a0}эффективное решение для\u{a0}резервного копирования: ',
                })}<a href="https://restic.net" rel="noreferrer noopener nofollow external" target="_blank">https://restic.net</a>`,
    ],
    [
        'rest-server',

        {
            en: 'A\u{a0}backup server for\u{a0}Restic with write-\u{2060}only capabilities',
            ru: 'Сервер для\u{a0}хранения резервных копий Restic, с\u{a0}возможностью использования режима write-\u{2060}only',
        },
    ],
] satisfies [string, string | LanguageRecord<string> | ((locale: Locale) => string | TemplateResult)][] as [string, string][]);
