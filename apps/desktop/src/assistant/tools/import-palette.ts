/* @layer renderer-app @kind logic */
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import type { DocumentId } from '@bxel/document';
import type { AssetDefaults } from '@bxel/project';
import type { PaletteFileSource } from './import-palette.type';
import type { DocumentHost } from '../../documents/document-host.type';
import { SOURCE_DEFAULT } from '../../palette-source/palette-source.constants';
import { readPaletteFile } from '../../palette-source/read-palette-file';
import { paletteDraft } from '../../project-config/palette-draft';
import { uniqueName } from '../../sprite-name/unique-name';
import { runSteps } from '../../transactions/run-steps';
import { TOOL_TEXT } from './tools.constants';

const importPalette = (host: DocumentHost, documentId: DocumentId, source: PaletteFileSource, defaults: AssetDefaults): string | null => {
  const read = readPaletteFile(source.bytes, source.fileName);
  if (!read.ok) return read.message;
  const draft = paletteDraft({ ...SOURCE_DEFAULT, kind: 'file', file: read.palette }, defaults);
  const taken = host.view(documentId)?.state.artwork.banks.map((bank) => bank.name) ?? [];
  const options = { name: uniqueName(draft.name, taken), cap: draft.cap, transparent: draft.transparent, colors: draft.colors };
  const done = runSteps(host, documentId, TOOL_TEXT.importLabel, [{ name: PALETTE_COMMAND_NAME.paletteCreate, targets: null, options }]);
  return done.ok ? null : done.error.message;
};

export { importPalette };
