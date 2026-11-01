/* @layer renderer-app @kind test */
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { vi } from 'vitest';

const toast = vi.fn();

const announce = vi.fn();

const confirmAction = vi.fn((_options: unknown) => Promise.resolve(true));

const confirmSave = vi.fn((_options: unknown): Promise<'save' | 'discard' | 'cancel'> => Promise.resolve('save'));

const openWidget = vi.fn();

const navClose = vi.fn();

const navOpen = vi.fn();

const palettePick = vi.fn();

const held: { documents: DocumentsPort | undefined } = { documents: undefined };

const brockReactMock = () => ({
  announce,
  toast,
  confirmAction,
  confirmSave,
  getPlatform: () => ({ documents: held.documents }),
  useWidgetLayoutStore: { getState: () => ({ open: openWidget }) },
  nav: { close: navClose, open: navOpen },
  palette: { pick: palettePick },
});

export { brockReactMock, confirmAction, confirmSave, held, navClose, navOpen, openWidget, palettePick, toast };
