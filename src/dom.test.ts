import { getElementByHotkeyString, isFormField } from './dom';

require('css.escape');

describe('isFormField', () => {
  it('returns false when give document', () => {
    expect(isFormField(document)).toEqual(false);
  });

  it('returns false when give div element', () => {
    expect(isFormField(document.createElement('div'))).toEqual(false);
  });

  it('returns true when give textarea element', () => {
    expect(isFormField(document.createElement('textarea'))).toEqual(true);
  });

  it('returns false when give input[type=text] element', () => {
    const elem = document.createElement('input');
    elem.type = 'text';
    expect(isFormField(elem)).toEqual(true);
  });
});

describe('getElementByHotkeyString', () => {
  it('gets div element', () => {
    document.body.innerHTML = '<div data-hotkey="x"></div>';
    expect(getElementByHotkeyString(document, 'data-hotkey', 'a')).toBe(null);
    expect(getElementByHotkeyString(document, 'data-hotkey', 'x')).toBeInstanceOf(HTMLElement);
    document.body.innerHTML = '<div data-hotkey="x,y"></div>';
    expect(getElementByHotkeyString(document, 'data-hotkey', 'x')).toBeInstanceOf(HTMLElement);
    document.body.innerHTML = '<div data-hotkey="w,x"></div>';
    expect(getElementByHotkeyString(document, 'data-hotkey', 'x')).toBeInstanceOf(HTMLElement);
    document.body.innerHTML = '<div data-hotkey="w,x,y"></div>';
    expect(getElementByHotkeyString(document, 'data-hotkey', 'x')).toBeInstanceOf(HTMLElement);

    document.body.innerHTML = '<div data-hotkey="Modifier+x"></div>';
    expect(getElementByHotkeyString(document, 'data-hotkey', 'Modifier+x')).toBeInstanceOf(
      HTMLElement
    );
    document.body.innerHTML = '<div data-hotkey="&quot;"></div>';
    expect(getElementByHotkeyString(document, 'data-hotkey', '"')).toBeInstanceOf(HTMLElement);
  });
});
