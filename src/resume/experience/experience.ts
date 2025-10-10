import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { Temporal } from 'temporal-polyfill';

import { CoreElement } from '../../core/element/element.ts';
import type { LanguageRecord } from '../../i18n/language.ts';
import { LocalizableElement } from '../../i18n/localizable.ts';
import type { Achievement } from './achievement.ts';

import '../resume-section.ts';
import './workplace.ts';
import '../../components/cel-lazyload/cel-lazyload.ts';
import '../../components/cel-modal/cel-modal.ts';

import styles from './experience.scss?inline';

@customElement('resume-experience')
export class ResumeExperience extends LocalizableElement(CoreElement(styles)) {
    @state() private monroeShopModal = false;

    private readonly experience: {
        companyName?: string | LanguageRecord<string>;
        companyURL?: string;
        jobTitle: string | LanguageRecord<string>;
        startDate: Temporal.PlainYearMonth;
        endDate?: Temporal.PlainYearMonth;
        subtitle?: string | LanguageRecord<string>;
        achievements: Achievement[];
    }[] = [
        {
            companyName: 'FamilyTeam',
            companyURL: 'https://familyteam.top',
            jobTitle: {
                // Should've probably used "Head of IT" as per the actual job title,
                // however this could be interpreted as a wrong signal to the recruiters...
                // To avoid this, elide the true job title.
                en: 'Fullstack Developer\u{a0}/ DevOps',
                ru: 'Fullstack-разработчик\u{a0}/ DevOps',
            },
            subtitle: {
                en: 'Clean slate with\u{a0}the\u{a0}freedom to\u{a0}do almost anything; using\u{a0}IT as\u{a0}a\u{a0}company growth multiplier.',
                ru: 'Инфраструктура и\u{a0}проекты с\u{a0}чистого листа; применение\u{a0}IT в качестве катализатора роста компании.',
            },
            startDate: new Temporal.PlainYearMonth(2023, 4, 'gregory'),
            endDate: new Temporal.PlainYearMonth(2025, 10, 'gregory'),
            achievements: [
                {
                    title: new Set(['backend', 'sysadmin', 'devops']),
                    text: {
                        en:
                            'Built a\u{a0}modern IT\u{a0}infrastructure from\u{a0}scratch for\u{a0}a\u{a0}media arbitration team. 45\u{a0}web servers, approx. ' +
                            '4000\u{a0}websites, bare-\u{2060}metal hypervisors, Proxmox clusters, more\u{a0}than 60\u{a0}Windows Server\u{a0}VMs ' +
                            'and\u{a0}2\u{a0}instances of\u{a0}Keitaro\u{a0}TDS.',
                        ru:
                            'С\u{a0}нуля построил современную IT-\u{2060}инфраструктуру для\u{a0}арбитражной команды: 45\u{a0}веб-\u{2060}серверов и\u{a0}около ' +
                            '4000\u{a0}веб-\u{2060}сайтов, bare-\u{2060}metal гипервизоры, ' +
                            'Proxmox-\u{2060}кластеры, более\u{a0}60\u{a0}ВМ с\u{a0}Windows Server и\u{a0}2\u{a0}трекера Keitaro.',
                    },
                    tags: ['Windows', 'Linux', 'LXC', 'Proxmox', 'Keitaro'],
                },
                {
                    title: 'fullstack',
                    text: {
                        en:
                            "Created more\u{a0}than\u{a0}50 projects, most\u{a0}of\u{a0}which have\u{a0}been integrated with\u{a0}the company's IT\u{a0}infrastructure: " +
                            'various services (incl.\u{a0}traffic arbitration), utilities, CLIs, websites and\u{a0}bots.',
                        ru:
                            'Реализовал более\u{a0}50 проектов и\u{a0}интегрировал\u{a0}их с\u{a0}инфраструктурой: ' +
                            'арбитражные сервисы, службы, утилиты, веб-\u{2060}сайты и\u{a0}боты.',
                    },
                    tags: ['Go', 'TypeScript'],
                },
                {
                    title: new Set(['fullstack', 'devops']),
                    text: {
                        en: 'Developed an\u{a0}internal CRM\u{a0}system that\u{a0}handled various company tasks. 70k+\u{a0}LoC, Protobuf, Go, Lit, TS.',
                        ru: 'Разработал с\u{a0}нуля внутреннюю многофункциональную CRM-\u{2060}систему. 70k+\u{a0}LoC, Protobuf, Go, Lit, TS.',
                    },
                    tags: ['Go', 'PostgreSQL', 'Connect RPC', 'Protobuf', 'Lit', 'TS', 'Sass', 'Vite', 'Temporal'],
                },
                {
                    title: 'backend',
                    text: {
                        en:
                            'Implemented several private modules for\u{a0}Caddy (a\u{a0}web\u{a0}server written\u{a0}in Golang): ' +
                            'Keitaro integration, reverse CloudFlare tunnel, traffic cloaking and\u{a0}more.',
                        ru:
                            'Написал несколько модулей для\u{a0}веб-\u{2060}сервера Caddy (Golang): интеграция с\u{a0}трекером Keitaro, ' +
                            'подключение обратного туннеля CloudFlare, клоакинг и\u{a0}другие функции.',
                    },
                    tags: ['Go', 'Caddy', 'CloudFlare', 'Keitaro'],
                },
                {
                    title: 'backend',
                    text: {
                        en:
                            'Created a\u{a0}website scraper for\u{a0}arbitrarily complex sites: it\u{a0}copies the\u{a0}website verbatim, minifies\u{a0}it ' +
                            "and\u{a0}makes various changes to\u{a0}further diverge the\u{a0}copy's fingerprint from the\u{a0}original website.",
                        ru: 'Создал утилиту комплексного выкачивания сайтов, которая копирует чужие сайты, минифицирует и\u{a0}делает их\u{a0}уникальными.',
                    },
                    tags: ['TS', 'Deno', 'Puppeteer', 'PostCSS', 'Sharp'],
                },
                {
                    title: 'backend',
                    text: {
                        en:
                            'Developed a\u{a0}service which automatically clicks on\u{a0}advertisements in\u{a0}Google Search output ' +
                            '(also\u{a0}known\u{a0}as "click-\u{2060}fraud").',
                        ru: 'Разработал сервис для\u{a0}автоматического перехода по\u{a0}рекламной выдаче Google\u{a0}Ads ("скликивание").',
                    },
                    tags: ['Go'],
                },
                {
                    title: new Set(['sysadmin', 'devops']),
                    text: {
                        en:
                            'Implemented a\u{a0}company-\u{2060}wide VPN that\u{a0}routes traffic through the\u{a0}pool of\u{a0}available web servers. ' +
                            'IPv4+IPv6, IKEv2, a\u{a0}custom nfqueue daemon and\u{a0}a\u{a0}somewhat non-\u{2060}trivial nftables configuration.',
                        ru:
                            'Создал корпоративную\u{a0}VPN с\u{a0}возможностью маршрутизации трафика через IP-\u{2060}адреса веб-\u{2060}серверов. ' +
                            'IPv4+IPv6, IKEv2, кастомный сервис с\u{a0}интеграцией в\u{a0}nfqueue и\u{a0}достаточно сложная конфигурация nftables.',
                    },
                    tags: ['VPN', 'IPsec', 'IKEv2', 'StrongSwan', 'WireGuard', 'nftables'],
                },
                {
                    title: 'backend',
                    text: {
                        en:
                            'Built a\u{a0}Linux netfilter (nfqueue) Go\u{a0}daemon, which marks incoming connections according to\u{a0}the\u{a0}IKEv2 tunnel IP\u{a0}address. ' +
                            "Used as\u{a0}part of\u{a0}the\u{a0}routing engine inside the\u{a0}company's VPN.",
                        ru:
                            'Реализовал Linux-\u{2060}демон для netfilter (nfqueue) на\u{a0}Go, который позволяет маркировать входящие соединения в\u{a0}соответствии ' +
                            'с\u{a0}внутренним IP-\u{2060}адресом IKEv2-\u{2060}туннеля. Используется для\u{a0}маршрутизации трафика в\u{a0}корпоративной\u{a0}VPN.',
                    },
                    tags: ['Go', 'Netfilter', 'nftables', 'VPN'],
                },
                {
                    title: 'frontend',
                    text: {
                        en:
                            'Created the\u{a0}frontend for a\u{a0}website which\u{a0}was\u{a0}used as\u{a0}a\u{a0}"personal area portal". Vue\u{a0}3, Composition\u{a0}API, ' +
                            'TypeScript.',
                        ru: 'Разработал фронтэнд личного кабинета на\u{a0}Vue\u{a0}3 (Composition\u{a0}API) и\u{a0}TypeScript.',
                    },
                    tags: ['Vue', 'TS', 'REST', 'Quasar', 'Pinia', 'Axios'],
                },
                {
                    title: 'backend',
                    text: {
                        en:
                            'Created an\u{a0}automatic generator for\u{a0}creating unique iGaming websites with\u{a0}multiple pages. ' +
                            'This\u{a0}allowed to\u{a0}completely eliminate the\u{a0}costs for\u{a0}manual website development.',
                        ru:
                            'Создал генератор уникальных многостраничных iGaming-\u{2060}сайтов. ' +
                            'Генератор позволил полностью исключить расходы на\u{a0}ручную верстку.',
                    },
                    tags: ['Go', 'Templ', 'HTML', 'Sass', 'TS'],
                },
                {
                    title: 'backend',
                    text: {
                        en:
                            'Built a\u{a0}file server from scratch (Windows/Linux), designed for\u{a0}high-\u{2060}load and\u{a0}carefully tailored ' +
                            'for\u{a0}the\u{a0}ease of\u{a0}use.',
                        ru:
                            'С\u{a0}нуля разработал файловый сервер (Windows/Linux) и\u{a0}фронтэнд для\u{a0}него с\u{a0}расчетом на\u{a0}высокую нагрузку ' +
                            'и\u{a0}максимальное удобство использования.',
                    },
                    tags: ['Go', 'HTML', 'Sass', 'TS'],
                },
                {
                    title: 'backend',
                    text: {
                        en:
                            'Developed a\u{a0}CLI\u{a0}tool that\u{a0}auctions domain names. It\u{a0}allowed to\u{a0}save more\u{a0}than\u{a0}$5000 ' +
                            'on\u{a0}auctioning used domains.',
                        ru:
                            'Создал CLI-\u{2060}утилиту для\u{a0}выставления доменных имен на\u{a0}аукцион. Утилита позволила суммарно сэкономить ' +
                            'более\u{a0}$5000 на\u{a0}выручке с\u{a0}продаж.',
                    },
                    tags: ['TS', 'Deno', 'Puppeteer', 'Deno KV'],
                },
                {
                    title: 'frontend',
                    text: () =>
                        html`<span>
                            ${this.localize({
                                en: 'Created the\u{a0}frontend for a',
                                ru: 'Разработал фронтэнд для',
                            })}
                            <a href="https://skillhunter.ai" rel="noreferrer noopener nofollow external" target="_blank"
                                >${this.localize({
                                    en: 'predictive candidate analysis system',
                                    ru: 'системы аналитики кандидатов',
                                })}</a
                            >.
                        </span>`,
                    tags: ['Lit', 'Sass', 'TS', 'Vite', 'REST', 'Temporal'],
                },
                {
                    title: 'frontend',
                    text: {
                        en: 'Created multiple iGaming landings and\u{a0}other trivial websites; refactored third-\u{2060}party landing pages.',
                        ru: 'Выполнял верстку лендингов и\u{a0}одностраничных сайтов; осуществлял рефакторинг чужих лендингов.',
                    },
                    tags: ['HTML', 'CSS', 'JS', 'TS'],
                },
                {
                    title: new Set(['sysadmin', 'devops']),
                    text: () => html` ${this.localize({
                            en:
                                'Used\u{a0}IaC as\u{a0}often as\u{a0}possible: every service gets\u{a0}deployed from\u{a0}scratch, automatically, ' +
                                'using Ansible, with\u{a0}full idempotency.',
                            ru:
                                'Повсеместно применял принципы\u{a0}IaC: все\u{a0}сервисы развертываются и\u{a0}обновляются через\u{a0}Ansible ' +
                                'с\u{a0}соблюдением идемпотентности.',
                        })}<br />
                        ${this.localize({
                            en: 'Created more\u{a0}than\u{a0}100 self-\u{2060}made Ansible roles.',
                            ru: 'Создал более\u{a0}100 самописных Ansible-\u{2060}ролей.',
                        })}`,
                    tags: ['Ansible', 'IaC'],
                },
                {
                    title: 'sysadmin',
                    text: {
                        en:
                            'Maintained several Keitaro\u{a0}TDS instances, created a\u{a0}custom Ansible\u{a0}role for\u{a0}deploying Keitaro\u{a0}TDS. ' +
                            "Reverse-\u{2060}engineered Keitaro's obfuscated code.",
                        ru:
                            'Администрировал трекеры Keitaro, написал Ansible-\u{2060}роль для\u{a0}развертывания Keitaro с\u{a0}нуля. ' +
                            'Выполнял реверс-\u{2060}инжиниринг Keitaro.',
                    },
                    tags: ['Keitaro', 'Ansible', 'PHP'],
                },
            ],
        },
        {
            companyName: {
                en: "HORS' Coffee House",
                ru: 'Кофейный\u{a0}дом ХОРСЪ',
            },
            companyURL: 'https://hors.ru',
            jobTitle: {
                en: 'System Administrator',
                ru: 'Системный администратор',
            },
            subtitle: {
                en: 'A\u{a0}tech stack that\u{a0}is\u{a0}both cutting-\u{2060}edge and\u{a0}reliable; also, tasty coffee.',
                ru: 'Современный, качественный стек технологий; а\u{a0}еще\u{a0}вкусный кофе.',
            },
            startDate: new Temporal.PlainYearMonth(2022, 12, 'gregory'),
            endDate: new Temporal.PlainYearMonth(2023, 3, 'gregory'),
            achievements: [
                {
                    title: new Set(['sysadmin', 'devops']),
                    text: {
                        en: 'Performed various project-\u{2060}like IT\u{a0}tasks, upgraded legacy infrastructure, automated deployment of\u{a0}FOSS\u{a0}solutions.',
                        ru: 'Выполнял проектные задачи по\u{a0}IT, занимался апгрейдом legacy-\u{2060}инфраструктуры, автоматизировал развертывание FOSS-\u{2060}решений.',
                    },
                    tags: ['FOSS', 'Linux', 'Ansible', 'Docker'],
                },
                {
                    title: 'sysadmin',
                    text: {
                        en:
                            'Refactored networking infrastructure: created a\u{a0}brand\u{a0}new configuration for\u{a0}Juniper and\u{a0}MikroTik devices, ' +
                            'implemented traffic balancing and\u{a0}multi-\u{2060}WAN solutions.',
                        ru:
                            'Проводил рефакторинг сетевой инфраструктуры: актуализация конфига для\u{a0}устройств Juniper и\u{a0}MikroTik, ' +
                            'настройка балансировки и\u{a0}multi-\u{2060}WAN.',
                    },
                    tags: ['Juniper', 'Mikrotik', 'VyOS'],
                },
                {
                    title: 'sysadmin',
                    text: {
                        en:
                            'Migrated employees from\u{a0}GitLab to\u{a0}an\u{a0}instance of\u{a0}self-\u{2060}hosted Gitea; created a\u{a0}JS\u{a0}migration ' +
                            'tool which\u{a0}losslessly moves data to\u{a0}Gitea.',
                        ru: 'Мигрировал сотрудников с\u{a0}GitLab на\u{a0}self-\u{2060}hosted Gitea; разработал JS-\u{2060}мигратор для\u{a0}переноса данных.',
                    },
                    tags: ['GitLab', 'Gitea'],
                },
            ],
        },
        {
            companyName: {
                en: 'ITotdel (Neximus)',
                ru: 'ITотдел (Neximus)',
            },
            companyURL: 'https://neximus.pro',
            jobTitle: {
                en: 'Fullstack Developer\u{a0}/ DevOps',
                ru: 'Fullstack-разработчик\u{a0}/ DevOps',
            },
            subtitle: {
                en: 'A\u{a0}large\u{a0}MSP with complex, non-\u{2060}trivial tasks and\u{a0}interesting projects.',
                ru: 'Атмосфера крупного\u{a0}MSP, сложные задачи, интересные проекты.',
            },
            startDate: new Temporal.PlainYearMonth(2021, 12, 'gregory'),
            endDate: new Temporal.PlainYearMonth(2022, 11, 'gregory'),
            achievements: [
                {
                    title: 'frontend',
                    text: {
                        en: "Participated in\u{a0}frontend development for\u{a0}a\u{a0}company's personal area website.",
                        ru: 'Участвовал в\u{a0}разработке фронтэнда личного кабинета компании.',
                    },
                    tags: ['HTML', 'CSS', 'Sass', 'TS', 'Angular', 'NATS', 'WebSocket', 'Material UI'],
                },
                {
                    title: new Set(['sysadmin', 'devops']),
                    text: {
                        en: 'Maintained and\u{a0}evolved IT\u{a0}infrastructure for\u{a0}more\u{a0}than 60\u{a0}companies across Russia.',
                        ru: 'Поддерживал и\u{a0}развивал IT-\u{2060}инфраструктуру более\u{a0}60 организаций в\u{a0}пределах России.',
                    },
                    tags: ['Windows', 'Linux'],
                },
                {
                    title: 'sysadmin',
                    text: {
                        en:
                            "Completely refactored networking infrastructure of\u{a0}company's clients: eliminated vulnerabilities, " +
                            'audited the\u{a0}configuration of\u{a0}all\u{a0}networking devices, implemented availability monitoring, logging and\u{a0}backups; ' +
                            'unified the\u{a0}configuration as\u{a0}much as\u{a0}possible.',
                        ru:
                            'Выполнил полный рефакторинг сетевой инфраструктуры обслуживаемых организаций: устранение уязвимостей, аудит, ' +
                            'мониторинг, логирование и\u{a0}резервные копии, унифицированная конфигурация.',
                    },
                    tags: ['MikroTik', 'Oxidized', 'NFsen', 'LibreNMS', 'Syslog'],
                },
                {
                    title: 'sysadmin',
                    text: {
                        en:
                            'Implemented an\u{a0}access controller based\u{a0}on Mikrotik\u{a0}CHR, which\u{a0}was\u{a0}used for\u{a0}secure and\u{a0}transparent ' +
                            "access to\u{a0}company's clients'\u{a0}own networks.",
                        ru:
                            'Внедрил контроллер доступа на\u{a0}базе MikroTik\u{a0}CHR, что\u{a0}позволило иметь прозрачный и\u{a0}защищенный доступ к\u{a0}сетям ' +
                            'подконтрольных организаций.',
                    },
                    tags: ['Mikrotik', 'IKEv2', 'Netmap'],
                },
                {
                    title: new Set(['sysadmin', 'devops']),
                    text: {
                        en: "Extensively used\u{a0}Ansible for\u{a0}deploying new\u{a0}services, including services for\u{a0}the\u{a0}company's clients.",
                        ru: 'Использовал Ansible для\u{a0}развертывания сервисов как\u{a0}внутри компании, так\u{a0}и\u{a0}для обслуживаемых организаций.',
                    },
                    tags: ['Ansible'],
                },
                {
                    title: new Set(['sysadmin', 'devops']),
                    text: {
                        en:
                            'Created a\u{a0}backup system based\u{a0}on restic and\u{a0}rest-\u{2060}server for\u{a0}Windows workstations ' +
                            'and\u{a0}Windows/Linux server instances.',
                        ru:
                            'Настроил систему резервного копирования на\u{a0}основе restic и\u{a0}rest-\u{2060}server для\u{a0}рабочих станций ' +
                            'и\u{a0}серверной инфраструктуры.',
                    },
                    tags: ['Restic', 'rest-server'],
                },
                {
                    title: 'backend',
                    text: {
                        en:
                            'Created a\u{a0}proof-\u{2060}of-\u{2060}concept bruteforce tool for\u{a0}MikroTik devices (RouterOS) with Golang; ' +
                            'wrote a\u{a0}"roll-\u{2060}your-\u{2060}own" crypto library to\u{a0}perform the\u{a0}RouterOS authentication process (EC-\u{2060}SRP5).',
                        ru:
                            'Разработал proof-\u{2060}of-\u{2060}concept брутфорса для\u{a0}устройств MikroTik (RouterOS) на\u{a0}Golang; ' +
                            'использовал самописную криптографию на\u{a0}основе EC-\u{2060}SRP5.',
                    },
                    tags: ['MikroTik', 'Golang'],
                },
                {
                    title: 'backend',
                    text: {
                        en: "Created a\u{a0}backend for\u{a0}a\u{a0}company's personal area system from\u{a0}scratch.",
                        ru: 'Реализовал с\u{a0}нуля бэкэнд системы личного кабинета компании.',
                    },
                    tags: ['Node.js', 'knex', 'NATS', 'WebSocket', 'PostgreSQL', 'Axios'],
                },
            ],
        },
        {
            companyName: {
                en: 'Monroe',
                ru: 'Сеть женских фитнес-клубов "Монро"',
            },
            companyURL: 'https://monroe.fitness',
            jobTitle: {
                en: 'Fullstack Developer\u{a0}/ DevOps',
                ru: 'Fullstack-разработчик\u{a0}/ DevOps',
            },
            subtitle: {
                en: 'Great company, unforgettable experiences and\u{a0}complete freedom in\u{a0}implementing IT\u{a0}solutions.',
                ru: 'Прекрасная компания, незабываемые впечатления и\u{a0}полная свобода в\u{a0}IT-\u{2060}решениях.',
            },
            startDate: new Temporal.PlainYearMonth(2020, 4, 'gregory'),
            endDate: new Temporal.PlainYearMonth(2021, 12, 'gregory'),
            achievements: [
                {
                    title: new Set(['sysadmin', 'devops']),
                    text: () => html` ${this.localize({
                            en:
                                'Designed and\u{a0}implemented IT\u{a0}infrastructure for a\u{a0}network of\u{a0}fitness clubs from\u{a0}scratch: ' +
                                'FOSS, IaC and\u{a0}with\u{a0}almost zero cost.',
                            ru: 'Спроектировал и\u{a0}развернул IT-\u{2060}инфраструктуру сети фитнес-\u{2060}клубов с\u{a0}нуля: FOSS, IaC, минимум расходов.',
                        })}<br />
                        ${this.localize({
                            en: '6\u{a0}branches across Russia, 2\u{a0}Proxmox hypervisors, approx. 30\u{a0}LXC\u{a0}containers and\u{a0}10\u{a0}Windows workstations.',
                            ru: '6\u{a0}филиалов, 2\u{a0}гипервизора Proxmox, ~30\u{a0}LXC-\u{2060}контейнеров, 10\u{a0}рабочих станций на\u{a0}Windows.',
                        })}`,
                    tags: ['Proxmox', 'LXC', 'Windows'],
                },
                {
                    title: 'sysadmin',
                    text: {
                        en: "Created a\u{a0}highly available FullMesh network between company's branches using MikroTik and\u{a0}RouterOS.",
                        ru: 'Построил отказоустойчивую FullMesh-\u{2060}сеть между филиалами компании на\u{a0}оборудовании Mikrotik.',
                    },
                    tags: ['IPsec', 'IKEv2', 'GRE', 'OSPF', 'VXLAN'],
                },
                {
                    title: new Set(['sysadmin', 'devops']),
                    text: {
                        en:
                            "Leveraged Ansible's power to\u{a0}completely automate the\u{a0}deployment and\u{a0}updates of\u{a0}almost the\u{a0}entire " +
                            'infrastructure, including Windows workstations.',
                        ru:
                            'Использовал Ansible для\u{a0}того, чтобы\u{a0}практически вся\u{a0}инфраструктура, включая рабочие станции, ' +
                            'разворачивалась и\u{a0}обновлялась автоматически.',
                    },
                    tags: ['Ansible', 'IaC', 'WinRM'],
                },
                {
                    title: 'sysadmin',
                    text: {
                        en: 'Created a\u{a0}modern self-\u{2060}hosted mail server according to\u{a0}the best\u{a0}practices.',
                        ru: 'Развернул современный self-\u{2060}hosted почтовый сервер согласно лучшим практикам.',
                    },
                    tags: ['Postfix', 'Dovecot', 'rspamd', 'clamav', 'TLS', 'SPF', 'DKIM', 'DMARC', 'MTA-STS', 'BIMI'],
                },
                {
                    title: 'sysadmin',
                    text: {
                        en:
                            'Migrated an\u{a0}existing cloud-\u{2060}based telephony solution to\u{a0}a\u{a0}self-\u{2060}hosted Asterisk deployment ' +
                            '(pure, without FreePBX). Integrated a\u{a0}custom CDR\u{a0}server with\u{a0}Asterisk using\u{a0}AGI.',
                        ru:
                            'Перенес облачную телефонию на\u{a0}self-\u{2060}hosted Asterisk (чистый Asterisk, без\u{a0}FreePBX). ' +
                            'Интегрировал в\u{a0}Asterisk самописный CDR-\u{2060}сервер посредством\u{a0}AGI.',
                    },
                    tags: ['Asterisk', 'PJSIP', 'AGI', 'CDR', 'SIPS', 'SRTP'],
                },
                {
                    title: 'sysadmin',
                    text: () => html` ${this.localize({
                            en:
                                'Maintained an\u{a0}1C:Enterprise server deployment (8.3, 1C:Fitness). Performed trivial fixes and\u{a0}edits ' +
                                'in\u{a0}1C\u{a0}configuration.',
                            ru: 'Администрировал 1С\u{a0}сервер (8.3, конфигурации 1С:Фитнес, 1С:БП, 1С:ЗУП). Выполнял базовые доработки в\u{a0}конфигурации.',
                        })}<br />
                        ${this.localize({
                            en: 'Analyzed and\u{a0}mitigated performance issues, optimized SQL queries in\u{a0}1C:Enterprise.',
                            ru: 'Анализировал проблемы в\u{a0}быстродействии сервера, оптимизировал SQL-\u{2060}запросы.',
                        })}`,
                    tags: [
                        {
                            en: '1С:Предприятие',
                            ru: '1С:Enterprise',
                        },
                        'SQL',
                        'PostgreSQL',
                    ],
                },
                {
                    title: 'sysadmin',
                    text: {
                        en: 'Implemented a\u{a0}Restic-\u{2060}based backup solution for\u{a0}workstations and\u{a0}hypervisors.',
                        ru: 'Настроил резервное копирование информации с\u{a0}рабочих станций и\u{a0}гипервизоров.',
                    },
                    tags: ['Restic', 'rest-server'],
                },
                {
                    title: 'sysadmin',
                    text: {
                        en:
                            'Performed maintenance on\u{a0}computers, peripheral devices, POS and\u{a0}networking gear\u{a0}- both with a\u{a0}soldering iron ' +
                            'and\u{a0}without\u{a0}it.',
                        ru:
                            'Обслуживал ПК, периферию, кассовую технику и\u{a0}сетевое оборудование\u{a0}- как\u{a0}с\u{a0}паяльником \u{a0}руках, ' +
                            'так\u{a0}и\u{a0}без него.',
                    },
                    tags: [
                        [
                            'Soldering iron',
                            {
                                en: 'Soldering iron',
                                ru: 'Паяльник',
                            },
                        ],
                    ],
                },
                {
                    title: 'fullstack',
                    text: {
                        en: 'Developed a\u{a0}custom CDR\u{a0}service for\u{a0}viewing call logs and\u{a0}listening to\u{a0}call records.',
                        ru: 'Разработал внутреннюю CDR-\u{2060}систему для\u{a0}просмотра и\u{a0}прослушивания звонков.',
                    },
                    tags: ['HTML', 'CSS', 'JS', 'Gulp', 'Node.js', 'knex', 'hapi', 'pug', 'joi'],
                },
                {
                    title: 'frontend',
                    text: {
                        en:
                            'Created a\u{a0}web interface for\u{a0}a\u{a0}dieting guide "Lightness": viewing video courses, activating codes ' +
                            'and\u{a0}saving your\u{a0}progress.',
                        ru:
                            'Создание веб-\u{2060}интерфейса системы правильного питания "Легкость Есть": просмотр видео, активация кодов ' +
                            'и\u{a0}сохранение прогресса.',
                    },
                    tags: ['HTML', 'CSS', 'JS'],
                },
                {
                    title: 'fullstack',
                    text: () =>
                        html`<span>
                            ${this.localize({
                                en: 'Developed an',
                                ru: 'Разработал',
                            })}
                            <a
                                href="https://shop.monroe.fitness"
                                rel="noreferrer noopener nofollow external"
                                target="_blank"
                                @click=${(e: Event) => {
                                    e.preventDefault();
                                    this.monroeShopModal = true;
                                }}
                                >${this.localize({
                                    en: 'online shop',
                                    ru: 'онлайн-\u{2060}магазин',
                                })}</a
                            >
                            ${this.localize({
                                en: 'that\u{a0}allows to\u{a0}buy various fitness club subscriptions.',
                                ru: 'для\u{a0}покупки абонементов в\u{a0}фитнес-\u{2060}клуб.',
                            })}
                        </span>`,
                    tags: ['HTML', 'CSS', 'JS', 'Gulp', 'Node.js', 'knex', 'hapi', 'pug', 'joi'],
                },
            ],
        },
        {
            companyName: {
                en: 'Rubicon Consulting, LLC',
                ru: 'ООО "Рубикон Консалтинг"',
            },
            companyURL: 'https://rubicon-it.ru',
            jobTitle: {
                en: 'Support Specialist\u{a0}/ System Administrator',
                ru: 'Специалист поддержки\u{a0}/ системный администратор',
            },
            subtitle: {
                en: 'A\u{a0}great kickstart to\u{a0}my\u{a0}career in\u{a0}commercial\u{a0}IT.',
                ru: 'Начало моего коммерческого опыта в\u{a0}IT.',
            },
            startDate: new Temporal.PlainYearMonth(2018, 11, 'gregory'),
            endDate: new Temporal.PlainYearMonth(2020, 3, 'gregory'),
            achievements: [
                {
                    title: 'frontend',
                    text: {
                        en: "Performed trivial frontend-related development on\u{a0}company's internal services.",
                        ru: 'Выполнял мелкие доработки фронтэнда на\u{a0}внутренних ресурсах компании.',
                    },
                    tags: ['HTML', 'CSS', 'JS'],
                },
                {
                    title: 'frontend',
                    text: {
                        en: 'Migrated a\u{a0}legacy theme for\u{a0}Redmine (project management system) to a\u{a0}modern CSS stack.',
                        ru: 'Переводил legacy-\u{2060}тему для\u{a0}системы управления проектами Redmine на\u{a0}современный CSS-\u{2060}стек.',
                    },
                    tags: ['HTML', 'CSS', 'Redmine'],
                },
                {
                    title: 'sysadmin',
                    text: () => html` ${this.localize({
                            en: 'Maintained and\u{a0}evolved a\u{a0}hybrid IT\u{a0}infrastructure.',
                            ru: 'Обслуживал и\u{a0}развивал гибридную инфраструктуру компании.',
                        })}<br />
                        ${this.localize({
                            en: '2\u{a0}on-\u{2060}premises hypervisors (Hyper-\u{2060}V), Azure Cloud and\u{a0}20\u{a0}Windows workstations.',
                            ru: '2\u{a0}on-\u{2060}premises гипервизора (Hyper-\u{2060}V), облако в\u{a0}Azure, 20\u{a0}рабочих станций на\u{a0}Windows.',
                        })}`,
                    tags: ['Hyper-V', 'Windows', 'Azure'],
                },
                {
                    title: 'sysadmin',
                    text: {
                        en:
                            'Maintained an\u{a0}Active Directory domain: migrated\u{a0}AD to\u{a0}the\u{a0}new pair\u{a0}of\u{a0}DCs, deployed an\u{a0}ADCS ' +
                            'instance, improved Kerberos enforcing, deployed PowerShell Remoting support across the\u{a0}entire domain.',
                        ru:
                            'Поддерживал домен Active Directory: миграция\u{a0}AD на\u{a0}новые\u{a0}DC, развертывание\u{a0}ADCS, переход на\u{a0}Kerberos, ' +
                            'внедрение PowerShell Remoting.',
                    },
                    tags: ['Active Directory', 'Kerberos', 'WinRM'],
                },
                {
                    title: 'sysadmin',
                    text: {
                        en: "Upgraded the\u{a0}company's Windows servers to\u{a0}Windows Server Core 2019.",
                        ru: 'Выполнил апгрейд Windows-\u{2060}серверов компании на\u{a0}Windows Server Core 2019.',
                    },
                    tags: ['Windows', 'Windows Server Core'],
                },
                {
                    title: 'sysadmin',
                    text: () => html` ${this.localize({
                            en: 'Performed technical support duties for\u{a0}Kaspersky Lab and\u{a0}Dr.Web anti-\u{2060}virus products.',
                            ru: 'Оказывал услуги технической поддержки по\u{a0}антивирусным продуктам Kaspersky Lab и\u{a0}Dr.Web.',
                        })}<br />
                        ${this.localize({
                            en:
                                'Supported several Kaspersky Security Center deployments, including an\u{a0}instance that\u{a0}handled ' +
                                'more\u{a0}than 1000\u{a0}agent connections.',
                            ru: 'Поддерживал несколько развертываний Kaspersky Security Center, включая инстанс на\u{a0}более\u{a0}чем 1000\u{a0}рабочих мест.',
                        })}`,
                    tags: ['Kaspersky', 'Dr.Web'],
                },
                {
                    title: 'sysadmin',
                    text: {
                        en: 'Performed reverse-\u{2060}engineering of\u{a0}PowerBI visuals, penetration tests and\u{a0}IT\u{a0}security audits.',
                        ru:
                            'Занимался реверс-\u{2060}инжинирингом вижуалов в\u{a0}PowerBI, выполнял тесты на\u{a0}проникновение и\u{a0}проводил аудиты ' +
                            'по\u{a0}информационной безопасности для\u{a0}сторонних заказчиков',
                    },
                    tags: ['PowerBI', 'Pentesting', 'IDA'],
                },
            ],
        },
    ];

