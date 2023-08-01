/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./node_modules/@aws-amplify/core/lib-esm/Util/Constants.js
/*
 * Copyright 2017-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */
// Logging constants
var AWS_CLOUDWATCH_BASE_BUFFER_SIZE = 26;
var AWS_CLOUDWATCH_MAX_BATCH_EVENT_SIZE = 1048576;
var AWS_CLOUDWATCH_MAX_EVENT_SIZE = 256000;
var AWS_CLOUDWATCH_CATEGORY = 'Logging';
var AWS_CLOUDWATCH_PROVIDER_NAME = 'AWSCloudWatch';
var NO_CREDS_ERROR_STRING = 'No credentials';
var RETRY_ERROR_CODES = (/* unused pure expression or super */ null && ([
    'ResourceNotFoundException',
    'InvalidSequenceTokenException',
]));

//# sourceMappingURL=Constants.js.map
;// CONCATENATED MODULE: ./node_modules/@aws-amplify/core/lib-esm/Logger/ConsoleLogger.js
/*
 * Copyright 2017-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */
var __values = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};

var LOG_LEVELS = {
    VERBOSE: 1,
    DEBUG: 2,
    INFO: 3,
    WARN: 4,
    ERROR: 5,
};
var LOG_TYPE;
(function (LOG_TYPE) {
    LOG_TYPE["DEBUG"] = "DEBUG";
    LOG_TYPE["ERROR"] = "ERROR";
    LOG_TYPE["INFO"] = "INFO";
    LOG_TYPE["WARN"] = "WARN";
    LOG_TYPE["VERBOSE"] = "VERBOSE";
})(LOG_TYPE || (LOG_TYPE = {}));
/**
 * Write logs
 * @class Logger
 */
