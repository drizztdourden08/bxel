/* @layer root-config @kind config */
import { defineBrockConfig } from '@drizztdourden08/brock-build/config';

export default defineBrockConfig({
  product: {
    id: 'bxel',
    name: 'Bxel',
    appId: 'com.drizztdourden08.bxel',
    ports: { base: 23600 },
    description: 'A blank Brock app.',
    author: { name: 'Drizztdourden_', email: '36481532+drizztdourden08@users.noreply.github.com' },
    icons: { brand: 'brock' },
  },
  targets: ['desktop'],
  modules: ['updater'],
});
