import { resolve } from 'path';

/**
 * Register the module.
 *
 * @param {object} moduleOptions
 */
export default function SnippetsModule(moduleOptions = {}) {
    const { nuxt } = this;

    const hatchlyOptions = {
        apiPath: '_hatchly/api',
        ...this.options.hatchly || {},
    };

    const options = {
        baseURL: process.env.API_URL,
        browserBaseURL: process.env.API_URL_BROWSER,
        ...hatchlyOptions,
        ...moduleOptions,
        ...(this.options.hatchly || {}).snippets || {},
    };

    if (options.apiPath.endsWith('/')) {
        options.apiPath = options.apiPath
            .split('/')
            .slice(0, -1)
            .join('/');
    }

    if (options.apiPath.startsWith('/')) {
        const parts = options.apiPath.split('/');
        parts.unshift();
        options.apiPath = parts.join('/');
    }

    nuxt.options.publicRuntimeConfig.hatchly = {
        ...nuxt.options.publicRuntimeConfig.hatchly,
        snippets: {
            ...options,
            ...nuxt.options.publicRuntimeConfig.hatchly,
            ...(nuxt.options.publicRuntimeConfig.hatchly && nuxt.options.publicRuntimeConfig.hatchly.snippets),
        },
    };

    nuxt.options.privateRuntimeConfig.hatchly = {
        ...nuxt.options.privateRuntimeConfig.hatchly,
        snippets: {
            ...options,
            ...nuxt.options.privateRuntimeConfig.hatchly,
            ...(nuxt.options.privateRuntimeConfig.hatchly && nuxt.options.privateRuntimeConfig.hatchly.snippets),
        },
    };

    this.addTemplate({
        src: resolve(__dirname, './logger.js'),
        fileName: './hatchly-snippets/logger.js',
    });

    const { dst } = this.addTemplate({
        src: resolve(__dirname, './plugin.js'),
        fileName: './hatchly-snippets/plugin.js',
        options,
    });

    this.options.plugins.push(resolve(this.options.buildDir, dst));
}
