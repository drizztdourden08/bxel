/* @layer renderer-app @kind constants */
import type { ShortcutKey } from '@drizztdourden08/tessera';

const ACTION_HINT_TEXT = {
  or: 'or',
} as const;

const MODIFIER_KEYS: Readonly<Record<'mac' | 'other', Readonly<Record<string, ShortcutKey>>>> = {
  mac: { Mod: 'cmd', Meta: 'ctrl', Ctrl: 'ctrl', Alt: 'alt', Shift: 'shift' },
  other: { Mod: 'ctrl', Meta: 'win', Ctrl: 'ctrl', Alt: 'alt', Shift: 'shift' },
};

const NAMED_KEYS: Readonly<Record<string, ShortcutKey>> = {
  Escape: 'esc',
  Plus: '+',
  Enter: 'enter',
  Space: 'space',
  Tab: 'tab',
  Backspace: 'backspace',
  Delete: 'delete',
  Insert: 'insert',
  Home: 'home',
  End: 'end',
  PageUp: 'pageup',
  PageDown: 'pagedown',
  Up: 'up',
  Down: 'down',
  Left: 'left',
  Right: 'right',
};

const MAC_PLATFORM = /mac|iphone|ipad/i;

const FUNCTION_KEY = /^F([1-9]|1\d|2[0-4])$/;

const CHORD_JOINER = '+';

export { ACTION_HINT_TEXT, CHORD_JOINER, FUNCTION_KEY, MAC_PLATFORM, MODIFIER_KEYS, NAMED_KEYS };
