import { getElementByHotkeyString, isFormField } from './dom';
import type { HotkeyStrings } from './hotkeyStrings';
import {
  createHotkeyStrings,
  createHotkeyStringsFromState,
  metaModifierKey,
} from './hotkeyStrings';

export class DomHotkey {
  root: HTMLElement | Document;

  attribute: string;

  initialKeyRepeat: number;

  keyRepeat: number;

  keyState: {
    hotkeys: HotkeyStrings | null;
    timeStamp: number;
    count: number;
  };

  constructor({
    root = document,
    attribute = 'data-hotkey',
    initialKeyRepeat = 500,
    keyRepeat = 0,
  } = {}) {
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

  reset(): void {
    this.keyState = {
      hotkeys: null,
      timeStamp: 0,
      count: 0,
    };
  }

  updateKeyState(evt: KeyboardEvent): boolean {
    const hotkeys = createHotkeyStrings(evt);
    if (this.keyState.hotkeys && this.keyState.hotkeys[0] === hotkeys[0]) {
      const elapsedTime = evt.timeStamp - this.keyState.timeStamp;
      if (elapsedTime <= this.keyRepeat) return false;
      if (this.keyState.count === 1 && elapsedTime <= this.initialKeyRepeat) return false;
      this.keyState.timeStamp = evt.timeStamp;
      this.keyState.count += 1;
    } else {
      this.keyState = {
        hotkeys,
        timeStamp: evt.timeStamp,
        count: 1,
      };
    }
    return true;
  }

  fireDeterminedAction(hotkeys: HotkeyStrings): boolean {
    const { root, attribute: attr } = this;
    return hotkeys.some((hotkey) => {
      const elem = getElementByHotkeyString(root, attr, hotkey);
      if (elem) {
        if (isFormField(elem)) {
          elem.focus();
        } else {
          elem.click();
        }
        return true;
      }
      return false;
    });
  }

  fire(evt: KeyboardEvent): boolean {
    if (evt.defaultPrevented) {
      return false;
    }

    if (isFormField(evt.target)) {
      this.reset();
      return false;
    }

    if (!this.updateKeyState(evt)) {
      return false;
    }

    const hotkeys = this.keyState.hotkeys!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    const fired = this.fireDeterminedAction(hotkeys);
    if (fired) {
      evt.preventDefault();
    }

    if (process.env.NODE_ENV === 'development' && !fired) {
      console.warn(`No elements found matching "${hotkeys.join('" or "')}".`);

      const { root, attribute: attr } = this;
      const errorMessages = Array.from(root.querySelectorAll<HTMLElement>(`[${attr}]`))
        .map((elem) => ({
          element: elem,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          results: elem
            .getAttribute(attr)!
            .split(',')
            .map((hotkey) => {
              const state = {
                modKey: false,
                ctrlKey: false,
                metaKey: false,
                altKey: false,
                shiftKey: false,
                key: 'Unidentified',
              };
              const error = {
                unnecessarySpaces: false,
                unknownModifierKeys: false,
                invalidOrder: false,
                invalidKey: false,
              };
              let orderCount = 0;
              hotkey.split(/\+(?=.)/).forEach((key) => {
                const stripedKey = key.replace(/\s+/g, '') || ' ';
                error.unnecessarySpaces = error.unnecessarySpaces || key !== stripedKey;
                if (/^c.*?tr/i.test(stripedKey)) {
                  error.unknownModifierKeys = error.unknownModifierKeys || stripedKey !== 'Control';
                  error.invalidOrder = error.invalidOrder || orderCount >= 1;
                  orderCount = 1;
                  state.ctrlKey = true;
                } else if (/^(?:meta|sup|win)/i.test(stripedKey)) {
                  error.unknownModifierKeys = error.unknownModifierKeys || stripedKey !== 'Meta';
                  error.invalidOrder = error.invalidOrder || orderCount >= 2;
                  orderCount = 2;
                  state.metaKey = true;
                } else if (/^(?:mod|co?m.*?d)/i.test(stripedKey)) {
                  error.unknownModifierKeys =
                    error.unknownModifierKeys || stripedKey !== 'Modifier';
                  error.invalidOrder = error.invalidOrder || orderCount !== 0;
                  orderCount = 3;
                  state.modKey = true;
                } else if (/^(?:alt|op)/i.test(stripedKey)) {
                  error.unknownModifierKeys = error.unknownModifierKeys || stripedKey !== 'Alt';
                  error.invalidOrder = error.invalidOrder || orderCount >= 4;
                  orderCount = 4;
                  state.altKey = true;
                } else if (/^shift/i.test(stripedKey)) {
                  error.unknownModifierKeys = error.unknownModifierKeys || stripedKey !== 'Shift';
                  error.invalidOrder = error.invalidOrder || orderCount >= 5;
                  orderCount = 5;
                  state.shiftKey = true;
                } else {
                  const validKey =
                    stripedKey.length === 1
                      ? stripedKey.toLowerCase()
                      : stripedKey.charAt(0).toUpperCase() + stripedKey.slice(1);
                  error.invalidKey =
                    error.invalidKey || state.key !== 'Unidentified' || stripedKey !== validKey;
                  orderCount = 9;
                  if (/^[A-Z]$/.test(stripedKey)) state.shiftKey = true;
                  state.key = validKey;
                }
              });
              return { hotkey, state, error };
            }),
        }))
        .filter(({ results }) => results.some(({ error }) => Object.values(error).some((v) => v)))
        .map(({ results }) => {
          const originalHotkeys = results.map(({ hotkey }) => hotkey).join(',');
          const lines = [`- '[${attr}="${originalHotkeys}"]':`];
          results.forEach(({ hotkey, error }) => {
            if (!Object.values(error).some((v) => v)) return;

            const line = [`  - "${hotkey}":`];
            if (error.invalidKey) line.push('Wrong hotkey.');
            if (error.invalidOrder) line.push('Bad order.');
            if (error.unknownModifierKeys) line.push('Includes unknown modifier keys.');
            if (error.unnecessarySpaces) line.push('There are unnecessary spaces.');
            lines.push(line.join(' '));
          });
          const recommendedHotkeys = results
            .map(
              ({ state }) =>
                createHotkeyStringsFromState({
                  ...state,
                  ...(state.modKey
                    ? {
                        [metaModifierKey ? 'metaKey' : 'ctrlKey']: true,
                      }
                    : {}),
                }).reverse()[state.modKey ? 1 : 0]
            )
            .join(',');
          if (originalHotkeys !== recommendedHotkeys)
            lines.push(`  - Did you mean '[${attr}="${recommendedHotkeys}"]'?`);
          return lines.join('\n');
        });
      console.error(
        [
          `Found ${errorMessages.length} elements with the wrong ${attr} attribute:`,
          ...errorMessages,
        ].join('\n')
      );
    }

    return fired;
  }
}

export function setup(
  options: NonNullable<ConstructorParameters<typeof DomHotkey>[0]> = {}
): () => void {
  const domHotkey = new DomHotkey(options);
  const keydownHandler = (evt: KeyboardEvent): void => {
    domHotkey.fire(evt);
  };
  const keyupHandler = (): void => {
    domHotkey.reset();
  };

  const doc = domHotkey.root.ownerDocument || domHotkey.root;
  doc.addEventListener('keydown', keydownHandler);
  doc.addEventListener('keyup', keyupHandler);

  return (): void => {
    doc.removeEventListener('keydown', keydownHandler);
    doc.removeEventListener('keyup', keyupHandler);
  };
}
