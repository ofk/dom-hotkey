import { fireDeterminedAction, getElementByHotkeyString, isFormField } from './dom';
import type { HotkeyState } from './hotkeyState';
import { copyAsHotkeyState, equalHotkeyState, isModifierKeyPressed } from './hotkeyState';
import { createHotkeyStrings } from './hotkeyStrings';

export class DOMHotkey {
  root: HTMLElement | Document;

  attribute: string;

  initialKeyRepeat: number;

  keyRepeat: number;

  resetKey: number;

  keys: {
    state: HotkeyState;
    timeStamp: number;
    pressed: boolean;
  }[];

  constructor({
    root = document as DOMHotkey['root'],
    attribute = 'data-hotkey',
    initialKeyRepeat = 500,
    keyRepeat = 0,
    resetKey = 1500,
  } = {}) {
    this.root = root;
    this.attribute = attribute;
    this.initialKeyRepeat = initialKeyRepeat;
    this.keyRepeat = keyRepeat;
    this.resetKey = resetKey;
    this.keys = [];
  }

  reset(): void {
    this.keys.splice(0, this.keys.length);
  }

  updateKeys(evt: KeyboardEvent): boolean {
    const state = copyAsHotkeyState(evt);
    if (isModifierKeyPressed(state)) {
      this.reset();
    } else {
      const keyStateForReset = this.keys[this.keys.length - 1];
      if (
        keyStateForReset &&
        (isModifierKeyPressed(keyStateForReset.state) ||
          evt.timeStamp - keyStateForReset.timeStamp > this.resetKey)
      ) {
        this.reset();
      }
    }

    const key = this.keys[this.keys.length - 1];
    const pressed = !!key && equalHotkeyState(key.state, state);
    if (pressed) {
      const elapsedTime = evt.timeStamp - key.timeStamp;
      if (elapsedTime <= this.keyRepeat) return false;
      if (!key.pressed && elapsedTime <= this.initialKeyRepeat) return false;
      key.pressed = true;
    }
    this.keys.push({
      state,
      timeStamp: evt.timeStamp,
      pressed,
    });
    return true;
  }

  fire(): boolean {
    return [...this.keys]
      .reverse()
      .reduce((hotkeys, key) => {
        const hotkeyStrings = createHotkeyStrings(key.state);
        return hotkeys[0] ? [`${hotkeyStrings[0]} ${hotkeys[0]}`, ...hotkeys] : hotkeyStrings;
      }, [] as string[])
      .some((hotkey) => {
        const elem = getElementByHotkeyString(this.root, this.attribute, hotkey);
        if (elem) {
          fireDeterminedAction(elem);
          return true;
        }
        return false;
      });
  }

  keyup(evt: KeyboardEvent): void {
    const state = copyAsHotkeyState(evt);
    const key = this.keys[this.keys.length - 1];
    if (key && equalHotkeyState(key.state, state)) {
      key.pressed = true;
    }
  }

  keydown(evt: KeyboardEvent): boolean {
    /* istanbul ignore next */
    if (evt.defaultPrevented) {
      return true;
    }
    if (isFormField(evt.target)) {
      this.reset();
      return true;
    }
    if (!this.updateKeys(evt)) {
      return true;
    }
    if (this.fire()) {
      evt.preventDefault();
      return true;
    }
    return false;
  }
}
