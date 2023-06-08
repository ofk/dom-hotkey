export function isFormField(elem: unknown): boolean {
  if (!(elem instanceof HTMLElement)) {
    return false;
  }

  const name = elem.tagName;
  const type = (elem.getAttribute('type') || '').toLowerCase();
  return !!(
    name === 'SELECT' ||
    name === 'TEXTAREA' ||
    (name === 'INPUT' &&
      type !== 'button' &&
      type !== 'checkbox' &&
      type !== 'radio' &&
      type !== 'reset' &&
      type !== 'submit') ||
    elem.isContentEditable
  );
}

export function fireDeterminedAction(elem: HTMLElement): void {
  if (isFormField(elem)) {
    elem.focus();
  } else {
    elem.click();
  }
}

export function getElementByHotkeyString(
  root: HTMLElement | Document,
  attr: string,
  hotkey: string
): HTMLElement | null {
  const value = CSS.escape(hotkey);
  return root.querySelector<HTMLElement>(
    `[${attr}="${value}"],[${attr}^="${value},"],[${attr}*=",${value},"],[${attr}$=",${value}"]`
  );
}
