import Vue from 'vue';
import get from 'lodash/get';
import logger from './logger';
import { snippets } from './snippets.json';

let config = {};

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

    app.store.commit('snippets/set', snippets);

    registerGlobalMixin();
};
