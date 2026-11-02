/* @layer renderer-app @kind logic */
import { encodeBrushPixels } from '@bxel/document';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useDrawingStore } from '../stores/useDrawingStore';
import { useNoticeStore } from '../stores/useNoticeStore';
import { currentTarget } from './current-target';
import { PATTERN_REF, PATTERN_SIDE_MAX } from './pattern-from-selection.constants';
import { savedPatterns } from './saved-patterns';
import { celPixels } from './selection/cel-pixels';
import { clipOf } from './selection/clip-of';
import { SELECTION_TEXT } from './selection/selection.constants';
import { selectionMask } from './selection/selection-mask';

const patternFromSelection = (): boolean => {
  const target = currentTarget();
  const mask = target ? selectionMask(target) : null;
  const clip = target && mask ? clipOf(celPixels(target), mask) : null;
  if (!target || !clip) {
    useNoticeStore.getState().post(SELECTION_TEXT.nothingSelected);
    return false;
  }
  if (clip.width > PATTERN_SIDE_MAX || clip.height > PATTERN_SIDE_MAX) {
    useNoticeStore.getState().post(`A pattern is at most ${PATTERN_SIDE_MAX} by ${PATTERN_SIDE_MAX} pixels.`);
    return false;
  }
  const result = useDocumentStore.getState().host.execute({
    documentId: target.documentId,
    baseRevision: target.revision,
    mode: 'commit',
    origin: 'ui',
    label: 'New pattern',
    steps: [
      {
        name: 'pattern.add',
        targets: null,
        ref: PATTERN_REF,
        options: {
          name: `Pattern ${savedPatterns().length + 1}`,
          width: clip.width,
          height: clip.height,
          pixels: encodeBrushPixels(clip.pixels.map((value) => (value === 0 ? 0 : 1))),
        },
      },
    ],
    previewPixels: 0,
  });
  const id = result.ok ? result.created[PATTERN_REF] : undefined;
  if (id === undefined) return false;
  useDrawingStore.getState().patch({ patternId: id });
  return true;
};

export { patternFromSelection };
