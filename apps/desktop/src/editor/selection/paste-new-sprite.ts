/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, TargetScope } from '@bxel/document';
import { runDocument } from '../../sheet/run-document';
import { useDocumentStore } from '../../stores/useDocumentStore';
import { useNoticeStore } from '../../stores/useNoticeStore';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { currentTarget } from '../current-target';
import { freeSpriteName } from './free-sprite-name';
import { NEW_SPRITE_REF, SELECTION_LABELS, SELECTION_TEXT } from './selection.constants';

const pasteNewSprite = (): boolean => {
  const clip = useSelectionStore.getState().clipboard;
  const target = currentTarget();
  const artwork = target ? useDocumentStore.getState().host.view(target.documentId)?.state.artwork : undefined;
  if (!clip || !target || !artwork) {
    useNoticeStore.getState().post(SELECTION_TEXT.nothingToPaste);
    return false;
  }
  const scope: TargetScope = { sprites: [{ ref: NEW_SPRITE_REF }], layers: { by: 'all' }, frames: { by: 'all' } };
  const steps: CommandStep[] = [
    {
      name: COMMAND_NAME.spriteCreate,
      targets: null,
      options: { name: freeSpriteName(artwork, SELECTION_LABELS.pastedName), width: clip.width, height: clip.height, bankId: target.sprite.bankId },
      ref: NEW_SPRITE_REF,
    },
    { name: COMMAND_NAME.pixelsPatch, targets: scope, options: { rect: { x: 0, y: 0, width: clip.width, height: clip.height }, pixels: clip.pixels, skipZero: true } },
  ];
  return runDocument(SELECTION_LABELS.pasteSprite, steps) !== null;
};

export { pasteNewSprite };
