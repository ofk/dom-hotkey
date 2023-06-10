import { createHotkeyState, equalHotkeyState } from './hotkeyState';

describe('createHotkeyState', () => {
  it('returns the result of pressing z', () => {
    expect(createHotkeyState(new KeyboardEvent('keydown', { key: 'z' }))).toEqual({
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
      key: 'z',
    });
  });

  it('returns the result of pressing Control+z', () => {
    expect(createHotkeyState(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true }))).toEqual({
      ctrlKey: true,
      metaKey: false,
      shiftKey: false,
      key: 'z',
    });
  });

  it('returns the result of pressing Meta+z', () => {
    expect(createHotkeyState(new KeyboardEvent('keydown', { key: 'z', metaKey: true }))).toEqual({
      ctrlKey: false,
      metaKey: true,
      shiftKey: false,
      key: 'z',
    });
  });

  it('returns the result of pressing Shift+z', () => {
    expect(createHotkeyState(new KeyboardEvent('keydown', { key: 'Z', shiftKey: true }))).toEqual({
      ctrlKey: false,
      metaKey: false,
      shiftKey: true,
      key: 'z',
    });
  });

  it('returns the result of pressing Control+Shift+z', () => {
    expect(
      createHotkeyState(new KeyboardEvent('keydown', { key: 'Z', ctrlKey: true, shiftKey: true }))
    ).toEqual({
      ctrlKey: true,
      metaKey: false,
      shiftKey: true,
      key: 'z',
    });
  });

  it('returns the result of pressing Meta+Shift+z', () => {
    expect(
      createHotkeyState(new KeyboardEvent('keydown', { key: 'Z', metaKey: true, shiftKey: true }))
    ).toEqual({
      ctrlKey: false,
      metaKey: true,
      shiftKey: true,
      key: 'z',
    });
  });

  it('returns the result of pressing 1', () => {
    expect(createHotkeyState(new KeyboardEvent('keydown', { key: '1' }))).toEqual({
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
      key: '1',
    });
  });

  it('returns the result of pressing Shift+1', () => {
    expect(createHotkeyState(new KeyboardEvent('keydown', { key: '!', shiftKey: true }))).toEqual({
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
      key: '!',
    });
  });

  it('returns the result of pressing Enter', () => {
    expect(createHotkeyState(new KeyboardEvent('keydown', { key: 'Enter' }))).toEqual({
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
      key: 'Enter',
    });
  });

  it('returns the result of pressing Shift+Enter', () => {
    expect(
      createHotkeyState(new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true }))
    ).toEqual({
      ctrlKey: false,
      metaKey: false,
      shiftKey: true,
      key: 'Enter',
    });
  });

  it('returns the result of pressing Space', () => {
    expect(createHotkeyState(new KeyboardEvent('keydown', { key: ' ' }))).toEqual({
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
      key: 'Space',
    });
  });

  it('returns the result of pressing Shift+Space', () => {
    expect(createHotkeyState(new KeyboardEvent('keydown', { key: ' ', shiftKey: true }))).toEqual({
      ctrlKey: false,
      metaKey: false,
      shiftKey: true,
      key: 'Space',
    });
  });

  it('returns the result of pressing Control', () => {
    expect(
      createHotkeyState(new KeyboardEvent('keydown', { key: 'Control', ctrlKey: true }))
    ).toEqual({
      ctrlKey: true,
      metaKey: false,
      shiftKey: false,
      key: 'Unidentified',
    });
  });

  it('returns the result of pressing Meta', () => {
    expect(createHotkeyState(new KeyboardEvent('keydown', { key: 'Meta', metaKey: true }))).toEqual(
      {
        ctrlKey: false,
        metaKey: true,
        shiftKey: false,
        key: 'Unidentified',
      }
    );
  });

  it('returns the result of pressing Shift', () => {
    expect(
      createHotkeyState(new KeyboardEvent('keydown', { key: 'Shift', shiftKey: true }))
    ).toEqual({
      ctrlKey: false,
      metaKey: false,
      shiftKey: true,
      key: 'Unidentified',
    });
  });
});

describe('equalHotkeyState', () => {
  it('tests the result of pressing z', () => {
    expect(
      equalHotkeyState(createHotkeyState(new KeyboardEvent('keydown', { key: 'z' })), {
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
        createHotkeyState(new KeyboardEvent('keydown', { key: 'z', shiftKey: true })),
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
