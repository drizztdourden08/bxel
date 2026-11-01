/* @layer renderer-app @kind logic */
import { dropKind } from '../file-ops/drop-kind';
import type { CanvasDropPayload } from './canvas-drop.type';

const canDropOnCanvas = (payload: CanvasDropPayload, hasBank: (id: string) => boolean): boolean => {
  if ('files' in payload) return payload.files.some((each) => dropKind(each.file) !== 'copy');
  return payload.some((asset) => asset.kind === 'palette' && asset.assetId !== null && hasBank(asset.assetId));
};

export { canDropOnCanvas };
