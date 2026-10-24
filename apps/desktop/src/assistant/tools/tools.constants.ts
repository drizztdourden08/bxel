/* @layer renderer-app @kind constants */
const RECENT_ID_LENGTH = 12;

const ASSISTANT_FOLDER_NAME = 'Bxel Assistant';

const REQUEST_MEMORY_MAX = 200;

const FILE_KIND_OF: Readonly<Record<string, 'bxel' | 'image' | 'palette' | 'sheet_json'>> = {
  bxel: 'bxel',
  png: 'image',
  gif: 'image',
  gpl: 'palette',
  hex: 'palette',
  json: 'sheet_json',
};

const TOOL_TEXT = {
  notHere: 'This tool is answered by the helper or by Bxel main, not by the editor.',
  busy: 'The owner is in the middle of an edit on this document. Reads still work; try the edit again shortly.',
  notFound: 'The sprite, layer or frame is not in this document. Call get_document.',
  outside: 'The rectangle reaches outside the sprite.',
  tooLarge: (side: number) => `The image would be more than ${side} pixels on a side. Ask for a smaller scale.`,
  pngTooLarge: 'The PNG is larger than one reply may carry. Ask for a smaller scale.',
  noSheet: 'Sheet previews and sheet exports are not offered yet. Name a sprite.',
  noProjects: 'Projects are not offered yet. Use a file name in the assistant folder.',
  needsName: 'The document has no file yet. Give a file name.',
  unsaved: 'The document has unsaved changes. Save it first, or pass discard: true.',
  notBxel: 'Release 1 opens .bxel files only.',
  noFolder: 'The project has no such folder. Call list_places.',
  folderNotOpen: 'The owner has not allowed Bxel to look in this folder yet. Ask the owner to open the project in Bxel.',
  folderUnreadable: 'That folder does not exist or cannot be listed.',
  noFile: 'No such file in the project. Call list_files.',
  noTarget: 'Bxel main did not resolve a place for this write.',
  labelOf: (client: string, label: string) => `Assistant (${client}): ${label}`.slice(0, 200),
  stale: (current: number) => `The document is at revision ${current}. Read it again and retry.`,
  formatMissing: 'Only png is offered in this build.',
  undoNotOwn: 'The newest change was made by the owner or another program. Ask the owner to undo in Bxel.',
  nothingToUndo: 'There is nothing to undo.',
} as const;

export { ASSISTANT_FOLDER_NAME, FILE_KIND_OF, RECENT_ID_LENGTH, REQUEST_MEMORY_MAX, TOOL_TEXT };
