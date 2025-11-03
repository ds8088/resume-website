import type { UserConfig } from 'vite';
import { ViteMinifyPlugin } from 'vite-plugin-minify';
import { literalsHtmlCssMinifier } from '@literals/rollup-plugin-html-css-minifier';

import 'vite';

export default {
    root: './',
    envDir: '../',
    publicDir: './assets/public',
    server: {
        open: true,
    },
    preview: {
        open: true,
    },
    plugins: [
        ViteMinifyPlugin({
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            collapseInlineTagWhitespace: true,
            conservativeCollapse: true,
            quoteCharacter: '"',
            removeComments: true,
            removeScriptTypeAttributes: true,
            sortAttributes: true,
        }),
    ],
    build: {
        target: 'es2022',
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            output: {
                generatedCode: 'es2015', // This is OK - Rollup only needs es2015 features
            },
            plugins: [
                literalsHtmlCssMinifier({
                    options: {
                        minifyOptions: {
                            collapseInlineTagWhitespace: true,
                            collapseWhitespace: true,
                            conservativeCollapse: true,
                        },
                    },
                }),
            ],
        },
    },
    esbuild: {
        legalComments: 'none',
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: ['@use "@/css/vars" as *;', '@use "@/css/mixins" as *;'].join('\n'),
            },
        },
    },
    resolve: {
        alias: {
            '@': Bun.fileURLToPath(new URL('.', import.meta.url)),
        },
    },
} satisfies UserConfig;
