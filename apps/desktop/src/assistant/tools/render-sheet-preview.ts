/* @layer renderer-app @kind logic */
import type { ToolReply } from '@bxel/mcp';
import type { DocumentView } from '../../documents/document-host.type';
import type { ToolContext } from '../assistant.type';
import { hiddenAssets } from './hidden-assets';
import { pngReply } from './png-reply';
import { sheetPng } from './sheet-png';
import type { RenderInput, SheetSource } from './tool-input.type';

const renderSheetPreview = async (context: ToolContext, view: DocumentView, input: RenderInput, source: SheetSource): Promise<ToolReply> => {
  const { documentId, scale } = input;
  const exported = input.exported === true;
  const { revision, artwork } = view.state;
  const png = sheetPng({ artwork, revision, sheetId: source.sheetId, scale, hidden: hiddenAssets(context, documentId), exported });
  const uri = `bxel://${documentId}/sheet/${source.sheetId}/preview.png?scale=${scale}${exported ? '&exported=1' : ''}&rev=${revision}`;
  return pngReply(png, { revision, scale, uri });
};

export { renderSheetPreview };
