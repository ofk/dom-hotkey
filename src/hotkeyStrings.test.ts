import { createHotkeyStrings, metaModifierKey } from './hotkeyStrings';

describe('metaModifierKey', () => {
  it('returns bool value', () => {
    expect(typeof metaModifierKey).toBe('boolean');
  });
});

const itReturnsTheResultOfPressing = (result: string, key = result): void => {
  it(`returns the result of pressing ${result}`, () => {
    expect(createHotkeyStrings(new KeyboardEvent('keydown', { key }))).toEqual([result]);
  });

  it(`returns the result of pressing Control+${result}`, () => {
    expect(createHotkeyStrings(new KeyboardEvent('keydown', { key, ctrlKey: true }))).toEqual([
      `Modifier+${result}`,
      `Control+${result}`,
    ]);
  });

  it(`returns the result of pressing Meta+${result}`, () => {
    expect(createHotkeyStrings(new KeyboardEvent('keydown', { key, metaKey: true }))).toEqual([
      `Meta+${result}`,
    ]);
  });

  it(`returns the result of pressing Alt+${result}`, () => {
    expect(createHotkeyStrings(new KeyboardEvent('keydown', { key, altKey: true }))).toEqual([
      `Alt+${result}`,
    ]);
  });
};

const itReturnsTheResultOfPressingAltShift = (result: string, key = result): void => {
  it(`returns the result of pressing Alt+${result}`, () => {
    expect(createHotkeyStrings(new KeyboardEvent('keydown', { key, altKey: true }))).toEqual([
      `Alt+${result}`,
    ]);
  });

  it(`returns the result of pressing Shift+${result}`, () => {
    expect(createHotkeyStrings(new KeyboardEvent('keydown', { key, shiftKey: true }))).toEqual([
      `Shift+${result}`,
    ]);
  });

  it(`returns the result of pressing Control+Shift+${result}`, () => {
    expect(
      createHotkeyStrings(new KeyboardEvent('keydown', { key, ctrlKey: true, shiftKey: true })),
    ).toEqual([`Modifier+Shift+${result}`, `Control+Shift+${result}`]);
  });

  it(`returns the result of pressing Control+Meta+Alt+Shift+${result}`, () => {
    expect(
      createHotkeyStrings(
        new KeyboardEvent('keydown', {
          key,
          ctrlKey: true,
          metaKey: true,
          altKey: true,
          shiftKey: true,
        }),
      ),
    ).toEqual([`Control+Meta+Alt+Shift+${result}`]);
  });
};

