/* @layer tests @kind test */
import type { ProjectManifest, ProjectDocument } from '@bxel/project';
import { sampleManifest } from './sample-manifest';

const sampleSets = (): ProjectManifest['swatchSets'] => [
  {
    setId: 'sws_aaaaaa11',
    name: 'Dawn Ones',
    colors: [
      { rgb: '#112233', name: 'Ink' },
      { rgb: '#ffffff', name: '' },
      { rgb: '#a0b0c0', name: 'Haze' },
    ],
  },
  {
    setId: 'sws_bbbbbb22',
    name: 'Dawn Ones',
    colors: [{ rgb: '#ff0000', name: 'Red' }],
  },
];

const sampleV1WithSets = (): ProjectManifest => ({ ...sampleManifest(), swatchSets: sampleSets() });

const sampleDocument = (): ProjectDocument => ({
  format: 'bxel-project',
  formatVersion: 2,
  projectId: 'prj_8d2k4m6q9x1v',
  name: 'Dungeon',
  folders: [
    {
      folderId: 'fld_7r2k9m4q',
      name: 'Dungeon',
      path: '.',
      roles: { sprites: 'sprites', sheets: 'sheets', palettes: 'palettes', tilemaps: 'tilemaps', exports: 'exports' },
    },
    { folderId: 'fld_3m8q2k7x', name: 'Shared', path: 'D:/Art/shared', roles: { palettes: '.' } },
  ],
  defaults: {
    size: { width: 32, height: 32 },
    colorLimit: 16,
    palette: { kind: 'file', folderId: 'fld_3m8q2k7x', path: 'dawn.bxpalette' },
    platformId: 'game-boy',
    platformStrict: true,
  },
  assistant: { access: 'edit', folders: ['fld_7r2k9m4q'] },
});

export { sampleV1WithSets, sampleDocument };
