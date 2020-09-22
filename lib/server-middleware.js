import fs from 'fs';
import path from 'path';
import axios from 'axios';
import fetchSnippets from './fetch-snippets';

export default (options) => {
    console.log({ options });
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
