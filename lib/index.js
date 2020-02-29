import { resolve } from 'path';

/**
 * Register the module.
 *
 * @param {object} moduleOptions
 */
export default function SnippetsModule(moduleOptions = {}) {
    const options = {
        apiBase: process.env.API_BASE,
        apiPath: '_hatchly/api/snippets',
        ...moduleOptions,
        ...(this.options.hatchly || {}).snippets || {},
    };

    options.apiUrl = options.apiUrl
        || `${ options.apiBase }/${ options.apiPath }`;

    const plugin = this.addTemplate({
        src: resolve(__dirname, './plugin.js'),
        fileName: './hatchly-snippets.js',
        options,
    });

    this.options.plugins.push(resolve(this.options.buildDir, plugin.dst));
}
