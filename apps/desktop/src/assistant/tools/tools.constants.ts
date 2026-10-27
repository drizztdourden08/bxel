/* @layer renderer-app @kind constants */
import type { EntryKind } from '@bxel/project';
import type { WireFileKind } from './tool-input.type';

const RECENT_ID_LENGTH = 12;

const ASSISTANT_FOLDER_NAME = 'Bxel Assistant';

const REQUEST_MEMORY_MAX = 200;

const WIRE_KIND_OF: Readonly<Record<EntryKind, WireFileKind>> = {
  sprite: 'bxel',
  animation: 'bxel',
  sheet: 'bxel',
  tileset: 'bxel',
  tilemap: 'bxel',
  project: 'other',
  legacy: 'bxel',
  palette: 'palette',
  image: 'image',
  data: 'sheet_json',
  other: 'other',
};

const TOOL_TEXT = {
  notHere: 'This tool is answered by the helper or by Bxel main, not by the editor.',
  busy: 'The owner is in the middle of an edit on this document. Reads still work; try the edit again shortly.',
  notFound: 'The sprite, layer or frame is not in this document. Call get_document.',
  readOnlyProject: 'This project is granted read only. Ask the owner to grant editing in Project settings.',
  noMap: 'The tilemap or its layer is not in this document. Call list_map_layers.',
  outsideMap: 'The rectangle reaches outside the map.',
  outside: 'The rectangle reaches outside the sprite.',
  tooLarge: (side: number) => `The image would be more than ${side} pixels on a side. Ask for a smaller scale.`,
  pngTooLarge: 'The PNG is larger than one reply may carry. Ask for a smaller scale.',
  noSheetFound: 'The sheet is not in this document. Call get_document.',
  noSheetImage: 'The sheet has no image to draw. Add sprites to it first.',
  sheetFormat: 'A sheet exports as png only.',
  noAnimation: 'The animation, its frame or its tag is not in this document. Call get_animation.',
  emptyAnimation: 'The animation has no frames to draw.',
  gifSprite: 'Only an animation can be exported as gif. Name an animation, or use png.',
  needsName: 'The document has no file yet. Give a file name.',
  unsaved: 'The document has unsaved changes. Save it first, or pass discard: true.',
  notBxel: 'Bxel opens sprites, animations, sheets, palettes, tilesets, tilemaps and older .bxel files. A project file is opened by the owner, never by the assistant: it switches the owner project.',
  noAssetOfKind: 'The document has no asset of the kind the file name ends with. Use .bxsprite, .bxanim, .bxsheet, .bxpalette, .bxtiles or .bxmap.',
  noFolder: 'The project has no such folder. Call list_places.',
  folderNotOpen: 'The owner has not allowed Bxel to look in this folder yet. Ask the owner to open the project in Bxel.',
  folderUnreadable: 'That folder does not exist or cannot be listed.',
  noFile: 'No such file in the project. Call list_files.',
  onlyOlderFiles: 'Only an older .bxel file can be split. Open the newer files with open_file.',
  notReadable: 'The older file could not be read.',
  noAsset: 'The document has no such asset.',
  fileInUse: 'Another document or asset open in Bxel already uses that file. Pick another file name.',
  fileExists: 'A file with that name is already there. Pass overwrite: true to replace it.',
  writeRefused: (reason: string) => `Bxel was not allowed to write there. ${reason}`,
  noFolderForAsset: 'there is no folder to put its file in',
  dependencyUnsaved: (list: string) =>
    `These assets are linked but have no file yet, and Bxel could not give them one: ${list}. Save them first to a place that is allowed, or ask the owner to change the write setting.`,
  needsOwner: (dialog: string) => `This needs the owner at the window (a ${dialog} dialog). Bxel does not open dialogs for the assistant. Ask the owner to do it in Bxel.`,
  noTarget: 'Bxel main did not resolve a place for this write.',
  labelOf: (client: string, label: string) => `Assistant (${client}): ${label}`.slice(0, 200),
  stale: (current: number) => `The document is at revision ${current}. Read it again and retry.`,
  formatMissing: 'A sprite exports as png or png-indexed, an animation as png, png-indexed or gif, and a sheet as png.',
  undoNotOwn: 'The newest change was made by the owner or another program. Ask the owner to undo in Bxel.',
  nothingToUndo: 'There is nothing to undo.',
} as const;

export { ASSISTANT_FOLDER_NAME, RECENT_ID_LENGTH, REQUEST_MEMORY_MAX, TOOL_TEXT, WIRE_KIND_OF };