describe('createHotkeyStrings', () => {
  itReturnsTheResultOfPressing('a');

  it('returns the result of pressing Shift+a', () => {
    expect(createHotkeyStrings(new KeyboardEvent('keydown', { key: 'A', shiftKey: true }))).toEqual(
      ['Shift+a', 'A'],
    );
  });

  it('returns the result of pressing Alt+a', () => {
    expect(createHotkeyStrings(new KeyboardEvent('keydown', { key: 'a', altKey: true }))).toEqual([
      'Alt+a',
    ]);
  });

  it('returns the result of pressing Alt+a for Mac', () => {
    expect(
      createHotkeyStrings(new KeyboardEvent('keydown', { key: 'å', code: 'KeyA', altKey: true })),
    ).toEqual(['Alt+a', 'å']);
  });

  it('returns the result of pressing Control+Shift+a', () => {
    expect(
      createHotkeyStrings(
        new KeyboardEvent('keydown', { key: 'A', ctrlKey: true, shiftKey: true }),
      ),
    ).toEqual(['Modifier+Shift+a', 'Control+Shift+a', 'Modifier+A', 'Control+A']);
  });

  it('returns the result of pressing Control+Meta+Alt+Shift+a', () => {
    expect(
      createHotkeyStrings(
        new KeyboardEvent('keydown', {
          key: 'A',
          ctrlKey: true,
          metaKey: true,
          altKey: true,
          shiftKey: true,
        }),
      ),
    ).toEqual(['Control+Meta+Alt+Shift+a', 'Control+Meta+Alt+A']);
  });

  it('returns the result of pressing Control+Meta+Alt+Shift+a for Mac', () => {
    expect(
      createHotkeyStrings(
        new KeyboardEvent('keydown', {
          key: 'Å',
          code: 'KeyA',
          ctrlKey: true,
          metaKey: true,
          altKey: true,
          shiftKey: true,
        }),
      ),
    ).toEqual(['Control+Meta+Alt+Shift+a', 'Control+Meta+Alt+A', 'Control+Meta+Å']);
  });

  itReturnsTheResultOfPressing('1');

  it('returns the result of pressing Shift+1', () => {
    expect(
      createHotkeyStrings(
        new KeyboardEvent('keydown', { key: '!', code: 'Digit1', shiftKey: true }),
      ),
    ).toEqual(['Shift+1', '!']);
  });

  it('returns the result of pressing Alt+1', () => {
    expect(createHotkeyStrings(new KeyboardEvent('keydown', { key: '1', altKey: true }))).toEqual([
      'Alt+1',
    ]);
  });

  it('returns the result of pressing Alt+1 for Mac', () => {
    expect(
      createHotkeyStrings(new KeyboardEvent('keydown', { key: '¡', code: 'Digit1', altKey: true })),
    ).toEqual(['Alt+1', '¡']);
  });

  it('returns the result of pressing Control+Shift+1', () => {
    expect(
      createHotkeyStrings(
        new KeyboardEvent('keydown', { key: '!', code: 'Digit1', ctrlKey: true, shiftKey: true }),
      ),
    ).toEqual(['Modifier+Shift+1', 'Control+Shift+1', 'Modifier+!', 'Control+!']);
  });

  it('returns the result of pressing Control+Meta+Alt+Shift+1', () => {
    expect(
      createHotkeyStrings(
        new KeyboardEvent('keydown', {
          key: '!',
          code: 'Digit1',
          ctrlKey: true,
          metaKey: true,
          altKey: true,
          shiftKey: true,
        }),
      ),
    ).toEqual(['Control+Meta+Alt+Shift+1', 'Control+Meta+Alt+!']);
  });

  it('returns the result of pressing Control+Meta+Alt+Shift+1 for Mac', () => {
    expect(
      createHotkeyStrings(
        new KeyboardEvent('keydown', {
          key: '⁄',
          code: 'Digit1',
          ctrlKey: true,
          metaKey: true,
          altKey: true,
          shiftKey: true,
        }),
      ),
    ).toEqual(['Control+Meta+Alt+Shift+1', 'Control+Meta+⁄']);
  });

  itReturnsTheResultOfPressing('/');

  it('returns the result of pressing Shift+/', () => {
    expect(
      createHotkeyStrings(
        new KeyboardEvent('keydown', { key: '?', code: 'Slash', shiftKey: true }),
      ),
    ).toEqual(['Shift+/', '?']);
  });

  it('returns the result of pressing Alt+/', () => {
    expect(createHotkeyStrings(new KeyboardEvent('keydown', { key: '/', altKey: true }))).toEqual([
      'Alt+/',
    ]);
  });

  it('returns the result of pressing Alt+/ for Mac', () => {
    expect(
      createHotkeyStrings(new KeyboardEvent('keydown', { key: '÷', code: 'Slash', altKey: true })),
    ).toEqual(['Alt+/', '÷']);
  });

  it('returns the result of pressing Control+Shift+/', () => {
    expect(
      createHotkeyStrings(
        new KeyboardEvent('keydown', { key: '?', code: 'Slash', ctrlKey: true, shiftKey: true }),
      ),
    ).toEqual(['Modifier+Shift+/', 'Control+Shift+/', 'Modifier+?', 'Control+?']);
  });

  it('returns the result of pressing Control+Meta+Alt+Shift+/', () => {
    expect(
      createHotkeyStrings(
        new KeyboardEvent('keydown', {
          key: '?',
          code: 'Slash',
          ctrlKey: true,
          metaKey: true,
          altKey: true,
          shiftKey: true,
        }),
      ),
    ).toEqual(['Control+Meta+Alt+Shift+/', 'Control+Meta+Alt+?']);
  });

  it('returns the result of pressing Control+Meta+Alt+Shift+/ for Mac', () => {
    expect(
      createHotkeyStrings(
        new KeyboardEvent('keydown', {
          key: '¿',
          code: 'Slash',
          ctrlKey: true,
          metaKey: true,
          altKey: true,
          shiftKey: true,
        }),
      ),
    ).toEqual(['Control+Meta+Alt+Shift+/', 'Control+Meta+¿']);
  });

  itReturnsTheResultOfPressing('Space', ' ');
  itReturnsTheResultOfPressingAltShift('Space', ' ');

  itReturnsTheResultOfPressing('F1');
  itReturnsTheResultOfPressingAltShift('F1');

  it('returns the result of pressing Control', () => {
    expect(
      createHotkeyStrings(new KeyboardEvent('keydown', { key: 'Control', ctrlKey: true })),
    ).toEqual(['Modifier', 'Control']);
  });

  it('returns the result of pressing Meta', () => {
    expect(
      createHotkeyStrings(new KeyboardEvent('keydown', { key: 'Meta', metaKey: true })),
    ).toEqual(['Meta']);
  });

  it('returns the result of pressing Alt', () => {
    expect(createHotkeyStrings(new KeyboardEvent('keydown', { key: 'Alt', altKey: true }))).toEqual(
      ['Alt'],
    );
  });

  it('returns the result of pressing Shift', () => {
    expect(
      createHotkeyStrings(new KeyboardEvent('keydown', { key: 'Shift', shiftKey: true })),
    ).toEqual(['Shift']);
  });

  it('returns the result of pressing Control+Shift', () => {
    ['Control', 'Shift'].forEach((key) => {
      expect(
        createHotkeyStrings(new KeyboardEvent('keydown', { key, ctrlKey: true, shiftKey: true })),
      ).toEqual(['Modifier+Shift', 'Control+Shift']);
    });
  });

  it('returns the result of pressing Control+Meta+Alt+Shift', () => {
    ['Control', 'Meta', 'Alt', 'Shift'].forEach((key) => {
      expect(
        createHotkeyStrings(
          new KeyboardEvent('keydown', {
            key,
            ctrlKey: true,
            metaKey: true,
            altKey: true,
            shiftKey: true,
          }),
        ),
      ).toEqual(['Control+Meta+Alt+Shift']);
    });
  });
});
