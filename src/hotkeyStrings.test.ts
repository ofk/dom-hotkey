import { createHotkeyStrings } from './hotkeyStrings';

describe('createHotkeyStrings', () => {
  it('returns the result of pressing z', () => {
    expect(createHotkeyStrings(new KeyboardEvent('keydown', { key: 'z', code: 'KeyZ' }))).toEqual([
      'z',
    ]);
  });

  it('returns the result of pressing Control+z', () => {
    expect(
      createHotkeyStrings(new KeyboardEvent('keydown', { key: 'z', code: 'KeyZ', ctrlKey: true }))
    ).toEqual(['Modifier+z', 'Control+z']);
  });

  it('returns the result of pressing Meta+z', () => {
    expect(
      createHotkeyStrings(new KeyboardEvent('keydown', { key: 'z', code: 'KeyZ', metaKey: true }))
    ).toEqual(['Meta+z']);
  });

  it('returns the result of pressing Shift+z', () => {
    expect(
      createHotkeyStrings(new KeyboardEvent('keydown', { key: 'Z', code: 'KeyZ', shiftKey: true }))
    ).toEqual(['Shift+z']);
  });

  it('returns the result of pressing Control+Shift+z', () => {
    expect(
      createHotkeyStrings(
        new KeyboardEvent('keydown', { key: 'Z', code: 'KeyZ', ctrlKey: true, shiftKey: true })
      )
    ).toEqual(['Modifier+Shift+z', 'Control+Shift+z']);
  });

  it('returns the result of pressing Meta+Shift+z', () => {
    expect(
      createHotkeyStrings(
        new KeyboardEvent('keydown', { key: 'Z', code: 'KeyZ', metaKey: true, shiftKey: true })
      )
    ).toEqual(['Meta+Shift+z']);
  });

  it('returns the result of pressing 1', () => {
    expect(
      createHotkeyStrings(new KeyboardEvent('keydown', { key: '1', code: 'Digit1' }))
    ).toEqual(['1']);
  });

  it('returns the result of pressing Shift+1', () => {
    expect(
      createHotkeyStrings(
        new KeyboardEvent('keydown', { key: '!', code: 'Digit1', shiftKey: true })
      )
    ).toEqual(['!']);
  });

  it('returns the result of pressing Enter', () => {
    expect(
      createHotkeyStrings(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' }))
    ).toEqual(['Enter']);
  });

  it('returns the result of pressing Shift+Enter', () => {
    expect(
      createHotkeyStrings(
        new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', shiftKey: true })
      )
    ).toEqual(['Shift+Enter']);
  });

  it('returns the result of pressing Control', () => {
    expect(
      createHotkeyStrings(
        new KeyboardEvent('keydown', {
          key: 'Control',
          code: 'ControlLeft',
          location: 1,
          ctrlKey: true,
        })
      )
    ).toEqual(['Modifier', 'Control']);
  });

  it('returns the result of pressing Meta', () => {
    expect(
      createHotkeyStrings(
        new KeyboardEvent('keydown', {
          key: 'Meta',
          code: 'MetaLeft',
          location: 1,
          metaKey: true,
        })
      )
    ).toEqual(['Meta']);
  });

  it('returns the result of pressing Shift', () => {
    expect(
      createHotkeyStrings(
        new KeyboardEvent('keydown', {
          key: 'Shift',
          code: 'ShiftLeft',
          location: 1,
          shiftKey: true,
        })
      )
    ).toEqual(['Shift']);
  });
});
