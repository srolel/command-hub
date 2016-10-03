const builtinModules = require('builtin-modules');
const map = builtinModules.reduce((acc, c) => {
    acc[c] = `@node/${c}`;
    return acc;
}, {});

System.config({
    transpiler: 'ts',
    typescriptOptions: {
        module: 'system',
        typeCheck: true,
        tsconfig: true,
        types: ["react", "react-dom"],
        typings: {
            'mobx': true,
            'mobx-react': true,
            './style.css': './style.css.d.ts'
        }
    },
    paths: {
        '*': 'node_modules/*',
        'tsconfig.json': './tsconfig.json',
        'app': './app',
        'app/*': './app/*',
    },
    map: Object.assign({
        css: './lib/css-loader.js',
        json: 'systemjs-plugin-json'
    }, map),
    meta: {
        '*.json': {
            loader: 'json'
        },
        '*.ts': {
            loader: 'plugin-typescript'
        },
        '*.tsx': {
            loader: 'plugin-typescript'
        },
        '*.css': {
            defaultExtension: '',
            loader: 'css'
        }
    },
    packageConfigPaths: [
        './node_modules/*/package.json',
        './node_modules/@types/*/package.json'
    ],
    packages: {
        app: {
            main: 'app',
            defaultExtension: 'ts',
        },
        'app/components': {
            defaultExtension: 'tsx',
            meta: {
                '*.css': {
                    defaultExtension: '',
                    loader: 'css'
                }
            }
        },
        typescript: {
            meta: {
                'lib/*': {
                    format: 'cjs'
                }
            }
        },
        'plugin-typescript': {
            meta: {
                'typescript/*': {
                    format: 'global'
                }
            }
        },
        'postcss-modules-local-by-default': {
            main: 'index.js'
        },
        'decamelize': {
            main: 'index.js'
        },
        'browserslist': {
            main: 'index.js'
        },
        'object-assign': {
            main: 'index.js'
        },
        'js-yaml': {
            main: 'index.js'
        },
        'normalize-range': {
            main: 'index.js'
        },
        'indexes-of': {
            main: 'index.js'
        },
        'normalize-url': {
            main: 'index.js'
        },
        'color': {
            main: 'index.js'
        },
        'color-convert': {
            main: 'index.js'
        },
        'postcss-normalize-charset': {
            main: 'index.js'
        },
        'is-svg': {
            main: 'index.js'
        },
        'query-string': {
            main: 'index.js'
        },
        'html-comment-regex': {
            main: 'index.js'
        },
        'strict-uri-encode': {
            main: 'index.js'
        },
        'sort-keys': {
            main: 'index.js'
        },
        'prepend-http': {
            main: 'index.js'
        },
        'is-plain-obj': {
            main: 'index.js'
        },
        'supports-color': {
            main: 'index.js'
        },
        'is-absolute-url': {
            main: 'index.js'
        },
        'postcss-calc': {
            main: 'index.js'
        },
        'reduce-css-calc': {
            main: 'index.js'
        },
        'postcss-message-helpers': {
            main: 'index.js'
        },
        'lodash.indexof': {
            main: 'index.js'
        },
        'reduce-function-call': {
            main: 'index.js'
        },
        'postcss-nested': {
            main: 'index.js'
        },
    }
});