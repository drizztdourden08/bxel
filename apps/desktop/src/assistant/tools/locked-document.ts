/* @layer renderer-app @kind logic */
import type { ToolContext } from '../assistant.type';
import { coveredAssets } from './covered-assets';
import { lockedCover } from './locked-cover';
import { wholeCovered } from './whole-covered';

const lockedDocument = (context: ToolContext, documentId: string): boolean => {
  const cover = lockedCover(context);
  return wholeCovered(context, documentId, cover) || coveredAssets(context, documentId, cover).size > 0;
};

export { lockedDocument };
