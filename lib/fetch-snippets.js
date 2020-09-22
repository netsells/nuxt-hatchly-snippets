import fs from 'fs';
import axios from 'axios';
import path from 'path';

/**
 * Fetch the snippets from the API and store them as json.
 *
 * @param {object} options
 *
 * @returns {Promise<{snippets: *[]}>}
 */
export default async function fetchSnippets(options) {
    const snippetsFilePath = path.resolve('.nuxt/hatchly-snippets/snippets.json');

    const axiosClient = axios.create({
        baseURL: options.apiURL,
    });

    const { data: { data: snippets } } = await axiosClient.get('snippets');

    const existingJson = fs.readFileSync(snippetsFilePath, 'utf-8');
    const json = JSON.stringify({ snippets }, null, 4);

    if (existingJson !== json) {
        fs.writeFileSync(snippetsFilePath, json);
    }

    return { snippets };
}
