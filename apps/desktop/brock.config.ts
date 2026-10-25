/* @layer root-config @kind config */
import { defineBrockConfig } from '@drizztdourden08/brock-build/config';

export default defineBrockConfig({
  product: {
    id: 'bxel',
    name: 'Bxel',
    appId: 'com.drizztdourden08.bxel',
    ports: { base: 23600 },
    description: 'A palette constrained pixel art editor for sprites, animation and sprite sheets.',
    author: { name: 'Drizztdourden_', email: '36481532+drizztdourden08@users.noreply.github.com' },
    icons: {
      brand: 'bxel',
      wordmark: { src: './logos/bxel-wordmark.svg' },
    },
    singleProfile: true,
    fileAssociations: [
      { ext: 'bxsprite', name: 'Bxel sprite', description: 'A Bxel sprite', progId: 'Bxel.Sprite', mimeType: 'application/vnd.bxel.sprite+zip', icon: 'filetypes/bxsprite' },
      { ext: 'bxsheet', name: 'Bxel spritesheet', description: 'A Bxel spritesheet', progId: 'Bxel.Sheet', mimeType: 'application/vnd.bxel.sheet+zip', icon: 'filetypes/bxsheet' },
      { ext: 'bxpalette', name: 'Bxel palette', description: 'A Bxel palette', progId: 'Bxel.Palette', mimeType: 'application/vnd.bxel.palette+zip', icon: 'filetypes/bxpalette' },
      { ext: 'bxtiles', name: 'Bxel tileset', description: 'A Bxel tileset', progId: 'Bxel.Tileset', mimeType: 'application/vnd.bxel.tileset+zip', icon: 'filetypes/bxtiles' },
      { ext: 'bxmap', name: 'Bxel tilemap', description: 'A Bxel tilemap', progId: 'Bxel.Tilemap', mimeType: 'application/vnd.bxel.tilemap+zip', icon: 'filetypes/bxmap' },
      { ext: 'bxproject', name: 'Bxel project', description: 'A Bxel project', progId: 'Bxel.Project', mimeType: 'application/vnd.bxel.project+zip', icon: 'filetypes/bxproject' },
      { ext: 'bxel', name: 'Bxel file (older format)', description: 'An older Bxel file', progId: 'Bxel.Document', mimeType: 'application/vnd.bxel+zip', icon: 'filetypes/bxel' },
    ],
  },
  targets: ['desktop'],
  packaging: {
    extraResources: [{ from: 'demo/Bxel Demo', to: 'demo' }],
    fileAssociations: {
      bxsprite: { role: 'Editor' },
      bxsheet: { role: 'Editor' },
      bxpalette: { role: 'Editor' },
      bxtiles: { role: 'Editor' },
      bxmap: { role: 'Editor' },
      bxproject: { role: 'Editor' },
      bxel: { role: 'Viewer' },
    },
  },
  modules: ['updater'],
  helpers: { 'bxel-mcp': 'src/helper/main.ts' },
});
