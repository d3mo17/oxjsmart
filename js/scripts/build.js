var fs = require('fs'),
    rjs = require('requirejs'),
    UglifyJS = require('uglify-js');

rjs.optimize({
    optimize: 'none',

    baseUrl: 'src',
    paths: {
      'cestino': 'empty:',
      'sprintf-js/dist/sprintf.min': 'empty:',
      'jsmart/dist/jsmart.min': 'empty:'
    },
    include: [
      'OxJSmart'
    ],
    out: function (text, sourceMapText) {
        fs.writeFileSync('dist/oxjsmart.js', text);
        fs.writeFileSync(
            'dist/oxjsmart.min.js',
            UglifyJS.minify(text, {compress: {sequences: false}}).code
        );
    },
    wrap: {
        end: ["if (typeof define === 'function' && define.amd) {\n",
            "    define(['oxjsmart'], function (jSmart) { return jSmart; });\n",
            "}\n"
        ].join('')
    },

    preserveLicenseComments: false,
    skipModuleInsertion: true,
    findNestedDependencies: true
}, function (buildResponse) {
    console.log(buildResponse);
    resolve(buildResponse);
});