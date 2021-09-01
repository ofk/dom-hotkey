"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHotkeyStrings = exports.createHotkeyStringsFromState = exports.metaModifierKey = void 0;
var hotkeyState_1 = require("./hotkeyState");
exports.metaModifierKey = /Mac|iPod|iPhone|iPad/.test(typeof navigator !== 'undefined' ? navigator.platform : '');
function isModkey(_a) {
    var ctrlKey = _a.ctrlKey, metaKey = _a.metaKey;
    return exports.metaModifierKey ? /* istanbul ignore next */ !ctrlKey && metaKey : ctrlKey && !metaKey;
}
function toCtrlMetaStringFromState(_a) {
    var ctrlKey = _a.ctrlKey, metaKey = _a.metaKey;
    return "" + (ctrlKey ? '+Control' : '') + (metaKey ? '+Meta' : '');
}
function toShiftKeyStringFromState(_a) {
    var shiftKey = _a.shiftKey, key = _a.key;
    return "" + (shiftKey ? '+Shift' : '') + (key !== 'Unidentified' ? "+" + key : '');
}
function createHotkeyStringsFromState(state) {
    var partialHotkey = toShiftKeyStringFromState(state);
    var hotkey = ("" + toCtrlMetaStringFromState(state) + partialHotkey).slice(1);
    // eslint-disable-next-line no-nested-ternary
    return !hotkey
        ? /* istanbul ignore next */
            ['Unidentified']
        : isModkey(state)
            ? ["Modifier" + partialHotkey, hotkey]
            : [hotkey];
}
exports.createHotkeyStringsFromState = createHotkeyStringsFromState;
function createHotkeyStrings(evt) {
    return createHotkeyStringsFromState(hotkeyState_1.createHotkeyState(evt));
}
exports.createHotkeyStrings = createHotkeyStrings;
