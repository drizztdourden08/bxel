/* @layer renderer-app @kind test */
type FakeCommand = { id: string; label: string; enabled?: boolean; reason?: string | null; ran?: unknown[] };

const fake = {
  commands: [] as FakeCommand[],
  announced: [] as string[],
  opened: [] as string[],
  closed: 0,
  routes: [{ route: 'settings', title: 'Settings' }],
};

export { fake };
export type { FakeCommand };