    private translateOptional(s: string | LanguageRecord<string> | undefined): string | undefined {
        if (s === undefined) {
            return undefined;
        }

        if (typeof s === 'string') {
            return s;
        }

        return this.localize(s);
    }

    private getTotalWorkDuration(): Temporal.Duration {
        let accumulatedMonths = 0;
        const now = Temporal.Now.zonedDateTimeISO(this.locale.timezone);

        for (const workplace of this.experience) {
            let endDate: Temporal.ZonedDateTime | Temporal.PlainYearMonth | undefined = workplace.endDate;
            endDate ??= now.toPlainDate().withCalendar('gregory').toPlainYearMonth();

            const elapsed = endDate.since(workplace.startDate);

            accumulatedMonths += elapsed.total({
                unit: 'month',
                relativeTo: workplace.startDate.toPlainDate({ day: 1 }),
            });
        }

        return Temporal.Duration.from({
            months: accumulatedMonths,
        }).round({
            relativeTo: now,
            largestUnit: 'year',
            smallestUnit: 'month',
            roundingMode: 'ceil',
        });
    }

    override render() {
        const totalWorkDuration = this.locale
            .formatDurationLocalized(this.getTotalWorkDuration(), {
                style: 'long',
            })
            .replaceAll(' ', '\u{a0}');

        return html`<resume-section compact>
                <span slot="title">
                    ${this.localize({
                        en: `Commercial experience:`,
                        ru: `Коммерческий опыт работы:`,
                    })}

                    <span class="experience__total">${totalWorkDuration}</span>
                </span>

                <ol class="workplaces">
                    ${repeat(
                        this.experience,
                        (workplace, index) => html`
                            <li class="workplace">
                                <resume-workplace
                                    class="workplace__info"
                                    .jobTitle=${this.translateOptional(workplace.jobTitle)}
                                    .companyName=${this.translateOptional(workplace.companyName)}
                                    .companyURL=${workplace.companyURL}
                                    .subtitle=${this.translateOptional(workplace.subtitle)}
                                    .startDate=${workplace.startDate}
                                    .endDate=${workplace.endDate}
                                    .achievements=${workplace.achievements}
                                    .indexes=${[this.experience.length - index, this.experience.length]}
                                ></resume-workplace>
                            </li>
                        `
                    )}
                </ol>
            </resume-section>

            <cel-lazyload ?loaded=${this.monroeShopModal}>
                <cel-modal
                    ?open=${this.monroeShopModal}
                    @open-changed=${(v: CustomEvent<boolean>) => (this.monroeShopModal = v.detail)}
                    width="500"
                >
                    <p style="max-width: 90%;">
                        ${this.localize({
                            en:
                                'Before you\u{a0}go\u{a0}- please keep in\u{a0}mind that this online shop was\u{a0}created a\u{a0}few\u{a0}years ago, back\u{a0}in\u{a0}2020, ' +
                                'and\u{a0}no\u{a0}one updated\u{a0}it in\u{a0}the\u{a0}meantime.',
                            ru:
                                'Перед\u{a0}тем, как\u{a0}перейти по\u{a0}ссылке, обратите внимание: онлайн-\u{2060}магазин был\u{a0}разработан в\u{a0}2020\u{a0}году ' +
                                'и\u{a0}с\u{a0}тех\u{a0}пор никак не\u{a0}обновлялся.',
                        })}
                    </p>
                    <p>
                        ${this.localize({
                            en: 'My\u{a0}development skills have\u{a0}grown a\u{a0}lot since\u{a0}then.',
                            ru: 'Кроме этого, мои\u{a0}навыки разработки сильно выросли за\u{a0}это\u{a0}время.',
                        })}
                    </p>
                    <a
                        style="width: fit-content;"
                        href="https://shop.monroe.fitness"
                        rel="noreferrer noopener nofollow external"
                        target="_blank"
                        @click=${() => {
                            this.monroeShopModal = false;
                        }}
                    >
                        ${this.localize({
                            en: 'Click here to\u{a0}continue',
                            ru: 'Перейти в\u{a0}онлайн-\u{2060}магазин',
                        })}
                    </a>
                </cel-modal>
            </cel-lazyload>`;
    }
}
