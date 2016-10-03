'use strict'
const chokidar = require('chokidar')
const path = require('path')
const EventEmitter = require('events').EventEmitter
const socketsConnected = []

module.exports = (opts) => {
  let baseURL
  let pjson
  let error
  let emitter = new EventEmitter();
  try {
    pjson = require(path.join(opts.dir || path.dirname(require.main.filename), 'package.json'))
  } catch (err) {
    error = err
  }
  if (!error) {
    baseURL = pjson.jspm && pjson.jspm.directories && pjson.jspm.directories.baseURL || pjson.directories && pjson.directories.baseURL
  }

  const pathToWatch = opts.path || baseURL || '.'
  let ignoredPaths = [
    /[\/\\]\./,
    // Ignore relative, top-level dotfiles as well (e.g. '.gitignore').
    /^\.[^\/\\]/,
    'node_modules/**',
    (baseURL ? baseURL + '/' : '') + 'jspm_packages/**',
    '.git/**'
  ]
  let chokidarOpts = Object.assign({
    ignored: ignoredPaths,
    ignoreInitial: true
  }, opts.chokidar)
  console.log('chokidar watching ', path.resolve(pathToWatch))
  var watcher = chokidar.watch(pathToWatch, chokidarOpts).on('all', (event, onPath) => {
    let absolutePath = path.join(process.cwd(), onPath)
    if (opts.relativeTo) {
      onPath = path.relative(opts.relativeTo, onPath)
    } else if (baseURL) {
      onPath = path.relative(baseURL, onPath)
    }
    if (path.sep === '\\') {
      onPath = onPath.replace(/\\/g, '/')
    } else {

    }
    console.log('File ', onPath, ' emitted: ' + event)
    emitter.emit(event, {path: onPath, absolutePath});
  })

  return emitter;

}