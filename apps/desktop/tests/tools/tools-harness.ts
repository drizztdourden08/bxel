/* @layer renderer-app @kind test */
import { vi } from 'vitest';
import { brockReactMock } from '../keymap/brock-react-mock';

const toolsBrockMock = () => ({
  ...brockReactMock(),
  announce: vi.fn(),
  openContextMenu: vi.fn(),
  contextMenuZone: () => ({}),
  useWidgetLayoutStore: { getState: () => ({ open: vi.fn() }) },
});

export { toolsBrockMock };
