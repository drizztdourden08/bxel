/* @layer renderer-app @kind test */
const bindings = new Map<string, string[]>();

const bind = (id: string, chords: string[]): void => {
  bindings.set(id, chords);
};

const unbindAll = (): void => bindings.clear();

const brockChords = () => ({
  commands: { chords: (id: string): string[] => bindings.get(id) ?? [] },
});

export { bind, brockChords, unbindAll };
