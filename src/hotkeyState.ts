// HotkeyState's shiftKey is differnt from KeyboardEvent.
//
// | typing      | KeyboardEvent                    | HotkeyState                             |
// | ----------- | -------------------------------- | --------------------------------------- |
// | A (Shift+a) | { shiftKey: true, key: 'A' }     | { shiftKey: true, key: 'a' }            |
// | ! (Shift+1) | { shiftKey: true, key: '!' }     | { shiftKey: false, key: '!' }           |
// | Shift       | { shiftKey: true, key: 'Shift' } | { shiftKey: true, key: 'Unidentified' } |

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
  // eslint-disable-next-line no-nested-ternary
  const fixedKey = regModifierKeys.test(key) ? 'Unidentified' : key === ' ' ? 'Space' : key;
  const fixedShiftKey =
    shiftKey && (fixedKey.length > 1 || fixedKey.toLowerCase() !== fixedKey.toUpperCase());
  return {
    ctrlKey,
    metaKey,
    shiftKey: fixedShiftKey,
    key: fixedShiftKey && fixedKey.length === 1 ? fixedKey.toLowerCase() : fixedKey,
  };
}

export function equalHotkeyState(a: HotkeyState, b: HotkeyState): boolean {
  return (
    a.ctrlKey === b.ctrlKey &&
    a.metaKey === b.metaKey &&
    a.shiftKey === b.shiftKey &&
    a.key === b.key
  );
}
