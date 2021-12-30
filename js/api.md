<a name="module_OxJSmart"></a>

## OxJSmart
A wrapper for jSmart that implements some additional template-tags used with oxid eSales shop

**Requires**: <code>module:jSmart</code>, <code>module:sprintf-js</code>, <code>module:Cestino/PriceFormatter</code>  

* [OxJSmart](#module_OxJSmart)
    * [.setLanguageKeys](#module_OxJSmart.setLanguageKeys)
    * [.applyScripts](#module_OxJSmart.applyScripts)
    * [.clearScripts](#module_OxJSmart.clearScripts)
    * [.registerPlugin](#module_OxJSmart.registerPlugin)
    * [.create](#module_OxJSmart.create) ⇒ <code>jSmart</code>


* * *

<a name="module_OxJSmart.setLanguageKeys"></a>

### OxJSmart.setLanguageKeys
Sets the key-value pairs for translation texts

**Kind**: static property of [<code>OxJSmart</code>](#module_OxJSmart)  

| Param | Type |
| --- | --- |
| keyToValues | <code>Object</code> | 


* * *

<a name="module_OxJSmart.applyScripts"></a>

### OxJSmart.applyScripts
Run all in template collected scripts and remove them afterwards

**Kind**: static property of [<code>OxJSmart</code>](#module_OxJSmart)  

* * *

<a name="module_OxJSmart.clearScripts"></a>

### OxJSmart.clearScripts
Removes all in template collected scripts

**Kind**: static property of [<code>OxJSmart</code>](#module_OxJSmart)  

* * *

<a name="module_OxJSmart.registerPlugin"></a>

### OxJSmart.registerPlugin
Use this to register new plugins to the smarty engine

**Kind**: static property of [<code>OxJSmart</code>](#module_OxJSmart)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>String</code> | Example values: "modifier", "function", "compiler", "block", "insert", "prefilter" |
| name | <code>String</code> | Name for template-tag |
| callback | <code>function</code> | The processing function |


* * *

<a name="module_OxJSmart.create"></a>

### OxJSmart.create ⇒ <code>jSmart</code>
Creates an object of type jSmart; The main object.

**Kind**: static property of [<code>OxJSmart</code>](#module_OxJSmart)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| tpl | <code>String</code> |  | Template to parse |
| [options] | <code>Object</code> |  | Option passed to the Smarty-engine |
| [options.ldelim] | <code>String</code> | <code>&#x27;[{&#x27;</code> |  |
| [options.rdelim] | <code>String</code> | <code>&#x27;}]&#x27;</code> |  |
| [options.autoLiteral] | <code>Boolean</code> | <code>true</code> |  |
| [options.debugging] | <code>Boolean</code> | <code>false</code> |  |
| [options.escapeHtml] | <code>Boolean</code> | <code>false</code> |  |


* * *

