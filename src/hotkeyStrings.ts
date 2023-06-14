import type { HotkeyState } from './hotkeyState';

export type HotkeyStrings = [string, ...string[]];

export const metaModifierKey = /Mac|iPod|iPhone|iPad/.test(
  typeof navigator !== 'undefined' ? navigator.platform : ''
);

function toCtrlMetaStrings({ ctrlKey, metaKey }: HotkeyState): HotkeyStrings {
  const ctrlMeta = `${ctrlKey ? '+Control' : ''}${metaKey ? '+Meta' : ''}`;
  const isModkey = metaModifierKey
    ? /* istanbul ignore next */ !ctrlKey && metaKey
    : ctrlKey && !metaKey;
  return isModkey ? ['+Modifier', ctrlMeta] : [ctrlMeta];
}

const regModifierKeys = /^(?:Control|Meta|Alt|Shift)$/;

const codeToKey: Record<string, string | undefined> = {
  Minus: '-',
  Equal: '=',
  BracketLeft: '[',
  BracketRight: ']',
  Semicolon: ';',
  Quote: "'",
  Backquote: '`',
  Backslash: '\\',
  Comma: ',',
  Period: '.',
  Slash: '/',
};

function toAltShitKeyStrings({ altKey, shiftKey, key, code }: HotkeyState): HotkeyStrings {
  // eslint-disable-next-line no-nested-ternary
  const plusKey = regModifierKeys.test(key) ? '' : key === ' ' ? '+Space' : `+${key}`;
  if (!altKey && !shiftKey) {
    return [plusKey];
  }

  const alt = altKey ? '+Alt' : '';
  const shift = shiftKey ? '+Shift' : '';
  if (shiftKey && /^\+[A-Z]$/.test(plusKey)) {
    return [`${alt}${shift}${plusKey.toLowerCase()}`, `${alt}${plusKey}`];
  }

  const fixedCode = /^(?:Key[A-Z]|(?:Digit|Numpad)[0-9])$/.test(code)
    ? code.slice(-1).toLowerCase()
    : codeToKey[code];
  if (fixedCode) {
    if (shiftKey && /^\+[\x21-\x7e]$/.test(plusKey)) {
      return [`${alt}${shift}+${fixedCode}`, `${alt}${plusKey}`];
    }
    if (altKey && !/^\+[\x21-\x7e]$/.test(plusKey)) {
      return [
        `${alt}${shift}+${fixedCode}`,
        ...(shiftKey && /^[a-z]$/.test(fixedCode) ? [`${alt}+${fixedCode.toUpperCase()}`] : []),
        plusKey,
      ];
    }
  }

  return [`${alt}${shift}${plusKey}`];
}

export function createHotkeyStrings(state: HotkeyState): HotkeyStrings {
  // a -> ['a']
  // Control+a -> ['Control+a']
  // Meta+a -> ['Modifier+a', 'Meta+a']
  // Shift+a -> ['Shift+a', 'A']
  // Shift+1 -> ['Shift+1', '!']
  // Shift+/ -> ['Shift+/', '?']
  // Shift+Enter -> ['Shift+Enter']
  // Alt+a -> ['Alt+a', 'å']
  // Alt+Shift+a -> ['Alt+Shift+a', 'Alt+A', 'Å']
  // Meta+Shift+A -> ['Modifier+Shit+a','Meta+Shift+a','Modifier+A','Meta+A']
  const ctrlMetaStrings = toCtrlMetaStrings(state);
  const altShitKeyStrings = toAltShitKeyStrings(state);
  const hotkeys = altShitKeyStrings.reduce(
    (result, altShiftKey) => [
      ...result,
      ...ctrlMetaStrings.map((ctrlMeta) => `${ctrlMeta}${altShiftKey}`.slice(1)),
    ],
    [] as string[]
  );
  return hotkeys as HotkeyStrings;
}
