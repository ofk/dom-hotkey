import { DOMHotkey } from './DOMHotkey';

export function setup(
  options: NonNullable<ConstructorParameters<typeof DOMHotkey>[0]> = {}
): () => void {
  const domHotkey = new DOMHotkey(options);
  const keydownHandler = (evt: KeyboardEvent): void => {
    domHotkey.fire(evt);
  };
  const keyupHandler = (): void => {
    domHotkey.reset();
  };

  const doc = domHotkey.root.ownerDocument || domHotkey.root;
  doc.addEventListener('keydown', keydownHandler);
  doc.addEventListener('keyup', keyupHandler);

  return (): void => {
    doc.removeEventListener('keydown', keydownHandler);
    doc.removeEventListener('keyup', keyupHandler);
  };
}
