/* @layer tests @kind test */
const DOC = 'doc_4k9m2q7x1v8c';
const SPRITE = 'spr_4k9m2q7x1v8c';
const PROJECT = 'prj_8d2k4m6q9x1v';
const FOLDER = 'fld_7r2k9m4q';
const LOCATION = { projectId: PROJECT, folderId: FOLDER, path: 'sprites/hero.bxsprite' };

const ASSET_INPUT_EXAMPLES: Record<string, unknown> = {
  list_assets: { projectId: PROJECT, kinds: ['sprite', 'sheet'], folderId: FOLDER, usedBy: SPRITE },
  split_legacy_file: { file: { ...LOCATION, path: 'old.bxel' } },
};

const ASSET_OUTPUT_EXAMPLES: Record<string, unknown> = {
  list_assets: {
    ok: true,
    projectId: PROJECT,
    assets: [
      { kind: 'sprite', id: SPRITE, name: 'idle', fileName: 'idle.bxsprite', location: LOCATION, dirty: false, opened: true, usedBy: [], documentId: DOC, modifiedAt: '2026-10-23T19:42:10Z' },
    ],
    total: 1,
    notOpened: 0,
    truncated: false,
  },
  split_legacy_file: { ok: true, files: [{ kind: 'sprite', name: 'idle', location: LOCATION, renamed: false }], skipped: 0 },
};

export { ASSET_INPUT_EXAMPLES, ASSET_OUTPUT_EXAMPLES };
