"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getElementByHotkeyString = exports.isFormField = void 0;
function isFormField(elem) {
    if (!(elem instanceof HTMLElement)) {
        return false;
    }
    var name = elem.tagName;
    var type = (elem.getAttribute('type') || '').toLowerCase();
    return !!(name === 'SELECT' ||
        name === 'TEXTAREA' ||
        (name === 'INPUT' &&
            type !== 'submit' &&
            type !== 'reset' &&
            type !== 'checkbox' &&
            type !== 'radio') ||
        elem.isContentEditable);
}
exports.isFormField = isFormField;
function getElementByHotkeyString(root, attr, hotkey) {
    var value = CSS.escape(hotkey);
    return root.querySelector("[" + attr + "=\"" + value + "\"],[" + attr + "^=\"" + value + ",\"],[" + attr + "*=\"," + value + ",\"],[" + attr + "$=\"," + value + "\"]");
}
exports.getElementByHotkeyString = getElementByHotkeyString;