var ConsoleLogger = /** @class */ (function () {
    /**
     * @constructor
     * @param {string} name - Name of the logger
     */
    function ConsoleLogger(name, level) {
        if (level === void 0) { level = LOG_TYPE.WARN; }
        this.name = name;
        this.level = level;
        this._pluggables = [];
    }
    ConsoleLogger.prototype._padding = function (n) {
        return n < 10 ? '0' + n : '' + n;
    };
    ConsoleLogger.prototype._ts = function () {
        var dt = new Date();
        return ([this._padding(dt.getMinutes()), this._padding(dt.getSeconds())].join(':') +
            '.' +
            dt.getMilliseconds());
    };
    ConsoleLogger.prototype.configure = function (config) {
        if (!config)
            return this._config;
        this._config = config;
        return this._config;
    };
    /**
     * Write log
     * @method
     * @memeberof Logger
     * @param {LOG_TYPE|string} type - log type, default INFO
     * @param {string|object} msg - Logging message or object
     */
    ConsoleLogger.prototype._log = function (type) {
        var e_1, _a;
        var msg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            msg[_i - 1] = arguments[_i];
        }
        var logger_level_name = this.level;
        if (ConsoleLogger.LOG_LEVEL) {
            logger_level_name = ConsoleLogger.LOG_LEVEL;
        }
        if (typeof window !== 'undefined' && window.LOG_LEVEL) {
            logger_level_name = window.LOG_LEVEL;
        }
        var logger_level = LOG_LEVELS[logger_level_name];
        var type_level = LOG_LEVELS[type];
        if (!(type_level >= logger_level)) {
            // Do nothing if type is not greater than or equal to logger level (handle undefined)
            return;
        }
        var log = console.log.bind(console);
        if (type === LOG_TYPE.ERROR && console.error) {
            log = console.error.bind(console);
        }
        if (type === LOG_TYPE.WARN && console.warn) {
            log = console.warn.bind(console);
        }
        var prefix = "[" + type + "] " + this._ts() + " " + this.name;
        var message = '';
        if (msg.length === 1 && typeof msg[0] === 'string') {
            message = prefix + " - " + msg[0];
            log(message);
        }
        else if (msg.length === 1) {
            message = prefix + " " + msg[0];
            log(prefix, msg[0]);
        }
        else if (typeof msg[0] === 'string') {
            var obj = msg.slice(1);
            if (obj.length === 1) {
                obj = obj[0];
            }
            message = prefix + " - " + msg[0] + " " + obj;
            log(prefix + " - " + msg[0], obj);
        }
        else {
            message = prefix + " " + msg;
            log(prefix, msg);
        }
        try {
            for (var _b = __values(this._pluggables), _c = _b.next(); !_c.done; _c = _b.next()) {
                var plugin = _c.value;
                var logEvent = { message: message, timestamp: Date.now() };
                plugin.pushLogs([logEvent]);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    /**
     * Write General log. Default to INFO
     * @method
     * @memeberof Logger
     * @param {string|object} msg - Logging message or object
     */
    ConsoleLogger.prototype.log = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        this._log.apply(this, __spread([LOG_TYPE.INFO], msg));
    };
    /**
     * Write INFO log
     * @method
     * @memeberof Logger
     * @param {string|object} msg - Logging message or object
     */
    ConsoleLogger.prototype.info = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        this._log.apply(this, __spread([LOG_TYPE.INFO], msg));
    };
    /**
     * Write WARN log
     * @method
     * @memeberof Logger
     * @param {string|object} msg - Logging message or object
     */
    ConsoleLogger.prototype.warn = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        this._log.apply(this, __spread([LOG_TYPE.WARN], msg));
    };
    /**
     * Write ERROR log
     * @method
     * @memeberof Logger
     * @param {string|object} msg - Logging message or object
     */
    ConsoleLogger.prototype.error = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        this._log.apply(this, __spread([LOG_TYPE.ERROR], msg));
    };
    /**
     * Write DEBUG log
     * @method
     * @memeberof Logger
     * @param {string|object} msg - Logging message or object
     */
    ConsoleLogger.prototype.debug = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        this._log.apply(this, __spread([LOG_TYPE.DEBUG], msg));
    };
    /**
     * Write VERBOSE log
     * @method
     * @memeberof Logger
     * @param {string|object} msg - Logging message or object
     */
    ConsoleLogger.prototype.verbose = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        this._log.apply(this, __spread([LOG_TYPE.VERBOSE], msg));
    };
    ConsoleLogger.prototype.addPluggable = function (pluggable) {
        if (pluggable && pluggable.getCategoryName() === AWS_CLOUDWATCH_CATEGORY) {
            this._pluggables.push(pluggable);
            pluggable.configure(this._config);
        }
    };
    ConsoleLogger.prototype.listPluggables = function () {
        return this._pluggables;
    };
    ConsoleLogger.LOG_LEVEL = null;
    return ConsoleLogger;
}());

