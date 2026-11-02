/* @layer renderer-app @kind logic */
import { encodeBrushPixels } from '@bxel/document';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useDrawingStore } from '../stores/useDrawingStore';
import { useNoticeStore } from '../stores/useNoticeStore';
import { useToolStore } from '../stores/useToolStore';
import { selectedClip } from './selected-clip';
import { BRUSH_REF, BRUSH_SIDE_MAX } from './brush-from-selection.constants';
import { savedBrushes } from './saved-brushes';

const brushFromSelection = (): boolean => {
  const picked = selectedClip();
  if (!picked) return false;
  const { target, clip } = picked;
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
