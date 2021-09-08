"use strict";
var __assign = (this && this.__assign) || function () {
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = exports.DomHotkey = void 0;
var dom_1 = require("./dom");
var hotkeyStrings_1 = require("./hotkeyStrings");
var DomHotkey = /** @class */ (function () {
    function DomHotkey(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.root, root = _c === void 0 ? document : _c, _d = _b.attribute, attribute = _d === void 0 ? 'data-hotkey' : _d, _e = _b.initialKeyRepeat, initialKeyRepeat = _e === void 0 ? 500 : _e, _f = _b.keyRepeat, keyRepeat = _f === void 0 ? 0 : _f;
        this.root = root;
        this.attribute = attribute;
        this.initialKeyRepeat = initialKeyRepeat;
        this.keyRepeat = keyRepeat;
        this.keyState = {
            hotkeys: null,
            timeStamp: 0,
            count: 0,
        };
    }
    DomHotkey.prototype.reset = function () {
        this.keyState = {
            hotkeys: null,
            timeStamp: 0,
            count: 0,
        };
    };
    DomHotkey.prototype.updateKeyState = function (evt) {
        var hotkeys = (0, hotkeyStrings_1.createHotkeyStrings)(evt);
        if (this.keyState.hotkeys && this.keyState.hotkeys[0] === hotkeys[0]) {
            var elapsedTime = evt.timeStamp - this.keyState.timeStamp;
            if (elapsedTime <= this.keyRepeat)
                return false;
            if (this.keyState.count === 1 && elapsedTime <= this.initialKeyRepeat)
                return false;
            this.keyState.timeStamp = evt.timeStamp;
            this.keyState.count += 1;
        }
        else {
            this.keyState = {
                hotkeys: hotkeys,
                timeStamp: evt.timeStamp,
                count: 1,
            };
        }
        return true;
    };
    DomHotkey.prototype.fireDeterminedAction = function (hotkeys) {
        var _a = this, root = _a.root, attr = _a.attribute;
        return hotkeys.some(function (hotkey) {
            var elem = (0, dom_1.getElementByHotkeyString)(root, attr, hotkey);
            if (elem) {
                if ((0, dom_1.isFormField)(elem)) {
                    elem.focus();
                }
                else {
                    elem.click();
                }
                return true;
            }
            return false;
        });
    };
    DomHotkey.prototype.fire = function (evt) {
        if (evt.defaultPrevented) {
            return false;
        }
        if ((0, dom_1.isFormField)(evt.target)) {
            this.reset();
            return false;
        }
        if (!this.updateKeyState(evt)) {
            return false;
        }
        var hotkeys = this.keyState.hotkeys; // eslint-disable-line @typescript-eslint/no-non-null-assertion
        var fired = this.fireDeterminedAction(hotkeys);
        if (fired) {
            evt.preventDefault();
        }
        if (process.env.NODE_ENV === 'development' && !fired) {
            console.warn("No elements found matching \"" + hotkeys.join('" or "') + "\".");
            var _a = this, root = _a.root, attr_1 = _a.attribute;
            var errorMessages = Array.from(root.querySelectorAll("[" + attr_1 + "]"))
                .map(function (elem) { return ({
                element: elem,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                results: elem
                    .getAttribute(attr_1)
                    .split(',')
                    .map(function (hotkey) {
                    var state = {
                        modKey: false,
                        ctrlKey: false,
                        metaKey: false,
                        altKey: false,
                        shiftKey: false,
                        key: 'Unidentified',
                    };
                    var error = {
                        unnecessarySpaces: false,
                        unknownModifierKeys: false,
                        invalidOrder: false,
                        invalidKey: false,
                    };
                    var orderCount = 0;
                    hotkey.split(/\+(?=.)/).forEach(function (key) {
                        var stripedKey = key.replace(/\s+/g, '') || ' ';
                        error.unnecessarySpaces = error.unnecessarySpaces || key !== stripedKey;
                        if (/^c.*?tr/i.test(stripedKey)) {
                            error.unknownModifierKeys = error.unknownModifierKeys || stripedKey !== 'Control';
                            error.invalidOrder = error.invalidOrder || orderCount >= 1;
                            orderCount = 1;
                            state.ctrlKey = true;
                        }
                        else if (/^(?:meta|sup|win)/i.test(stripedKey)) {
                            error.unknownModifierKeys = error.unknownModifierKeys || stripedKey !== 'Meta';
                            error.invalidOrder = error.invalidOrder || orderCount >= 2;
                            orderCount = 2;
                            state.metaKey = true;
                        }
                        else if (/^(?:mod|co?m.*?d)/i.test(stripedKey)) {
                            error.unknownModifierKeys =
                                error.unknownModifierKeys || stripedKey !== 'Modifier';
                            error.invalidOrder = error.invalidOrder || orderCount !== 0;
                            orderCount = 3;
                            state.modKey = true;
                        }
                        else if (/^(?:alt|op)/i.test(stripedKey)) {
                            error.unknownModifierKeys = error.unknownModifierKeys || stripedKey !== 'Alt';
                            error.invalidOrder = error.invalidOrder || orderCount >= 4;
                            orderCount = 4;
                            state.altKey = true;
                        }
                        else if (/^shift/i.test(stripedKey)) {
                            error.unknownModifierKeys = error.unknownModifierKeys || stripedKey !== 'Shift';
                            error.invalidOrder = error.invalidOrder || orderCount >= 5;
                            orderCount = 5;
                            state.shiftKey = true;
                        }
                        else {
                            var validKey = stripedKey.length === 1
                                ? stripedKey.toLowerCase()
                                : stripedKey.charAt(0).toUpperCase() + stripedKey.slice(1);
                            error.invalidKey =
                                error.invalidKey || state.key !== 'Unidentified' || stripedKey !== validKey;
                            orderCount = 9;
                            if (/^[A-Z]$/.test(stripedKey))
                                state.shiftKey = true;
                            state.key = validKey;
                        }
                    });
                    return { hotkey: hotkey, state: state, error: error };
                }),
            }); })
                .filter(function (_a) {
                var results = _a.results;
                return results.some(function (_a) {
                    var error = _a.error;
                    return Object.values(error).some(function (v) { return v; });
                });
            })
                .map(function (_a) {
                var results = _a.results;
                var originalHotkeys = results.map(function (_a) {
                    var hotkey = _a.hotkey;
                    return hotkey;
                }).join(',');
                var lines = ["- '[" + attr_1 + "=\"" + originalHotkeys + "\"]':"];
                results.forEach(function (_a) {
                    var hotkey = _a.hotkey, error = _a.error;
                    if (!Object.values(error).some(function (v) { return v; }))
                        return;
                    var line = ["  - \"" + hotkey + "\":"];
                    if (error.invalidKey)
                        line.push('Wrong hotkey.');
                    if (error.invalidOrder)
                        line.push('Bad order.');
                    if (error.unknownModifierKeys)
                        line.push('Includes unknown modifier keys.');
                    if (error.unnecessarySpaces)
                        line.push('There are unnecessary spaces.');
                    lines.push(line.join(' '));
                });
                var recommendedHotkeys = results
                    .map(function (_a) {
                    var _b;
                    var state = _a.state;
                    return (0, hotkeyStrings_1.createHotkeyStringsFromState)(__assign(__assign({}, state), (state.modKey
                        ? (_b = {},
                            _b[hotkeyStrings_1.metaModifierKey ? 'metaKey' : 'ctrlKey'] = true,
                            _b) : {}))).reverse()[state.modKey ? 1 : 0];
                })
                    .join(',');
                if (originalHotkeys !== recommendedHotkeys)
                    lines.push("  - Did you mean '[" + attr_1 + "=\"" + recommendedHotkeys + "\"]'?");
                return lines.join('\n');
            });
            console.error(__spreadArray([
                "Found " + errorMessages.length + " elements with the wrong " + attr_1 + " attribute:"
            ], errorMessages, true).join('\n'));
        }
        return fired;
    };
    return DomHotkey;
}());
exports.DomHotkey = DomHotkey;
function setup(options) {
    if (options === void 0) { options = {}; }
    var domHotkey = new DomHotkey(options);
    var keydownHandler = function (evt) {
        domHotkey.fire(evt);
    };
    var keyupHandler = function () {
        domHotkey.reset();
    };
    var doc = domHotkey.root.ownerDocument || domHotkey.root;
    doc.addEventListener('keydown', keydownHandler);
    doc.addEventListener('keyup', keyupHandler);
    return function () {
        doc.removeEventListener('keydown', keydownHandler);
        doc.removeEventListener('keyup', keyupHandler);
    };
}
exports.setup = setup;
