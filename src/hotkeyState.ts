export interface HotkeyState
  extends Pick<KeyboardEvent, 'ctrlKey' | 'metaKey' | 'shiftKey' | 'key'> {}

export function copyAsHotkeyState({ ctrlKey, metaKey, shiftKey, key }: HotkeyState): HotkeyState {
  return { ctrlKey, metaKey, shiftKey, key };
}

export function equalHotkeyState(a: HotkeyState, b: HotkeyState): boolean {
  return (
    a.ctrlKey === b.ctrlKey &&
    a.metaKey === b.metaKey &&
    a.shiftKey === b.shiftKey &&
    a.key === b.key
  );
}
