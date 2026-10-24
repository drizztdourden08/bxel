/* @layer renderer-app @kind test */
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { vi } from 'vitest';

const toast = vi.fn();

const confirmAction = vi.fn((_options: unknown) => Promise.resolve(true));

const openWidget = vi.fn();

const held: { documents: DocumentsPort | undefined } = { documents: undefined };

const brockReactMock = () => ({
  toast,
  confirmAction,
  getPlatform: () => ({ documents: held.documents }),
  useWidgetLayoutStore: { getState: () => ({ open: openWidget }) },
});

export { brockReactMock, confirmAction, held, openWidget, toast };
