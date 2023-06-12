import type { HotkeyState } from './hotkeyState';

export type HotkeyStrings = [string, ...string[]];

export const metaModifierKey = /Mac|iPod|iPhone|iPad/.test(
  typeof navigator !== 'undefined' ? navigator.platform : ''
);

function isModkey({ ctrlKey, metaKey }: HotkeyState): boolean {
  return metaModifierKey ? /* istanbul ignore next */ !ctrlKey && metaKey : ctrlKey && !metaKey;
}

function toCtrlMetaStringFromState({ ctrlKey, metaKey }: HotkeyState): string {
  return `${ctrlKey ? '+Control' : ''}${metaKey ? '+Meta' : ''}`;
}

function toShiftKeyStringFromState({ shiftKey, key }: HotkeyState): string {
  return `${shiftKey ? '+Shift' : ''}${key !== 'Unidentified' ? `+${key}` : ''}`;
}

const regModifierKeys = /^(?:Control|Meta|Alt|Shift)$/;

export function createHotkeyStrings({
  ctrlKey,
  metaKey,
  shiftKey,
  key,
}: HotkeyState): HotkeyStrings {
  // eslint-disable-next-line no-nested-ternary
  const fixedKey = regModifierKeys.test(key) ? 'Unidentified' : key === ' ' ? 'Space' : key;
  const fixedShiftKey =
    shiftKey && (fixedKey.length > 1 || fixedKey.toLowerCase() !== fixedKey.toUpperCase());
  const state = {
    ctrlKey,
    metaKey,
    shiftKey: fixedShiftKey,
    key: fixedShiftKey && fixedKey.length === 1 ? fixedKey.toLowerCase() : fixedKey,
  };
  const partialHotkey = toShiftKeyStringFromState(state);
  const hotkey = `${toCtrlMetaStringFromState(state)}${partialHotkey}`.slice(1);
  // eslint-disable-next-line no-nested-ternary
  return !hotkey
    ? /* istanbul ignore next */
      ['Unidentified']
    : isModkey(state)
    ? [`Modifier${partialHotkey}`, hotkey]
    : [hotkey];
}
