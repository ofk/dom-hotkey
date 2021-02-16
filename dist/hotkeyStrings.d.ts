import { HotkeyState, createHotkeyState } from './hotkeyState';
export declare type HotkeyStrings = [string, ...string[]];
export declare const metaModifierKey: boolean;
export declare function createHotkeyStringsFromState(state: HotkeyState): HotkeyStrings;
export declare function createHotkeyStrings(evt: Parameters<typeof createHotkeyState>[0]): HotkeyStrings;
