export interface HotkeyState {
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
    key: string;
}
export declare function createHotkeyState({ ctrlKey, metaKey, shiftKey, key, }: Pick<KeyboardEvent, 'ctrlKey' | 'metaKey' | 'shiftKey' | 'key'>): HotkeyState;
