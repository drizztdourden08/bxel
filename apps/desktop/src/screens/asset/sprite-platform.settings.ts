/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { ASSET_SOURCE } from '../../asset-config/asset-source.constants';
import { showForKind } from '../../asset-config/show-for-kind';

const meta: ScreenMeta = {
  title: 'Platform',
  icon: 'gamepad-2',
  order: 3,
  source: ASSET_SOURCE,
  when: showForKind('sprite'),
  keywords: ['platform', 'preset', 'strict', 'rules', 'enforce', 'snap', 'game boy', 'nes', 'snes'],
};

const sections: Section[] = [
  {
    id: 'platform',
    title: 'Platform rules',
    items: [
      {
        key: 'sprite.platform',
        label: 'Platform',
        description: 'The target the sprite is made for. It sets the size, colour count and palette rules.',
        hint: 'Follow the project uses the platform of the project. Pick one to give this sprite its own.',
      },
      {
        key: 'sprite.platformReport',
        label: 'Rules and findings',
        description: 'What the platform asks for and what this sprite breaks.',
        hint: 'Enforce platform rules blocks a change that would break a rule marked Outside the rules.',
      },
    ],
  },
];

export default sections;
export { meta };
