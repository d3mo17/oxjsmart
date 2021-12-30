/**
 * @param   {Object} root
 * @param   {Function} factory
 *
 * @returns {Object}
 */
 (function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('OxJSmart',[
            'jsmart/dist/jsmart.min',
            'sprintf-js/dist/sprintf.min',
            'cestino/PriceFormatter'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(
            require('jsmart'),
            require('sprintf-js'),
            require('cestino/src/PriceFormatter')
        );
    } else {
        root.OxJSmart = factory(root.jSmart, root, root.Cestino.PriceFormatter);
    }
}(this, function (jSmart, Util, PriceFormatter) {
    "use strict";

    var moduleAPI, scriptCode = [], scriptURLs = [], scriptURLsPrio = {};

    /**
     * A wrapper for jSmart that implements some additional template-tags used with oxid eSales shop
     * @module OxJSmart
     * @requires jSmart
     * @requires sprintf-js
     * @requires Cestino/PriceFormatter
     */

    /**
     * @param {Object} keyToValues
     */
    function _oxmultilang(keyToValues) {
        this.prototype.registerPlugin(
            'function',
            'oxmultilang',
            function (params) {
                var args = ('args' in params) ? params['args'] : '';

                if ('ident' in params) {
                    return Array.isArray(args)
                        ? Util.vsprintf(keyToValues[params['ident']], args)
                        : Util.sprintf(keyToValues[params['ident']], args);
                }
                return '';
            }
        );
    }

    /**
     * Smarty [{oxhasrights}][{/oxhasrights}] block plugin
     *
     * Purpose: checks if user has rights to view block of data
     */
    jSmart.prototype.registerPlugin(
        'block',
        'oxhasrights',
        function (params, data) {
            return data;
        }
    );

    /**
     * Purpose: Output price string
     * add [{oxprice price="..." currency="..."}] where you want to display content
     * price - decimal number: 13; 12.45; 13.01;
     * currency - currency abbreviation: EUR, USD, LTL etc.
     */
    jSmart.prototype.registerPlugin(
        'function',
        'oxprice',
        function (params) {
            var attr, oCurrency = {
                dec: ',',
                thousand: '.',
                sign: '',
                side: '',
                decimal: 2
            };

            if ('currency' in params && typeof params['currency'] === 'object') {
                for (attr in params['currency']) {
                    oCurrency[attr] = params['currency'][attr];
                }
            }

            var price     = ('price' in params) ? parseInt(params['price'], 10) : 0;
            var formatter = PriceFormatter.create(oCurrency.dec, oCurrency.thousand, oCurrency.decimal);

            return (
                oCurrency.side === 'Front'
                ? oCurrency.sign + formatter.format(price)
                : formatter.format(price) + ' ' + oCurrency.sign
            );
        }
    );

    /**
     * Add [{oxscript add="oxid.popup.load();"}] to add script call.
     * Add [{oxscript include="oxid.js"}] to include local javascript file.
     * Add [{oxscript include="oxid.js?20120413"}] to include local javascript file with query string part.
     * Add [{oxscript include="http://www.oxid-esales.com/oxid.js"}] to include external javascript file.
     *
     * IMPORTANT!
     * Do not forget to add plain [{oxscript}] tag before closing body tag, to output all collected script includes and calls.
     */
    jSmart.prototype.registerPlugin(
        'function',
        'oxscript',
        function (params) {
            var output     = '',
                priority   = params['priority'] ? params['priority'] : 3;

            if ('add' in params) {
                if (!params['add']) {
                    // TODO: $smarty->trigger_error("{oxscript} parameter 'add' can not be empty!");
                    return '';
                }

                if (scriptCode.indexOf(params['add']) === -1) {
                    scriptCode.push(params['add']);
                }
            } else if ('include' in params) {
                if (!params['include']) {
                    // TODO: $smarty->trigger_error("{oxscript} parameter 'include' can not be empty!");
                    return '';
                }

                if (scriptURLs.indexOf(params['include']) === -1) {
                    scriptURLs.push(params['include']);
                    scriptURLsPrio[priority] = scriptURLsPrio[priority] || [];
                    scriptURLsPrio[priority].push(params['include']);
                }
            }

            return output;
        }
    );

    /**
     * @param {String} srcOrCode
     * @param {Boolean} load
     */
    function _executeScript(srcOrCode, load) {
        var head = document.head || document.getElementsByTagName('head')[0];
        var script = document.createElement('script');

        if (load) {
            script.src = srcOrCode;
        } else {
            script.text = srcOrCode;
        }
      
        head.appendChild(script);
    }

    /**
     */
    function _clearScripts() {
        scriptCode = [];
        scriptURLs = [];
        scriptURLsPrio = {};
    }

    /**
     */
    function _applyScripts() {
        Object.keys(scriptURLsPrio).sort(function(a, b) {
            return a.length > b.length || a.length == b.length && a > b
        }).forEach(function (priority) {
            scriptURLsPrio[priority].forEach(function (url) {
                _executeScript(url, true);
            })
        });
        
        scriptCode.length && _executeScript("\n" + scriptCode.join("\n"));
        _clearScripts();
    }

    /**
     * Other than the original plugin, this will output the value of parameter ident
     * and ignores all other parameters. Feel free to override this plugin-function to fetch
     * the seourl for example by ajax-request from oxid ...
     */
    jSmart.prototype.registerPlugin(
        'function',
        'oxgetseourl',
        function (params) {
            return params['ident'] || '';
        }
    );

    /**
     * Purpose:  Converts integer (seconds) type value to time (hh:mm:ss) format
     * Example:  {$seconds|oxformattime}
     */
    jSmart.prototype.registerPlugin(
        'modifier',
        'oxformattime',
        function (seconds) {
            var hours = Math.floor(seconds / 3600),
                mins  = Math.floor(seconds % 3600 / 60),
                secs  = seconds % 60;

            return Util.sprintf("%02d:%02d:%02d", hours, mins, secs);
        }
    );

    moduleAPI = {
        /**
         * Sets the key-value pairs for translation texts
         * @alias module:OxJSmart.setLanguageKeys
         * @param {Object} keyToValues
         */
        setLanguageKeys: _oxmultilang.bind(jSmart),
        /**
         * Run all in template collected scripts and remove them afterwards
         * @alias   module:OxJSmart.applyScripts
         */
        applyScripts: _applyScripts,
        /**
         * Removes all in template collected scripts
         * @alias   module:OxJSmart.clearScripts
         */
        clearScripts: _clearScripts,
        /**
         * Use this to register new plugins to the smarty engine
         * @alias   module:OxJSmart.registerPlugin
         * @param   {String} type Example values: "modifier", "function", "compiler", "block", "insert", "prefilter"
         * @param   {String} name Name for template-tag
         * @param   {Function} callback The processing function
         */
        registerPlugin: jSmart.prototype.registerPlugin,
        /**
         * Creates an object of type jSmart; The main object.
         * @alias   module:OxJSmart.create
         * @param   {String} tpl Template to parse
         * @param   {Object} [options] Option passed to the Smarty-engine
         * @param   {String} [options.ldelim='[{']
         * @param   {String} [options.rdelim='}]']
         * @param   {Boolean} [options.autoLiteral=true]
         * @param   {Boolean} [options.debugging=false]
         * @param   {Boolean} [options.escapeHtml=false]
         * 
         * @returns {jSmart}
         */
        create: function (tpl, options) {
            var attr, opts, defaults = {ldelim: '[{', rdelim: '}]'};
            
            // clone defaults ... (Does only work with plain objects, don't use it e. g. to clone
            // Date-object values)
            opts = JSON.parse(JSON.stringify(defaults));
            if (options && typeof options === 'object') {
                for (attr in options) {
                    opts[attr] = options[attr];
                }
            }
    
            return new this(tpl, opts);
        }.bind(jSmart)
    };

    return moduleAPI;
}));
if (typeof define === 'function' && define.amd) {
    define(['oxjsmart'], function (jSmart) { return jSmart; });
}
