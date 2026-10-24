/* @layer renderer-app @kind logic */
import type { ShortcutKey } from '@drizztdourden08/tessera';
import { CHORD_JOINER, FUNCTION_KEY, MODIFIER_KEYS, NAMED_KEYS } from '../ActionHint.constants';

const keyOf = (name: string): ShortcutKey | null => {
  const named = NAMED_KEYS[name];
  if (named !== undefined) return named;
  if (FUNCTION_KEY.test(name)) return name as ShortcutKey;
  return name.length === 1 ? (name as ShortcutKey) : null;
};

const chordKeys = (chord: string, mac: boolean): ShortcutKey[] => {
  const parts = chord.split(CHORD_JOINER);
  const key = keyOf(parts.pop() ?? '');
  const table = mac ? MODIFIER_KEYS.mac : MODIFIER_KEYS.other;
  const held = parts.map((part) => table[part]);
  const known = held.filter((each): each is ShortcutKey => each !== undefined);
  if (key === null || known.length !== held.length) return [];
  return [...known, key];
};

export { chordKeys };
