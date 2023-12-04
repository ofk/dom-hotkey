/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { setup } from '.';

require('css.escape');

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

describe('setup', () => {
  it('tests click event', () => {
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
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'z' }));
    expect(count).toEqual(1);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    expect(count).toEqual(2);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', ctrlKey: true }));
    expect(count).toEqual(2);
    remover();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    expect(count).toEqual(2);
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
    expect(count).toEqual(3);
    remover();
  });

  it('tests sequence of keys', async () => {
    let count = 0;
    document.body.innerHTML = '<button data-hotkey="s q">s q</button>';
    document.querySelector('button')!.addEventListener('click', () => {
      count += 1;
    });
    const remover = setup({ resetKey: 100 });
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 's' }));
    expect(count).toEqual(0);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'q' }));
    expect(count).toEqual(1);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'q' }));
    expect(count).toEqual(1);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 's' }));
    expect(count).toEqual(1);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'q' }));
    expect(count).toEqual(2);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'q' }));
    await wait(150);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'q' }));
    expect(count).toEqual(2);
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
      new KeyboardEvent('keydown', { key: 'g', bubbles: true }),
    );
    document.activeElement!.dispatchEvent(new KeyboardEvent('keyup', { key: 'g', bubbles: true }));
    expect(count).toEqual(1);
    document.querySelector('input')!.focus();
    document.activeElement!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'g', bubbles: true }),
    );
    document.activeElement!.dispatchEvent(new KeyboardEvent('keyup', { key: 'g', bubbles: true }));
    expect(count).toEqual(1);
    remover();
  });

  it('renderes no error message if all hotkey are valid', () => {
    const oldNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const spyWarn = jest.spyOn(console, 'warn').mockImplementation((x: unknown) => x);
    const spyError = jest.spyOn(console, 'error').mockImplementation((x: unknown) => x);

    document.body.innerHTML = `
      <a data-hotkey="x" />
      <a data-hotkey="Modifier+x" />
      <a data-hotkey="Control+Meta+Shift+x" />
      <a data-hotkey="x y,z" />
      <a data-hotkey="x,," />
      <a data-hotkey="x ," />
      <a data-hotkey=",,z" />
      <a data-hotkey=", z" />
    `;
    const remover = setup();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', ctrlKey: true }));
    expect(spyWarn.mock.calls[0]![0]).toEqual('No elements found matching hotkeys: Modifier+a');
    expect(spyError.mock.calls[0]).toBeUndefined();
    remover();

    spyWarn.mockRestore();
    process.env.NODE_ENV = oldNodeEnv;
  });

  it('renderes error message if presses undefined hotkey', () => {
    const oldNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const spyWarn = jest.spyOn(console, 'warn').mockImplementation((x: unknown) => x);
    const spyError = jest.spyOn(console, 'error').mockImplementation((x: unknown) => x);

    document.body.innerHTML = `
      <a data-hotkey=" X " />
      <a data-hotkey="mod + x" />
      <a data-hotkey="Shift+Control+x" />
      <a data-hotkey="x   y" />
      <a data-hotkey="?,f1" />
    `;
    const remover = setup();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', ctrlKey: true }));
    expect(spyWarn.mock.calls[0]![0]).toEqual('No elements found matching hotkeys: Modifier+a');
    expect(spyError.mock.calls[0]![0])
      .toEqual(`Found 5 elements with the wrong data-hotkey attribute:
- '[data-hotkey=" X "]':
  - " X ": Wrong hotkey. There are unnecessary spaces.
  - Did you mean '[data-hotkey="Shift+x"]'?
- '[data-hotkey="mod + x"]':
  - "mod + x": Includes unknown modifier keys. There are unnecessary spaces.
  - Did you mean '[data-hotkey="Modifier+x"]'?
- '[data-hotkey="Shift+Control+x"]':
  - "Shift+Control+x": Bad order.
  - Did you mean '[data-hotkey="Control+Shift+x"]'?
- '[data-hotkey="x   y"]':
  - "x   y": There are unnecessary spaces.
  - Did you mean '[data-hotkey="x y"]'?
- '[data-hotkey="?,f1"]':
  - "f1": Wrong hotkey.
  - Did you mean '[data-hotkey="?,F1"]'?`);
    remover();

    spyWarn.mockRestore();
    process.env.NODE_ENV = oldNodeEnv;
  });
});
