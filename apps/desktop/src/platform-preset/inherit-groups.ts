/* @layer renderer-app @kind logic */
import { platformGroups } from './platform-groups';
import { PLATFORM_TEXT } from './platform-preset.constants';
import type { PlatformGroup } from './platform-preset.type';
import { presetById } from './preset-by-id';

const inheritGroups = (projectPlatformId: string | undefined): PlatformGroup[] => [
  { label: PLATFORM_TEXT.inheritGroup, options: [{ value: '', label: PLATFORM_TEXT.projectDefault(presetById(projectPlatformId)?.name ?? PLATFORM_TEXT.none) }] },
  ...platformGroups().slice(1),
];

export { inheritGroups };
