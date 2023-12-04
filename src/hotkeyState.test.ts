import { copyAsHotkeyState, equalHotkeyState, isModifierKeyPressed } from './hotkeyState';

describe('copyAsHotkeyState', () => {
  it('returns the result of pressing z', () => {
    expect(copyAsHotkeyState(new KeyboardEvent('keydown', { key: 'z', code: 'KeyZ' }))).toEqual({
      ctrlKey: false,
      metaKey: false,
      altKey: false,
      shiftKey: false,
      key: 'z',
      code: 'KeyZ',
    });
  });

  it('returns the result of pressing Control+z', () => {
    expect(
      copyAsHotkeyState(new KeyboardEvent('keydown', { key: 'z', code: 'KeyZ', ctrlKey: true })),
    ).toEqual({
      ctrlKey: true,
      metaKey: false,
      altKey: false,
      shiftKey: false,
      key: 'z',
      code: 'KeyZ',
    });
  });
});

describe('equalHotkeyState', () => {
  it('tests the result of pressing z', () => {
    expect(
      equalHotkeyState(
        copyAsHotkeyState(new KeyboardEvent('keydown', { key: 'z', code: 'KeyZ' })),
        {
          ctrlKey: false,
          metaKey: false,
          altKey: false,
          shiftKey: false,
          key: 'z',
        },
      ),
    ).toBe(true);
  });

  it('tests the result of pressing Shift+z', () => {
    expect(
      equalHotkeyState(
        copyAsHotkeyState(new KeyboardEvent('keydown', { key: 'z', code: 'KeyZ', shiftKey: true })),
        {
          ctrlKey: false,
          metaKey: false,
          altKey: false,
          shiftKey: false,
          key: 'z',
        },
      ),
    ).toBe(false);
  });
});

describe('isModifierKeyPressed', () => {
  it('tests the result of pressing z', () => {
    expect(isModifierKeyPressed(new KeyboardEvent('keydown', { key: 'z', code: 'KeyZ' }))).toBe(
      false,
    );
  });

  it('tests the result of pressing Shift+z', () => {
    expect(
      isModifierKeyPressed(
        new KeyboardEvent('keydown', { key: 'z', code: 'KeyZ', shiftKey: true }),
      ),
    ).toBe(true);
  });
});
