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
    baseURL: '',
    browserBaseURL: '',
    apiPath: '',
    cacheTimeout: '',
},
```

Each option is described below.

### `baseURL`

> The url of your Hatchly site. If `browserBaseURL` is not provided this url will be used for both server side and client side fetching.

- Default: `process.env.API_URL`
- Type: `string`

### `browserBaseURL`

> The public url of your Hatchly site. 

- Default: `process.env.API_URL_BROWSER`
- Type: `string`

### `apiPath`

> The path to the api modules `hatchly-path` value. This can be modified in the Hatchly api config file, so make sure this path corresponds to that value.

- Default: `'_hatchly/api'`
- Alias: `hatchly.apiPath`
- Type: `string`

### `cacheTimeout`

> The duration, in seconds, until the cached date is refreshed. The cache can be disabled completely by passing a falsey value.

- Default: `86400` (24 hours)
- Type: `number|boolean`

### Runtime config

If using nuxt runtime config to inject env variables at runtime, each of the above options can be overwritten in both `publicRuntimeConfig` and `privateRuntimeConfig` objects, for example:

```js
module.exports = {
    publicRuntimeConfig: {
        hatchly: {
            // Inherit options for all hatchly modules
            baseURL: process.env.API_URL,
            
            snippets: {
                // Overwrite options for the snippets module
                baseURL: process.env.API_URL,
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
