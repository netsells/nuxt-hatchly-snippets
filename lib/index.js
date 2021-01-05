import { resolve } from 'path';
import logger from './logger';

/**
 * Register the module.
 *
 * @param {object} moduleOptions
 */
export default function SnippetsModule(moduleOptions = {}) {
    const hatchlyOptions = {
        ...this.options.hatchly || {},
    };

    const options = {
        cacheTimeout: (24 * 60 ) * 60, // 24 hours default
        ...hatchlyOptions,
        ...moduleOptions,
        ...(this.options.hatchly || {}).snippets || {},
    };

    if (!options.cacheTimeout) {
        logger.info('Falsey cacheTimeout provided, cache will not be used.');
    }

    this.options.publicRuntimeConfig.hatchly = {
        ...this.options.publicRuntimeConfig.hatchly,
        snippets: {
            endpoint: `${ process.env.API_URL_BROWSER || process.env.API_URL }/_hatchly/api/snippets`,
            ...(this.options.publicRuntimeConfig.hatchly || {}).snippets,
        },
    };

    this.options.privateRuntimeConfig.hatchly = {
        ...this.options.privateRuntimeConfig.hatchly,
        snippets: {
            endpoint: `${ process.env.API_URL }/_hatchly/api/snippets`,
            ...(this.options.privateRuntimeConfig.hatchly || {}).snippets,
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
