/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { setup } from './DomHotkey';

require('css.escape'); // eslint-disable-line import/no-extraneous-dependencies

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

describe('setup', () => {
  it('tests click event', async () => {
    let count = 0;
    document.body.innerHTML = '<button data-hotkey="a">a</button>';
    document.querySelector('button')!.addEventListener('click', () => {
      count += 1;
    });
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    expect(count).toEqual(0);
    const remover = setup({ keyRepeat: -1, initialKeyRepeat: -1 });
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    expect(count).toEqual(1);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    expect(count).toEqual(2);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    expect(count).toEqual(3);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', ctrlKey: true }));
    expect(count).toEqual(3);
    remover();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    expect(count).toEqual(3);
  });

  it('tests focus event', () => {
    let count = 0;
    document.body.innerHTML = '<input data-hotkey="f" />';
    document.querySelector('input')!.addEventListener('focus', () => {
      count += 1;
    });
    const remover = setup();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'f' }));
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'f' }));
    expect(count).toEqual(1);
    remover();
  });

  it('tests initialKeyRepeat option', async () => {
    let count = 0;
    document.body.innerHTML = '<button data-hotkey="b">b</button>';
    document.querySelector('button')!.addEventListener('click', () => {
      count += 1;
    });
    const remover = setup({ keyRepeat: -1, initialKeyRepeat: 100 });
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }));
    expect(count).toEqual(1);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }));
    expect(count).toEqual(1);
    await wait(150);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }));
    expect(count).toEqual(2);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }));
    expect(count).toEqual(3);
    remover();
  });

  it('tests keyRepeat option', async () => {
    let count = 0;
    document.body.innerHTML = '<button data-hotkey="c">c</button>';
    document.querySelector('button')!.addEventListener('click', () => {
      count += 1;
    });
    const remover = setup({ keyRepeat: 100, initialKeyRepeat: -1 });
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'c' }));
    expect(count).toEqual(1);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'c' }));
    expect(count).toEqual(1);
    await wait(150);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'c' }));
    expect(count).toEqual(2);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'c' }));
    expect(count).toEqual(2);
    await wait(150);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'c' }));
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'c' }));
    expect(count).toEqual(3);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'c' }));
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'c' }));
    expect(count).toEqual(4);
    remover();
  });

  it('skips if form field is in focus', () => {
    let count = 0;
    document.body.innerHTML = '<input /><button data-hotkey="g">g</button>';
    document.querySelector('button')!.addEventListener('click', () => {
      count += 1;
    });
    const remover = setup();
    document.querySelector('button')!.focus();
    document.activeElement!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'g', bubbles: true })
    );
    document.activeElement!.dispatchEvent(new KeyboardEvent('keyup', { key: 'g', bubbles: true }));
    expect(count).toEqual(1);
    document.querySelector('input')!.focus();
    document.activeElement!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'g', bubbles: true })
    );
    document.activeElement!.dispatchEvent(new KeyboardEvent('keyup', { key: 'g', bubbles: true }));
    expect(count).toEqual(1);
    remover();
  });

  it('renderes error message if presses undefined hotkey', async () => {
    const oldNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const spyWarn = jest.spyOn(console, 'warn').mockImplementation((x) => x);
    const spyError = jest.spyOn(console, 'error').mockImplementation((x) => x);

    document.body.innerHTML =
      '<a data-hotkey="x" /><a data-hotkey="  " /><a data-hotkey="Meta,Alt" /><a data-hotkey="Mod+ A,Shift+Control+z" /><a data-hotkey="?,f1" />';
    const remover = setup();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', ctrlKey: true }));
    expect(spyWarn.mock.calls[0]![0]).toEqual(
      'No elements found matching "Modifier+a" or "Control+a".'
    );
    expect(spyError.mock.calls[0]![0])
      .toEqual(`Found 3 elements with the wrong data-hotkey attribute:
- '[data-hotkey="  "]':
  - "  ": There are unnecessary spaces.
  - Did you mean '[data-hotkey=" "]'?
- '[data-hotkey="Mod+ A,Shift+Control+z"]':
  - "Mod+ A": Wrong hotkey. Includes unknown modifier keys. There are unnecessary spaces.
  - "Shift+Control+z": Bad order.
  - Did you mean '[data-hotkey="Modifier+Shift+a,Control+Shift+z"]'?
- '[data-hotkey="?,f1"]':
  - "f1": Wrong hotkey.
  - Did you mean '[data-hotkey="?,F1"]'?`);
    remover();

    spyWarn.mockRestore();
    process.env.NODE_ENV = oldNodeEnv;
  });
});
