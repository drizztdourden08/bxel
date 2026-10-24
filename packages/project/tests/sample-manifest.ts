/* @layer tests @kind test */
import type { ProjectManifest } from '@bxel/project';

const sampleManifest = (): ProjectManifest => ({
  format: 'bxel-project',
  formatVersion: 1,
  projectId: 'prj_8d2k4m6q9x1v',
  name: 'Dungeon',
  folders: [
    { folderId: 'fld_7r2k9m4q', name: 'Dungeon', path: '.' },
    { folderId: 'fld_3m8q2k7x', name: 'Palettes', path: 'D:/Art/palettes' },
  ],
  settings: {
    newFiles: { folderId: 'fld_7r2k9m4q', path: 'sprites' },
    exports: { folderId: 'fld_7r2k9m4q', path: 'exports' },
    palette: { folderId: 'fld_3m8q2k7x', path: 'dawnbringer-16.gpl' },
  },
  assistant: { access: 'edit' },
});

export { sampleManifest };
