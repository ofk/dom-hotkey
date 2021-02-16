"use strict";
// HotkeyState's shiftKey is differnt from KeyboardEvent.
//
// | typing      | KeyboardEvent                | HotkeyState                   |
// | ----------- | ---------------------------- | ----------------------------- |
// | A (Shift+a) | { shiftKey: true, key: 'A' } | { shiftKey: true, key: 'a' }  |
// | ! (Shift+1) | { shiftKey: true, key: '!' } | { shiftKey: false, key: '!' } |
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHotkeyState = void 0;
var regModifierKeys = /^(?:Control|Meta|Alt|Shift)$/;
function createHotkeyState(_a) {
    var ctrlKey = _a.ctrlKey, metaKey = _a.metaKey, shiftKey = _a.shiftKey, key = _a.key;
    var fixedShiftKey = shiftKey && (key.length > 1 || key.toLowerCase() !== key.toUpperCase());
    return {
        ctrlKey: ctrlKey,
        metaKey: metaKey,
        shiftKey: fixedShiftKey,
        // eslint-disable-next-line no-nested-ternary
        key: regModifierKeys.test(key)
            ? 'Unidentified'
            : fixedShiftKey && key.length === 1
                ? key.toLowerCase()
                : key,
    };
}
exports.createHotkeyState = createHotkeyState;
