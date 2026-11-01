/* @layer renderer-app @kind logic */
import { hiddenFailure } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import type { DocumentView } from '../../documents/document-host.type';
import type { ToolContext } from '../assistant.type';
import { hiddenAssets } from './hidden-assets';
import { reply } from './reply';
import { spriteFrame } from './sprite-frame';
import type { SpriteFrame } from './tool-input.type';
import { viewFor } from './view-for';

const documentFrame = (context: ToolContext, documentId: string, spriteId: string, frameId: string | undefined): (SpriteFrame & { readonly view: DocumentView }) | ToolReply => {
  const view = viewFor(context, documentId);
  if (!view) return reply(hiddenFailure('document'));
  const found = spriteFrame(view.state.artwork, spriteId, frameId, hiddenAssets(context, documentId));
  return found.ok ? { ...found.value, view } : reply(found);
};

export { documentFrame };
