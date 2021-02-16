import { HotkeyStrings } from './hotkeyStrings';
export declare class DomHotkey {
    root: HTMLElement | Document;
    attribute: string;
    initialKeyRepeat: number;
    keyRepeat: number;
    keyState: {
        hotkeys: HotkeyStrings | null;
        timeStamp: number;
        count: number;
    };
    constructor({ root, attribute, initialKeyRepeat, keyRepeat, }?: {
        root?: Document | undefined;
        attribute?: string | undefined;
        initialKeyRepeat?: number | undefined;
        keyRepeat?: number | undefined;
    });
    reset(): void;
    updateKeyState(evt: KeyboardEvent): boolean;
    fireDeterminedAction(hotkeys: HotkeyStrings): boolean;
    fire(evt: KeyboardEvent): boolean;
}
export declare function setup(options?: NonNullable<ConstructorParameters<typeof DomHotkey>[0]>): () => void;
