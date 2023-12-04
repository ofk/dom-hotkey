/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { fireDeterminedAction, getElementByHotkeyString, isFormField } from './dom';

require('css.escape');

describe('isFormField', () => {
  it('returns false when give document', () => {
    expect(isFormField(document)).toBe(false);
  });

  it('returns false when give div element', () => {
    expect(isFormField(document.createElement('div'))).toBe(false);
  });

  it('returns true when give textarea element', () => {
    expect(isFormField(document.createElement('textarea'))).toBe(true);
  });

  it('returns true when give input element', () => {
    expect(isFormField(document.createElement('input'))).toBe(true);
  });

  it('returns true when give input[type=text] element', () => {
    const elem = document.createElement('input');
    elem.type = 'text';
    expect(isFormField(elem)).toBe(true);
  });

  it('returns false when give input[type=button] element', () => {
    const elem = document.createElement('input');
    elem.type = 'button';
    expect(isFormField(elem)).toBe(false);
  });
});

describe('fireDeterminedAction', () => {
  it('clicks a link', () => {
    let count = 0;
    document.body.innerHTML = '<a href="#">a</a>';
    const elem = document.querySelector('a')!;
    elem.addEventListener('click', () => {
      count += 1;
    });
    elem.addEventListener('focus', () => {
      count += 10;
    });
    expect(count).toBe(0);
    fireDeterminedAction(elem);
    expect(count).toBe(1);
  });

  it('clicks a button', () => {
    let count = 0;
    document.body.innerHTML = '<button>b</button>';
    const elem = document.querySelector('button')!;
    elem.addEventListener('click', () => {
      count += 1;
    });
    elem.addEventListener('focus', () => {
      count += 10;
    });
    expect(count).toBe(0);
    fireDeterminedAction(elem);
    expect(count).toBe(1);
  });

  it('focuses an input', () => {
    let count = 0;
    document.body.innerHTML = '<input value="i" />';
    const elem = document.querySelector('input')!;
    elem.addEventListener('click', () => {
      count += 1;
    });
    elem.addEventListener('focus', () => {
      count += 10;
    });
    expect(count).toBe(0);
    fireDeterminedAction(elem);
    expect(count).toBe(10);
  });
});

describe('getElementByHotkeyString', () => {
  it('does not get div elements', () => {
    document.body.innerHTML = '<div data-hotkey="x"></div>';
    expect(getElementByHotkeyString(document, 'data-hotkey', 'a')).toBe(null);
  });

  it('gets a div element', () => {
    document.body.innerHTML = '<div data-hotkey="x"></div>';
    expect(getElementByHotkeyString(document, 'data-hotkey', 'x')).toBeInstanceOf(HTMLElement);

    document.body.innerHTML = '<div data-hotkey="x,y"></div>';
    expect(getElementByHotkeyString(document, 'data-hotkey', 'x')).toBeInstanceOf(HTMLElement);

    document.body.innerHTML = '<div data-hotkey="w,x"></div>';
    expect(getElementByHotkeyString(document, 'data-hotkey', 'x')).toBeInstanceOf(HTMLElement);

    document.body.innerHTML = '<div data-hotkey="w,x,y"></div>';
    expect(getElementByHotkeyString(document, 'data-hotkey', 'x')).toBeInstanceOf(HTMLElement);

    document.body.innerHTML = '<div data-hotkey="Modifier+x"></div>';
    expect(getElementByHotkeyString(document, 'data-hotkey', 'Modifier+x')).toBeInstanceOf(
      HTMLElement,
    );

    document.body.innerHTML = '<div data-hotkey="&quot;"></div>';
    expect(getElementByHotkeyString(document, 'data-hotkey', '"')).toBeInstanceOf(HTMLElement);
  });
});
