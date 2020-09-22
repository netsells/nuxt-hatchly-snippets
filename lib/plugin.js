import Vue from 'vue';
import get from 'lodash/get';
import logger from './logger';

const config = <%= JSON.stringify(options) %>;
let snippets = [];

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
             * Fetch the snippets data from the api.
             *
             * @param {Function} commit
             *
             * @returns {Promise<void>}
             */
            async get({ commit }) {
                const { data } = await this.$axios.$get(`${ config.apiURL }/snippets`);

                return data;
            },
        },
    });
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
 * @param {object} context
 * @param {object} context.app
 *
 * @returns {Promise<void>}
 */
export default async function({ app }) {
    registerStoreModule(app.store);

    if (process.server) {
        if (!snippets.length) {
            snippets = await app.store.dispatch('snippets/get');
        } else {
            app.store.dispatch('snippets/get').then((data) => snippets = data);
        }

        app.store.commit('snippets/set', snippets);
    }

    registerGlobalMixin();
};
