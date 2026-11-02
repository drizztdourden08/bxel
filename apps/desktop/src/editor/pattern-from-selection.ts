/* @layer renderer-app @kind logic */
import { encodeBrushPixels } from '@bxel/document';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useDrawingStore } from '../stores/useDrawingStore';
import { useNoticeStore } from '../stores/useNoticeStore';
import { selectedClip } from './selected-clip';
import { PATTERN_REF, PATTERN_SIDE_MAX } from './pattern-from-selection.constants';
import { savedPatterns } from './saved-patterns';

const patternFromSelection = (): boolean => {
  const picked = selectedClip();
  if (!picked) return false;
  const { target, clip } = picked;
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
