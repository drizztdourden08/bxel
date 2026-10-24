/* @layer renderer-app @kind constants */
import { platformGroups } from '../../platform-preset/platform-groups';

const NUMBER_LABEL = { colorLimit: 'Colour limit', frameDurationMs: 'Frame time' } as const;

const NUMBER_UNIT = { colorLimit: 'colours', frameDurationMs: 'ms' } as const;

const TOGGLE_LABEL = { platformStrict: 'Enforce platform rules', transparent: 'Transparent slot' } as const;

const PLATFORM_GROUPS = platformGroups();

export { NUMBER_LABEL, NUMBER_UNIT, PLATFORM_GROUPS, TOGGLE_LABEL };
