/* @layer renderer-app @kind logic */
import type { ToolContext } from '../assistant.type';
import { coveredAssets } from './covered-assets';
import { hiddenCover } from './hidden-cover';

const hiddenAssets = (context: ToolContext, documentId: string): ReadonlySet<string> => coveredAssets(context, documentId, hiddenCover(context));

export { hiddenAssets };
