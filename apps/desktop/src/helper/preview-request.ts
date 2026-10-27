/* @layer helper @kind logic */
import { ANIMATION_PREVIEW_URI, DEFAULT_PREVIEW_SCALE, PREVIEW_URI, SHEET_PREVIEW_URI } from './helper.constants';
import type { PreviewRequest } from './preview-request.type';

const animationRequest = (match: RegExpExecArray): PreviewRequest => {
  const [, documentId, animationId, frameId, tagId, scale] = match;
  const target = { animationId, ...(frameId === undefined ? {} : { frameId }), ...(tagId === undefined ? {} : { tagId }) };
  return { documentId, target, scale: Number(scale ?? DEFAULT_PREVIEW_SCALE) };
};

const previewRequest = (uri: string): PreviewRequest | null => {
  const animation = ANIMATION_PREVIEW_URI.exec(uri);
  if (animation) return animationRequest(animation);
  const sheet = SHEET_PREVIEW_URI.exec(uri);
  if (sheet) return { documentId: sheet[1], target: { sheetId: sheet[2] }, scale: Number(sheet[3] ?? DEFAULT_PREVIEW_SCALE) };
  const sprite = PREVIEW_URI.exec(uri);
  if (!sprite) return null;
  const [, documentId, spriteId, frameId, scale] = sprite;
  return { documentId, target: { spriteId, frameId }, scale: Number(scale ?? DEFAULT_PREVIEW_SCALE) };
};

export { previewRequest };
