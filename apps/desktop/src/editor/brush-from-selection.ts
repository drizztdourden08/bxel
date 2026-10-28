/* @layer renderer-app @kind logic */
import { encodeBrushPixels } from '@bxel/document';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useDrawingStore } from '../stores/useDrawingStore';
import { useNoticeStore } from '../stores/useNoticeStore';
import { useToolStore } from '../stores/useToolStore';
import { currentTarget } from './current-target';
import { celPixels } from './selection/cel-pixels';
import { clipOf } from './selection/clip-of';
import { SELECTION_TEXT } from './selection/selection.constants';
import { selectionMask } from './selection/selection-mask';
import { savedBrushes } from './saved-brushes';

const BRUSH_SIDE_MAX = 64;
const BRUSH_REF = 'brush';

const brushFromSelection = (): boolean => {
  const target = currentTarget();
  const mask = target ? selectionMask(target) : null;
  const clip = target && mask ? clipOf(celPixels(target), mask) : null;
  if (!target || !clip) {
    useNoticeStore.getState().post(SELECTION_TEXT.nothingSelected);
    return false;
  }
  if (clip.width > BRUSH_SIDE_MAX || clip.height > BRUSH_SIDE_MAX) {
    useNoticeStore.getState().post(`A brush is at most ${BRUSH_SIDE_MAX} by ${BRUSH_SIDE_MAX} pixels.`);
    return false;
  }
  const result = useDocumentStore.getState().host.execute({
    documentId: target.documentId,
    baseRevision: target.revision,
    mode: 'commit',
    origin: 'ui',
    label: 'New brush',
    steps: [
      {
        name: 'brush.add',
        targets: null,
        ref: BRUSH_REF,
        options: { name: `Brush ${savedBrushes().length + 1}`, width: clip.width, height: clip.height, pixels: encodeBrushPixels(clip.pixels) },
      },
    ],
    previewPixels: 0,
  });
  const id = result.ok ? result.created[BRUSH_REF] : undefined;
  if (id === undefined) return false;
  useDrawingStore.getState().patch({ brushId: id });
  useToolStore.getState().selectTool('pencil');
  return true;
};

export { brushFromSelection };
