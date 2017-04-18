# Browser Mock Plugin

> **WARNING:** This plugin is **NOT** intended for production use. It is currently just a _proof of concept_.

This plugin is intended to easily mock unsupported plugins using the `browser` platform. It takes advantage of the way Cordova proxies browser-based plugins in order to function.

> **Note:** This plugin also supports mocking plugins with browser implementations if you need that too.

On its own, this plugin does very little. You'll need to include a plugin that has a mock in order to see any difference in your app.

## Installation

```
$ cordova platform add browser
$ cordova plugin add cordova-plugin-browser-mock
```

## Usage

Refer to the plugin mock you install for use; some mocks may support success and failure mode switches, or other options that change how the mock functions.

## Developing a mock

Developing a mock is pretty simple, assuming you know how the plugin's JavaScript API calls `cordova.exec()`. You should be able to determine this easily by looking at the plugin's JavaScript code.

Once you know what the API looks like, you can replace it by creating a new plugin, preferably called `cordova-plugin-browser-mock-<plugin-id>` and creating a proxy that overrides the existing behavior. You can see an example with the `cordova-plugin-browser-mock-camera` mock.

All your plugin _must_ do is the following:

``` javascript
module.exports = {
    /* internal API */
};
require("cordova-plugin-browser-mock.BrowserMock").register("service", module.exports);
```

## Notes

Depending on how your mock is added, there are two possible methods of initialization:

1. Your mock is added last, after the original plugin code has already configured itself. If the original plugin has a browser proxy, your mock will override that proxy.
2. Your mock is added first, before the original plugin code has registered itself. If the original plugin has a browser proxy, this is a _bad_ thing, because your proxy would then be overridden. This plugin prevents that by _swizzling_ Cordova's own `proxy.add` method and prevents additional proxy requests from overriding your code.

> When the second item occurs, you'll see console logs describing what's happening. Should the first item occur, no console logs will be generated (your only hint that the mock is in place is that Cordova will log _two_ proxies). Should the second item occur, you'd see something like this: `(i) mock note: ignoring proxy request for  Camera`

## FAQ

### What if the plugin I'm mocking doesn't support the browser platform?

Unless the plugin's configuration is unorthodox, the JavaScript API will be present regardless. (Most plugins will have `<js-module>` _outside_ a `<platform>` tag).

If, however, the plugin's JavaScript API is _not_ present, you'll need to provide a compatible API yourself.

## License

MIT