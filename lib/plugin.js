import get from 'lodash/get';
import logger from './logger';

const config = {};

<% if (options.cacheTimeout) { %>
    const cache = {
        data: {},
        timestamp: null,
    };
<% } %>

/**
 * Register the Vuex module to fetch the snippets.
 *
 * @param {object} store
 */
export const registerStoreModule = (store) => {
    store.registerModule('snippets', {
        namespaced: true,

        state: () => ({
            snippets: [],
        }),

        mutations: {
            /**
             * Set the data in the store.
             *
             * @param {object} state
             * @param {Array} data
             */
            set(state, data) {
                state.snippets = data;
            },
        },

        getters: {
            /**
             * Return a function to find snippet in the store by key.
             *
             * @param {Array} snippets
             *
             * @returns {function(*): *}
             */
            find({ snippets }) {
                return (key) => snippets.find((snippet) => snippet.key === key);
            },
        },

        actions: {
            /**
             * Get all snippets from the API.
             *
             * @param {Function} commit
             */
            async get({ commit }) {
                const path = `${ config.apiUrl }/snippets`;

                logger.info(`Fetching snippets from [${ path }]`);

                const { data } = await this.$axios.$get(path);

                commit('set', data);

                return data;
            },
        },
    });
};

/**
 * Run the call to fetch the snippets from the API.
 *
 * @param {Function} dispatch
 *
 * @returns {Promise<*>}
 */
const fetchSnippets = async ({ dispatch }) => {
    try {
        return await dispatch('snippets/get');
    } catch (e) {
        if (e.response && e.response.status === 404) {
            logger.error(`Module is not installed at [${ config.apiUrl }].`);
            return;
        }

        logger.error(`Module at [${ config.apiUrl }] returned an error.`);
        logger.error(new Error(e));
    }
};

/**
 * Register the global mixin to allow access to snippets.
 */
export const globalMixin = function(key) {
    const find = this.$store.getters['snippets/find'];

    if (!find) {
        logger.error('Find method was undefined');
        return '';
    }

    return get(find(key), 'value');
};

/**
 * Setup the plugin.
 *
 * @param {object} context
 * @param {object} context.app
 * @param {object} context.$config
 * @param {function} inject
 *
 * @returns {Promise<void>}
 */
export default async function({ app, $config, route }, inject) {
    config.apiUrl = `${ $config.hatchly.snippets.apiUrl }/<%- options.apiPath %>`;

    registerStoreModule(app.store);

    inject('snippet', globalMixin);

    if (!process.server) {
        return;
    }

    <% if (!options.cacheTimeout) { %>
        return fetchSnippets(app.store);
    <% } else { %>
        const forceClear = route.query.cache === 'clear';

        const now = () => Math.round(new Date().getTime() / 1000);
        const generateCacheTimeout = () => now() + <%- options.cacheTimeout %>;

        const request = () => fetchSnippets(app.store).then((data) => {
            cache.data = data;
            cache.timestamp = generateCacheTimeout();

            return data;
        });

        if (forceClear || !cache.timestamp || cache.timestamp <= now()) {
            if (forceClear) {
                logger.log('Cache clear was forced');
            } else if (!cache.timestamp) {
                logger.log('Populating cache for the first time');
            } else {
                logger.log('Cache expired, fetching...');
            }

            cache.data = await request();
            cache.timestamp = generateCacheTimeout();
        } else {
            logger.log('Using cached data');
            app.store.commit('snippets/set', cache.data);
        }
    <% } %>
};
