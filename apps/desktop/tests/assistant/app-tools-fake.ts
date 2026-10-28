/* @layer renderer-app @kind test */
type FakeCommand = { id: string; label: string; enabled?: boolean; reason?: string | null; ran?: unknown[] };

type FakeItem = { key: string; label: string; value?: unknown; settable?: boolean; visible?: boolean; source?: 'app' | 'custom'; kind?: string; min?: number; max?: number; choices?: string[] };

type FakeScreen = { id: string; label: string; group: string; route: string; items: FakeItem[] };

const fake = {
  calls: [] as string[],
  fails: new Set<string>(),
  screens: [] as FakeScreen[],
  appSet: [] as [string, unknown][],
  sourceStore: new Map<string, unknown>(),
  dialog: null as { id: number; choices: string[] } | null,
  commands: [] as FakeCommand[],
  announced: [] as string[],
  opened: [] as string[],
  closed: 0,
  routes: [{ route: 'settings', title: 'Settings', kind: 'screen' }],
};

export { fake };
export type { FakeCommand, FakeItem, FakeScreen };
