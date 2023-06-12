import { copyAsHotkeyState, equalHotkeyState } from './hotkeyState';

describe('copyAsHotkeyState', () => {
  it('returns the result of pressing z', () => {
    expect(copyAsHotkeyState(new KeyboardEvent('keydown', { key: 'z' }))).toEqual({
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
      key: 'z',
    });
  });

  it('returns the result of pressing Control+z', () => {
    expect(copyAsHotkeyState(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true }))).toEqual({
      ctrlKey: true,
      metaKey: false,
      shiftKey: false,
      key: 'z',
    });
  });
});

describe('equalHotkeyState', () => {
  it('tests the result of pressing z', () => {
    expect(
      equalHotkeyState(copyAsHotkeyState(new KeyboardEvent('keydown', { key: 'z' })), {
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        key: 'z',
      })
    ).toBe(true);
  });

  it('tests the result of pressing Shift+z', () => {
    expect(
      equalHotkeyState(
        copyAsHotkeyState(new KeyboardEvent('keydown', { key: 'z', shiftKey: true })),
        {
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          key: 'z',
        }
      )
    ).toBe(false);
  });
});
