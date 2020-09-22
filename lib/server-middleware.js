import path from 'path';
import fetchSnippets from './fetch-snippets';

export default (options) => {
    return async (req, res, next) => {
        const snippetsFilePath = path.resolve('.nuxt/hatchly-snippets/snippets.json');

        const { snippets } = require(snippetsFilePath);

        if (!snippets.length) {
            await fetchSnippets(options);
        } else {
            fetchSnippets(options);
        }

        next();
    };
};
