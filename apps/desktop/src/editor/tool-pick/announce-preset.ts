/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import type { ToolPreset } from '../presets/tool-preset.type';

const announcePreset = (preset: ToolPreset): void => announce(`Preset ${preset.name}`);

export { announcePreset };
