import { HotkeyState, createHotkeyState } from './hotkeyState';

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

export function createHotkeyStringsFromState(state: HotkeyState): HotkeyStrings {
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

export function createHotkeyStrings(evt: Parameters<typeof createHotkeyState>[0]): HotkeyStrings {
  return createHotkeyStringsFromState(createHotkeyState(evt));
}