//# sourceMappingURL=ConsoleLogger.js.map
;// CONCATENATED MODULE: ./node_modules/@aws-amplify/core/lib-esm/Hub.js
/*
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var Hub_read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var Hub_spread = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(Hub_read(arguments[i]));
    return ar;
};

var logger = new ConsoleLogger('Hub');
var AMPLIFY_SYMBOL = (typeof Symbol !== 'undefined' &&
    typeof Symbol.for === 'function'
    ? Symbol.for('amplify_default')
    : '@@amplify_default');
function isLegacyCallback(callback) {
    return callback.onHubCapsule !== undefined;
}
var HubClass = /** @class */ (function () {
    function HubClass(name) {
        this.listeners = [];
        this.patterns = [];
        this.protectedChannels = [
            'core',
            'auth',
            'api',
            'analytics',
            'interactions',
            'pubsub',
            'storage',
            'xr',
        ];
        this.name = name;
    }
    // Note - Need to pass channel as a reference for removal to work and not anonymous function
    HubClass.prototype.remove = function (channel, listener) {
        if (channel instanceof RegExp) {
            var pattern_1 = this.patterns.find(function (_a) {
                var pattern = _a.pattern;
                return pattern.source === channel.source;
            });
            if (!pattern_1) {
                logger.warn("No listeners for " + channel);
                return;
            }
            this.patterns = Hub_spread(this.patterns.filter(function (x) { return x !== pattern_1; }));
        }
        else {
            var holder = this.listeners[channel];
            if (!holder) {
                logger.warn("No listeners for " + channel);
                return;
            }
            this.listeners[channel] = Hub_spread(holder.filter(function (_a) {
                var callback = _a.callback;
                return callback !== listener;
            }));
        }
    };
    HubClass.prototype.dispatch = function (channel, payload, source, ampSymbol) {
        if (source === void 0) { source = ''; }
        if (this.protectedChannels.indexOf(channel) > -1) {
            var hasAccess = ampSymbol === AMPLIFY_SYMBOL;
            if (!hasAccess) {
                logger.warn("WARNING: " + channel + " is protected and dispatching on it can have unintended consequences");
            }
        }
        var capsule = {
            channel: channel,
            payload: __assign({}, payload),
            source: source,
            patternInfo: [],
        };
        try {
            this._toListeners(capsule);
        }
        catch (e) {
            logger.error(e);
        }
    };
    HubClass.prototype.listen = function (channel, callback, listenerName) {
        var _this = this;
        if (listenerName === void 0) { listenerName = 'noname'; }
        var cb;
        // Check for legacy onHubCapsule callback for backwards compatability
        if (isLegacyCallback(callback)) {
            logger.warn("WARNING onHubCapsule is Deprecated. Please pass in a callback.");
            cb = callback.onHubCapsule.bind(callback);
        }
        else if (typeof callback !== 'function') {
            throw new Error('No callback supplied to Hub');
        }
        else {
            cb = callback;
        }
        if (channel instanceof RegExp) {
            this.patterns.push({
                pattern: channel,
                callback: cb,
            });
        }
        else {
            var holder = this.listeners[channel];
            if (!holder) {
                holder = [];
                this.listeners[channel] = holder;
            }
            holder.push({
                name: listenerName,
                callback: cb,
            });
        }
        return function () {
            _this.remove(channel, cb);
        };
    };
    HubClass.prototype._toListeners = function (capsule) {
        var channel = capsule.channel, payload = capsule.payload;
        var holder = this.listeners[channel];
        if (holder) {
            holder.forEach(function (listener) {
                logger.debug("Dispatching to " + channel + " with ", payload);
                try {
                    listener.callback(capsule);
                }
                catch (e) {
                    logger.error(e);
                }
            });
        }
        if (this.patterns.length > 0) {
            if (!payload.message) {
                logger.warn("Cannot perform pattern matching without a message key");
                return;
            }
            var payloadStr_1 = payload.message;
            this.patterns.forEach(function (pattern) {
                var match = payloadStr_1.match(pattern.pattern);
                if (match) {
                    var _a = Hub_read(match), groups = _a.slice(1);
                    var dispatchingCapsule = __assign(__assign({}, capsule), { patternInfo: groups });
                    try {
                        pattern.callback(dispatchingCapsule);
                    }
                    catch (e) {
                        logger.error(e);
                    }
                }
            });
        }
    };
    return HubClass;
}());

/*We export a __default__ instance of HubClass to use it as a
psuedo Singleton for the main messaging bus, however you can still create
your own instance of HubClass() for a separate "private bus" of events.*/
var Hub = new HubClass('__default__');
/**
 * @deprecated use named import
 */
/* harmony default export */ const lib_esm_Hub = ((/* unused pure expression or super */ null && (Hub)));
//# sourceMappingURL=Hub.js.map
;// CONCATENATED MODULE: ./index.js


const postAuthentication = () => {}

Hub.listen('auth', postAuthentication)

/******/ })()
;