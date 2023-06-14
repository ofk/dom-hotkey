import { DOMHotkey } from './DOMHotkey';
import { createHotkeyStrings, metaModifierKey } from './hotkeyStrings';

export function setup(
  options: NonNullable<ConstructorParameters<typeof DOMHotkey>[0]> = {}
): () => void {
  const domHotkey = new DOMHotkey(options);
  const reportedAttributes: Record<string, true> = {};
  const keydownHandler = (evt: KeyboardEvent): void => {
    const result = domHotkey.keydown(evt);
    if (
      !result && // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      (!window.process || process.env.NODE_ENV === 'development')
    ) {
      console.warn(
        `No elements found matching hotkeys: ${domHotkey.keys
          .map((key) => createHotkeyStrings(key.state)[0])
          .join(' ')}`
      );
      const elems = Array.from(
        domHotkey.root.querySelectorAll<HTMLElement>(`[${domHotkey.attribute}]`)
      ).filter((elem) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const attr = elem.getAttribute(domHotkey.attribute)!;
        /* istanbul ignore next */
        if (reportedAttributes[attr]) return false;
        reportedAttributes[attr] = true;
        return true;
      });
      if (elems.length) {
        const kErrorUnnecessarySpaces = 0;
        const kErrorUnknownModifierKeys = 1;
        const kErrorInvalidOrder = 2;
        const kErrorInvalidKey = 3;
        const errorMessages = elems
          .map((elem) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const hotkey = elem.getAttribute(domHotkey.attribute)!;
            const results = hotkey.split(/(?<=\S),(?=\S)/).map((rawKeysString) => {
              const error = [false, false, false, false] as [
                unnecessarySpaces: boolean,
                unknownModifierKeys: boolean,
                invalidOrder: boolean,
                invalidKey: boolean
              ];
              const keysString = rawKeysString.trim().replace(/\s+/g, ' ');
              if (keysString !== rawKeysString) {
                error[kErrorUnnecessarySpaces] = true;
              }
              const keyStrings = keysString.match(
                /(?:(?:c\w*?tr|meta|sup|win|mod|co?m\w*?d|alt|op|shift)\w*\s*\+\s*)*(?:\w+|\S)/gi
              );
              const state = {
                modKey: false,
                ctrlKey: false,
                metaKey: false,
                altKey: false,
                shiftKey: false,
                keys: [] as string[],
              };
              keyStrings?.forEach((keyString) => {
                let orderCount = 0;
                keyString.split(/(?<=.)\+/).forEach((rawKey) => {
                  const key = rawKey.replace(/\s+/g, '');
                  error[kErrorUnnecessarySpaces] = error[kErrorUnnecessarySpaces] || rawKey !== key;
                  if (/^c.*?tr/i.test(key)) {
                    error[kErrorUnknownModifierKeys] =
                      error[kErrorUnknownModifierKeys] || key !== 'Control';
                    error[kErrorInvalidOrder] = error[kErrorInvalidOrder] || orderCount >= 1;
                    orderCount = 1;
                    state.ctrlKey = true;
                  } else if (/^(?:meta|sup|win)/i.test(key)) {
                    error[kErrorUnknownModifierKeys] =
                      error[kErrorUnknownModifierKeys] || key !== 'Meta';
                    error[kErrorInvalidOrder] = error[kErrorInvalidOrder] || orderCount >= 2;
                    orderCount = 2;
                    state.metaKey = true;
                  } else if (/^(?:mod|co?m.*?d)/i.test(key)) {
                    error[kErrorUnknownModifierKeys] =
                      error[kErrorUnknownModifierKeys] || key !== 'Modifier';
                    error[kErrorInvalidOrder] = error[kErrorInvalidOrder] || orderCount !== 0;
                    orderCount = 3;
                    state.modKey = true;
                  } else if (/^shift/i.test(key)) {
                    error[kErrorUnknownModifierKeys] =
                      error[kErrorUnknownModifierKeys] || key !== 'Shift';
                    error[kErrorInvalidOrder] = error[kErrorInvalidOrder] || orderCount >= 4;
                    orderCount = 4;
                    state.shiftKey = true;
                  } else {
                    const validKey =
                      key.length === 1
                        ? key.toLowerCase()
                        : key.charAt(0).toUpperCase() + key.slice(1);
                    error[kErrorInvalidKey] = error[kErrorInvalidKey] || key !== validKey;
                    orderCount = 9;
                    if (/^[A-Z]$/.test(key)) state.shiftKey = true;
                    state.keys.push(validKey);
                  }
                });
              });
              return { hotkey: rawKeysString, state, error };
            });
            return { hotkey, results };
          })
          .filter(({ results }) => results.some(({ error }) => Object.values(error).some((v) => v)))
          .map(({ hotkey: originalHotkey, results }) => {
            const lines = [`- '[${domHotkey.attribute}="${originalHotkey}"]':`];
            results.forEach(({ hotkey, error }) => {
              if (!Object.values(error).some((v) => v)) return;
              const line = [`  - "${hotkey}":`];
              if (error[kErrorInvalidKey]) line.push('Wrong hotkey.');
              if (error[kErrorInvalidOrder]) line.push('Bad order.');
              if (error[kErrorUnknownModifierKeys]) line.push('Includes unknown modifier keys.');
              if (error[kErrorUnnecessarySpaces]) line.push('There are unnecessary spaces.');
              lines.push(line.join(' '));
            });
            const recommendedHotkey = results
              .map(({ state }) =>
                state.keys
                  .map(
                    (key) =>
                      createHotkeyStrings({
                        key,
                        code: key,
                        ...state,
                        ...(state.modKey
                          ? {
                              [metaModifierKey ? 'metaKey' : 'ctrlKey']: true,
                              [metaModifierKey ? 'ctrlKey' : 'metaKey']: false,
                            }
                          : {}),
                      }).reverse()[state.modKey ? 1 : 0]
                  )
                  .join(' ')
              )
              .join(',');
            if (originalHotkey !== recommendedHotkey)
              lines.push(`  - Did you mean '[${domHotkey.attribute}="${recommendedHotkey}"]'?`);
            return lines.join('\n');
          });

        if (errorMessages.length) {
          console.error(
            [
              `Found ${errorMessages.length} elements with the wrong ${domHotkey.attribute} attribute:`,
              ...errorMessages,
            ].join('\n')
          );
        }
      }
    }
  };
  const keyupHandler = (evt: KeyboardEvent): void => {
    domHotkey.keyup(evt);
  };

  const doc = domHotkey.root.ownerDocument || domHotkey.root;
  doc.addEventListener('keydown', keydownHandler);
  doc.addEventListener('keyup', keyupHandler);

  return (): void => {
    doc.removeEventListener('keydown', keydownHandler);
    doc.removeEventListener('keyup', keyupHandler);
  };
}
