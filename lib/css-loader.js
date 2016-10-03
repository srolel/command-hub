var _require = require('jspm-loader-css');

var Plugins = _require.Plugins;
var Loader = _require.Loader;

var _ref = new Loader([
    require('postcss-nested'),
    Plugins.values,
    Plugins.localByDefault,
    Plugins.extractImports,
    Plugins.scope]);

var fetch = _ref.fetch;
var bundle = _ref.bundle;


module.exports = { fetch: fetch, bundle: bundle };