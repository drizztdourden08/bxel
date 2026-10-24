/* @layer renderer-app @kind test */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { APP_COMMANDS } from '../../src/keymap/app-commands.constants';

const BROCK_CHORDS = ['mod+k', 'mod+/', 'alt+left'];

const chordsOf = (def: CommandDef): string[] => {
  if (def.chord === undefined) return [];
  if (typeof def.chord === 'string') return [def.chord];
  return 'mac' in def.chord ? [] : [...def.chord];
};

const canonical = (chord: string): string => {
  const parts = chord.split('+').map((part) => part.toLowerCase().replace('mod', 'ctrl'));
  const key = parts.pop() ?? '';
  return [...parts.sort(), key].join('+');
};

const pairsOf = (def: CommandDef): { id: string; key: string }[] => chordsOf(def).map((chord) => ({ id: def.id, key: canonical(chord) }));

const shares = (a: string | undefined, b: string | undefined): boolean => a === undefined || b === undefined || a === b;

const clashes = (): string[] => {
  const owners = new Map<string, CommandDef[]>();
  for (const def of APP_COMMANDS) {
    for (const pair of pairsOf(def)) owners.set(pair.key, [...(owners.get(pair.key) ?? []), def]);
  }
  const found = BROCK_CHORDS.filter((chord) => owners.has(chord)).map((chord) => `${chord}: brock`);
  for (const [chord, defs] of owners) {
    const hits = defs.filter((def) => defs.some((other) => other !== def && shares(def.scope, other.scope) && shares(def.zone, other.zone)));
    if (hits.length > 0) found.push(`${chord}: ${hits.map((def) => def.id).join(', ')}`);
  }
  return found;
};

export { canonical, chordsOf, clashes, pairsOf, shares };
