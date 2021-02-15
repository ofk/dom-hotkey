import { createHotkeyState } from './hotkeyState';

describe('createHotkeyState', () => {
  it('returns the result of pressing z', () => {
    expect(createHotkeyState(new KeyboardEvent('keydown', { key: 'z', code: 'KeyZ' }))).toEqual({
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
      key: 'z',
    });
  });

  it('returns the result of pressing Control+z', () => {
    expect(
      createHotkeyState(new KeyboardEvent('keydown', { key: 'z', code: 'KeyZ', ctrlKey: true }))
    ).toEqual({
      ctrlKey: true,
      metaKey: false,
      shiftKey: false,
      key: 'z',
    });
  });

  it('returns the result of pressing Meta+z', () => {
    expect(
      createHotkeyState(new KeyboardEvent('keydown', { key: 'z', code: 'KeyZ', metaKey: true }))
    ).toEqual({
      ctrlKey: false,
      metaKey: true,
      shiftKey: false,
      key: 'z',
    });
  });

  it('returns the result of pressing Shift+z', () => {
    expect(
      createHotkeyState(new KeyboardEvent('keydown', { key: 'Z', code: 'KeyZ', shiftKey: true }))
    ).toEqual({
      ctrlKey: false,
      metaKey: false,
      shiftKey: true,
      key: 'z',
    });
  });

  it('returns the result of pressing Control+Shift+z', () => {
    expect(
      createHotkeyState(
        new KeyboardEvent('keydown', { key: 'Z', code: 'KeyZ', ctrlKey: true, shiftKey: true })
      )
    ).toEqual({
      ctrlKey: true,
      metaKey: false,
      shiftKey: true,
      key: 'z',
    });
  });

  it('returns the result of pressing Meta+Shift+z', () => {
    expect(
      createHotkeyState(
        new KeyboardEvent('keydown', { key: 'Z', code: 'KeyZ', metaKey: true, shiftKey: true })
      )
    ).toEqual({
      ctrlKey: false,
      metaKey: true,
      shiftKey: true,
      key: 'z',
    });
  });

  it('returns the result of pressing 1', () => {
    expect(createHotkeyState(new KeyboardEvent('keydown', { key: '1', code: 'Digit1' }))).toEqual({
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
      key: '1',
    });
  });

  it('returns the result of pressing Shift+1', () => {
    expect(
      createHotkeyState(new KeyboardEvent('keydown', { key: '!', code: 'Digit1', shiftKey: true }))
    ).toEqual({
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
      key: '!',
    });
  });

  it('returns the result of pressing Enter', () => {
    expect(
      createHotkeyState(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' }))
    ).toEqual({
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
      key: 'Enter',
    });
  });

  it('returns the result of pressing Shift+Enter', () => {
    expect(
      createHotkeyState(
        new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', shiftKey: true })
      )
    ).toEqual({
      ctrlKey: false,
      metaKey: false,
      shiftKey: true,
      key: 'Enter',
    });
  });

  it('returns the result of pressing Control', () => {
    expect(
      createHotkeyState(
        new KeyboardEvent('keydown', {
          key: 'Control',
          code: 'ControlLeft',
          location: 1,
          ctrlKey: true,
        })
      )
    ).toEqual({
      ctrlKey: true,
      metaKey: false,
      shiftKey: false,
      key: 'Unidentified',
    });
  });

  it('returns the result of pressing Meta', () => {
    expect(
      createHotkeyState(
        new KeyboardEvent('keydown', {
          key: 'Meta',
          code: 'MetaLeft',
          location: 1,
          metaKey: true,
        })
      )
    ).toEqual({
      ctrlKey: false,
      metaKey: true,
      shiftKey: false,
      key: 'Unidentified',
    });
  });

  it('returns the result of pressing Shift', () => {
    expect(
      createHotkeyState(
        new KeyboardEvent('keydown', {
          key: 'Shift',
          code: 'ShiftLeft',
          location: 1,
          shiftKey: true,
        })
      )
    ).toEqual({
      ctrlKey: false,
      metaKey: false,
      shiftKey: true,
      key: 'Unidentified',
    });
  });
});
