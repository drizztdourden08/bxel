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
      {
        ext: 'bxel',
        name: 'Bxel project',
        description: 'A Bxel pixel art project',
        progId: 'Bxel.Document',
        mimeType: 'application/vnd.bxel+zip',
      },
    ],
  },
  targets: ['desktop'],
  modules: ['updater'],
  helpers: { 'bxel-mcp': 'src/helper/main.ts' },
});
