import { createHotkeyState } from './hotkeyState';
import { createHotkeyStringsFromState, metaModifierKey } from './hotkeyStrings';

function createHotkeyStrings(
  evt: Parameters<typeof createHotkeyState>[0]
): ReturnType<typeof createHotkeyStringsFromState> {
  return createHotkeyStringsFromState(createHotkeyState(evt));
}

describe('metaModifierKey', () => {
  it('returns bool value', () => {
    expect(typeof metaModifierKey).toBe('boolean');
  });
});

describe('createHotkeyStrings', () => {
  it('returns the result of pressing z', () => {
    expect(createHotkeyStrings(new KeyboardEvent('keydown', { key: 'z' }))).toEqual(['z']);
  });

  it('returns the result of pressing Control+z', () => {
    expect(createHotkeyStrings(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true }))).toEqual([
      'Modifier+z',
      'Control+z',
    ]);
  });

  it('returns the result of pressing Meta+z', () => {
    expect(createHotkeyStrings(new KeyboardEvent('keydown', { key: 'z', metaKey: true }))).toEqual([
      'Meta+z',
    ]);
  });

  it('returns the result of pressing Shift+z', () => {
    expect(createHotkeyStrings(new KeyboardEvent('keydown', { key: 'Z', shiftKey: true }))).toEqual(
      ['Shift+z']
    );
  });

  it('returns the result of pressing Control+Shift+z', () => {
    expect(
      createHotkeyStrings(new KeyboardEvent('keydown', { key: 'Z', ctrlKey: true, shiftKey: true }))
    ).toEqual(['Modifier+Shift+z', 'Control+Shift+z']);
  });

  it('returns the result of pressing Meta+Shift+z', () => {
    expect(
      createHotkeyStrings(new KeyboardEvent('keydown', { key: 'Z', metaKey: true, shiftKey: true }))
    ).toEqual(['Meta+Shift+z']);
  });

  it('returns the result of pressing 1', () => {
    expect(createHotkeyStrings(new KeyboardEvent('keydown', { key: '1' }))).toEqual(['1']);
  });

  it('returns the result of pressing Shift+1', () => {
    expect(createHotkeyStrings(new KeyboardEvent('keydown', { key: '!', shiftKey: true }))).toEqual(
      ['!']
    );
  });

  it('returns the result of pressing Enter', () => {
    expect(createHotkeyStrings(new KeyboardEvent('keydown', { key: 'Enter' }))).toEqual(['Enter']);
  });

  it('returns the result of pressing Shift+Enter', () => {
    expect(
      createHotkeyStrings(new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true }))
    ).toEqual(['Shift+Enter']);
  });

  it('returns the result of pressing Control', () => {
    expect(
      createHotkeyStrings(new KeyboardEvent('keydown', { key: 'Control', ctrlKey: true }))
    ).toEqual(['Modifier', 'Control']);
  });

  it('returns the result of pressing Meta', () => {
    expect(
      createHotkeyStrings(new KeyboardEvent('keydown', { key: 'Meta', metaKey: true }))
    ).toEqual(['Meta']);
  });

  it('returns the result of pressing Shift', () => {
    expect(
      createHotkeyStrings(new KeyboardEvent('keydown', { key: 'Shift', shiftKey: true }))
    ).toEqual(['Shift']);
  });
});
