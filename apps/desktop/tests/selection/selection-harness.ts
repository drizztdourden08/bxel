/* @layer renderer-app @kind test */
import { COMMAND_NAME, flattenFrame } from '@bxel/document';
import type { DocumentId } from '@bxel/document';
import { createDefaultArtwork } from '../../src/documents/create-default-artwork';
import type { DocumentHost } from '../../src/documents/document-host.type';
import { commitRequest } from '../../src/editor/commit-request';
import { currentTarget } from '../../src/editor/current-target';
import type { EditorTarget } from '../../src/editor/editor.type';
import { rectMask } from '@bxel/raster';
import type { MaskView } from '@bxel/raster';
import { setSelection } from '../../src/editor/selection/set-selection';
import { PENDING_DEFAULTS } from '../../src/stores/pending-store.constants';
import { SELECTION_DEFAULTS } from '../../src/stores/selection-store.constants';
import { TOOL_DEFAULTS } from '../../src/stores/tool-store.constants';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { usePendingStore } from '../../src/stores/usePendingStore';
import { useSelectionStore } from '../../src/stores/useSelectionStore';
import { useToolStore } from '../../src/stores/useToolStore';

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SelectionRig {
  host: DocumentHost;
  documentId: DocumentId;
  target: () => EditorTarget;
  pixels: () => Uint8Array;
  paint: (box: Box, index: number) => void;
  select: (box: Box) => MaskView;
}

const openRig = (): SelectionRig => {
  useSelectionStore.setState({ ...SELECTION_DEFAULTS });
  usePendingStore.setState({ ...PENDING_DEFAULTS });
  useToolStore.setState({ ...TOOL_DEFAULTS });
  const host = useDocumentStore.getState().host;
  const documentId = createDefaultArtwork(host);
  const target = (): EditorTarget => {
    const found = currentTarget();
    if (!found) throw new Error('the editor has no target');
    return found;
  };
  return {
    host,
    documentId,
    target,
    pixels: () => flattenFrame(target().sprite, target().frameId),
    paint: (box, index) => {
      const pixels = new Uint8Array(box.width * box.height).fill(index);
      host.execute(commitRequest(target(), 'Paint', { name: COMMAND_NAME.pixelsPatch, options: { rect: box, pixels, skipZero: false } }));
    },
    select: (box) => {
      const mask = rectMask(target().sprite, { from: { x: box.x, y: box.y }, to: { x: box.x + box.width - 1, y: box.y + box.height - 1 } });
      setSelection(target(), mask);
      return mask;
    },
  };
};

const BLOCK: Box = { x: 4, y: 4, width: 4, height: 3 };

const at = (x: number, y: number): number => y * 32 + x;

const countOn = (mask: MaskView | null): number => (mask ? mask.bits.reduce((sum, bit) => sum + bit, 0) : 0);

export { at, BLOCK, countOn, openRig };
export type { Box, SelectionRig };
