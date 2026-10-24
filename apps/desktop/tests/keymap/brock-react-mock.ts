/* @layer renderer-app @kind test */
import { vi } from 'vitest';

const brockReactMock = () => ({
  shortcutsHelp: { open: vi.fn() },
  toast: vi.fn(),
  commands: { run: vi.fn() },
  getPlatform: vi.fn(),
  commandZone: (zone: string) => ({ 'data-command-zone': zone }),
  useCommands: vi.fn(),
  useRecentDocumentsStore: { getState: vi.fn() },
});

export { brockReactMock };
