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
API_BASE=http://my-application.localhost
```

## Options

### `apiBase`

> The url of your Hatchly site. This is should be updated in your .env rather than hardcoding a value here.

- Default: `process.env.API_BASE`
- Type: `string`

### `apiPath`

> The path to the snippets endpoint. This can be modified in the Hatchly api config file, so make sure this path corresponds to that value.

- Default: `'_hatchly/api/snippets'`
- Type: `string`

### `apiUrl`

> The full api url to the snippets module. By default this is made up of the `apiBase` and the `apiUrl`, but can be overwritten in full.

- Default: `${ process.env.API_BASE }/_hatchly/api/snippets`
- Type: `string`


