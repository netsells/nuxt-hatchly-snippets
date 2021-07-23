import Vue from 'vue';
import get from 'lodash/get';

const registerStoreModule = (store) => {
    store.registerModule('snippets', {
        namespaced: true,

        state: () => ({
            snippets: [],
            initialised: false,
        }),

        mutations: {
            /**
             * Set the data in the store.
             *
             * @param {object} state
             * @param {Array} data
             */
            set(state, data) {
                state.initialised = true;
                state.snippets = data;
            },
        },

        getters: {
            /**
             * Return a function to find snippet in the store by key.
             *
             * @param {object} state
             * @param {Array} state.snippets
             *
             * @returns {function(*): *}
             */
            find({ snippets }) {
                return (key) => snippets.find((snippet) => snippet.key === key);
            },
        },
    });
};

export const globalMixin = function(key) {
    const find = this.$store.getters['snippets/find'];

    return get(find(key), 'value');
};

/**
 * Init the store and globals and setup the snippets fixture.
 *
 * @param {object} config
 * @param {object} config.store
 * @param {Array} config.snippets
 */
export default ({ store, snippets }) => {
    registerStoreModule(store);

    Vue.prototype.$snippet = globalMixin;

    store.commit('snippets/set', snippets);
};
