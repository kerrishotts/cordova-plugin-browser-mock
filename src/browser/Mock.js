var mockedServices = [];

var _proxy = require("cordova/exec/proxy");
var _add = _proxy.add;

// swizzle Cordova's own proxy mechanism to prevent plugins from overriding
// our mock. This is to prevent the real plugin from overriding our mock. Why?
// Because the order of proxy additions determines who gets called, and sometimes
// our mock will happen last (good), and sometimes it will happen first (bad).
// When it happens first, the real plugin can come in and override our mock.
_proxy.add = function (service, module) {
    if (mockedServices.indexOf(service) > -1) {
        // don't proxy anything else
        console.info("mock note: ignoring proxy request for ", service);
        return;
    }
    console.info("mock note: adding mock for ", service);
    _add(service, module);
}

module.exports = {
    /**
     * Registers a mock in place of any existing service
     *
     * @param {string} service          the service to mock
     * @param {Object} module           the mock module
     * @return {void}
     */
    register: function register(service, module) {
        if (mockedServices.indexOf(service) > -1) {
            // already mocked
            console.warn("mock warning:", service, "is already mocked");
            return;
        }
        mockedServices.push(service);
        _add(service, module);
    }
}