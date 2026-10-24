/* @layer renderer-app @kind test */
const bindings = new Map<string, string[]>();

const bind = (id: string, chords: string[]): void => {
  bindings.set(id, chords);
};

const unbindAll = (): void => bindings.clear();

const keycap = (part: string): string => {
  if (part === 'Mod') return 'ctrl';
  return part.length > 1 ? part.toLowerCase() : part;
};

const brockChords = () => ({
  commands: { chords: (id: string): string[] => bindings.get(id) ?? [] },
  useCommandChords: (id: string): string[] => bindings.get(id) ?? [],
  useIsMac: (): boolean => false,
  chordKeys: (chord: string): string[] => chord.split('+').map(keycap),
});

export { bind, brockChords, unbindAll };
