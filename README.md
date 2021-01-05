# Nuxt Hatchly Snippets Module

> Module to easily fetch and access snippets from the `hatchly/snippets` api

## Installation

```bash
yarn add @hatchly/nuxt-snippets-module
```

Register the module in your nuxt applications config file:

```js
module.exports = {
    // Nuxt config
    modules: {
        // Other Modules
        ['@hatchly/nuxt-snippets-module', {
            // Options
        }],
    },

    hatchly: {
        snippets: {
            // Options can also be defined here
        },
    },
};
```

Add the API url to your .env:

```
API_URL=http://my-application.localhost
```

## Options

The options object can contain the following values: 

```js
{
    cacheTimeout: '',
},
```

Each option is described below.

### `cacheTimeout`

> The duration, in seconds, until the cached date is refreshed. The cache can be disabled completely by passing a falsey value.

- Default: `86400` (24 hours)
- Type: `number|boolean`

### Runtime config

By default, this package will utilise `API_URL` and `API_URL_BROWSER` variables as defined in your env. These are injected as runtime variables for you.

You can supply your endpoint manually to the module via the `publicRuntimeConfig` and `privateRuntimeConfig` objects, e.g.:

```js
module.exports = {
    publicRuntimeConfig: {
        hatchly: {
            snippets: {
                // Overwrite options for the snippets module
                endpoint: process.env.SNIPPETS_API_URL,
            },
        },    
    },
};
```

## Usage

All snippets are downloaded server side on page load.

To access a snippet you can use the global `$snippet()` method:

```vue
{{ $snippet('snippet_key') }}
```

## Storybook

This module exposes a storybook integration to add the `$snippet` global and the store module. Simply pull the following module into your project and register your snippets, in the `preview.js` file for example:

```js
import hatchlySnippets from '@hatchly/nuxt-snippets-module/storybook';
import { snippets } from './fixtures/snippets';
import store from './store';

hatchlySnippets({
    store,
    snippets,
});
```
