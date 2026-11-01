/* @layer renderer-app @kind constants */
import type { AssetKind } from '@bxel/document';

const LINKED_TAB_KINDS: readonly string[] = ['animation', 'tilemap', 'tileset'];

const LINKED_TARGET_KINDS: readonly AssetKind[] = ['sprite', 'tileset'];

const STAGE_TEXT = {
  loadingLabel: 'Opening the file',
  loadingCount: (done: number, total: number): string => `Opening assets ${done} of ${total}`,
  missingTitle: 'A linked file is missing',
  missingBody: (name: string, target: string): string => `${name} uses ${target}, and that file is no longer where it was.`,
  relink: 'Relink',
  relinkTitle: 'Find the missing file',
  failedMessage: 'Bxel could not open that file.',
  retry: 'Try again',
  reveal: 'Show in folder',
  dismiss: 'Dismiss',
  boundaryLabel: 'This view could not be drawn.',
} as const;

export { LINKED_TAB_KINDS, LINKED_TARGET_KINDS, STAGE_TEXT };
