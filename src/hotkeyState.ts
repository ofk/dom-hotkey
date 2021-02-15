// HotkeyState's shiftKey is differnt from KeyboardEvent.
//
// | typing      | KeyboardEvent                | HotkeyState                   |
// | ----------- | ---------------------------- | ----------------------------- |
// | A (Shift+a) | { shiftKey: true, key: 'A' } | { shiftKey: true, key: 'a' }  |
// | ! (Shift+1) | { shiftKey: true, key: '!' } | { shiftKey: false, key: '!' } |

export interface HotkeyState {
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  key: string;
}

const regModifierKeys = /^(?:Control|Meta|Alt|Shift)$/;

export function createHotkeyState({
  ctrlKey,
  metaKey,
  shiftKey,
  key,
}: Pick<KeyboardEvent, 'ctrlKey' | 'metaKey' | 'shiftKey' | 'key'>): HotkeyState {
  const fixedShiftKey = shiftKey && (key.length > 1 || key.toLowerCase() !== key.toUpperCase());
  return {
    ctrlKey,
    metaKey,
    shiftKey: fixedShiftKey,
    // eslint-disable-next-line no-nested-ternary
    key: regModifierKeys.test(key)
      ? 'Unidentified'
      : fixedShiftKey && key.length === 1
      ? key.toLowerCase()
      : key,
  };
}
