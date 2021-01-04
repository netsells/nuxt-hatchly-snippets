import Vue from 'vue';
import { registerStoreModule, globalMixin } from '../lib/plugin';

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
