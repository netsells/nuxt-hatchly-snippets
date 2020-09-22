import fs from 'fs';
import axios from 'axios';
import path from 'path';

/**
 * Fetch the snippets from the API and store them as json.
 *
 * @param {object} options
 *
 * @returns {Promise<{navigations: *[]}>}
 */
export default async function fetchSnippets(options) {
    const snippetsFilePath = path.resolve('.nuxt/hatchly-snippets/snippets.json');

    const axiosClient = axios.create({
        baseURL: options.apiURL,
    });

    const { data: { data: snippets } } = await axiosClient.get('snippets');

    fs.writeFileSync(snippetsFilePath, JSON.stringify({ snippets }, null, 4));

    console.log({ snippets })

    return { snippets };
}
