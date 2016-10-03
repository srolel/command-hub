// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const System = require('systemjs');
System.trace = true;
require('./config.js');

const HotReloader = require('./lib/hot-reloader');
const getChangeEmitter = require('./lib/file-change-emitter');

new HotReloader(getChangeEmitter({}));
System.import('app');


