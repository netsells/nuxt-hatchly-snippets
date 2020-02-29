import Vue from 'vue';
import get from 'lodash/get';
import consola from 'consola';

const logger = consola.create({
    defaults: {
        badge: true,
        type: 'snippets',
    },
});

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
                return (key) => snippets.find(snippet => snippet.key === key);
            },
        },

        actions: {
            /**
             * Get all snippets from the API.
             *
             * @param {Function} commit
             */
            async get({ commit }) {
                const { data } = await this.$axios.$get('<%- options.apiUrl %>');

                commit('set', data);
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
            logger.error('Module is not installed at [<%- options.apiUrl %>].');
            return;
        }

        logger.error('Module at [<%- options.apiUrl %>] returned an error.');
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

                return get(find(key), 'value');
            },
        },
    });
};

/**
 * Setup the plugin.
 *
 * @param {object} app
 *
 * @returns {Promise<void>}
 */
export default async function({ app }) {
    registerStoreModule(app.store);

    if (process.server) {
        await fetchSnippets(app.store);
    }

    registerGlobalMixin();
};
