/* @layer renderer-app @kind logic */
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { canvasMapper } from './canvas-mapper';
import { createProjectInUi } from './create-project-in-ui';
import { APP_DIR, PROJECT_PARENT, TEMP_PREFIX } from './e2e.constants';
import { importPaddedSheet } from './import-padded-sheet';
import { layerIndices } from './layer-indices';
import { openSession } from './open-session';
import { PADDED_SHEET } from './padded-sheet.constants';
import { readSaved } from './read-saved';
import type { SheetRig } from './sheet-rig.type';
import { spriteOf } from './sprite-of';

const SAVE_ALL = 'Control+Alt+s';

const PART_NAMES = ['part_01', 'part_02', 'part_03'] as const;

const SIZE = { width: PADDED_SHEET.cell, height: PADDED_SHEET.cell };

const openSheetRig = async (): Promise<SheetRig> => {
  const session = await openSession();
  const parent = join(APP_DIR, PROJECT_PARENT);
  await mkdir(parent, { recursive: true });
  const root = await mkdtemp(join(parent, TEMP_PREFIX));
  await createProjectInUi(session, root, 'Sheets');
  await importPaddedSheet(session, 'part_');
  const close = session.close;
  return {
    session: { ...session, close: () => close().then(() => rm(root, { recursive: true, force: true })) },
    root,
    saveAll: () => session.page.keyboard.press(SAVE_ALL),
    parts: () =>
      PART_NAMES.map((name) => layerIndices(spriteOf(readSaved(join(root, 'sprites', `${name}.bxsprite`)), name), 'Layer 1')),
    mapper: () => canvasMapper(session, SIZE),
  };
};

export { PART_NAMES, openSheetRig };
