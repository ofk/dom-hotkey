export interface HotkeyState
  extends Pick<KeyboardEvent, 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey' | 'key' | 'code'> {}

export function copyAsHotkeyState({
  ctrlKey,
  metaKey,
  altKey,
  shiftKey,
  key,
  code,
}: HotkeyState): HotkeyState {
  return { ctrlKey, metaKey, altKey, shiftKey, key, code };
}

export function equalHotkeyState(
  a: Omit<HotkeyState, 'code'>,
  b: Omit<HotkeyState, 'code'>,
): boolean {
  return (
    a.ctrlKey === b.ctrlKey &&
    a.metaKey === b.metaKey &&
    a.altKey === b.altKey &&
    a.shiftKey === b.shiftKey &&
    a.key === b.key
  );
}

export function isModifierKeyPressed(state: Omit<HotkeyState, 'key' | 'code'>): boolean {
  return state.ctrlKey || state.metaKey || state.altKey || state.shiftKey;
}
