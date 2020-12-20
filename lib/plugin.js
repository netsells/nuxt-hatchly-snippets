import Vue from 'vue';
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
const registerStoreModule = (store) => {
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
                const { data } = await this.$axios.$get(`${ config.apiUrl }/snippets`);

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
const registerGlobalMixin = () => {
    Vue.mixin({
        methods: {
            /**
             * Fetch a snippet by key.
             *
             * @param {string} key
             *
             * @returns {string}
             */
            $snippet(key) {
                const find = this.$store.getters['snippets/find'];

                if (!find) {
                    logger.error('Find method was undefined');
                    return '';
                }

                return get(find(key), 'value');
            },
        },
    });
};

/**
 * Setup the plugin.
 *
 * @param {object} context
 * @param {object} context.app
 * @param {object} context.$config
 *
 * @returns {Promise<void>}
 */
export default async function({ app, $config, route }) {
    config.apiUrl = `${ $config.hatchly.snippets.apiUrl }/<%- options.apiPath %>`;

    registerStoreModule(app.store);
    registerGlobalMixin();

    if (process.server) {
        const forceClear = route.query.cache === 'clear';

        <% if (!options.cacheTimeout) { %>
            return fetchSnippets(app.store);
        <% } else { %>
            const request = () => fetchSnippets(app.store).then((data) => {
                cache.data = data;
                cache.timestamp = (new Date()).getTime();

                return data;
            });

            const timeoutDate = cache.timestamp + <%- options.cacheTimeout %>;

            if (forceClear || !cache.timestamp || cache.timestamp <= timeoutDate) {
                logger.log('Cache expired, fetching...');
                cache.data = await request();
                cache.timestamp = (new Date()).getTime();
            } else {
                logger.log('Using cached data');
                app.store.commit('snippets/set', cache.data);
            }
        <% } %>
    }
};
