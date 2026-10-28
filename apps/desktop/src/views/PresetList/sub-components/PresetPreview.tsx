/* @layer renderer-app @kind component */
import { Box, Icon } from '@drizztdourden08/tessera';
import { memberById } from '../../../editor/tool-catalogue/member-by-id';
import type { ToolPreset } from '../../../editor/presets/tool-preset.type';
import { BrushPreview } from '../../OptionControls';

const PresetPreview = ({ preset }: { preset: ToolPreset }) => {
  const member = memberById(preset.member)?.member;
  const size = Object.entries(preset.fields).find(([id]) => id.endsWith('.size'))?.[1];
  const tip = Object.entries(preset.fields).find(([id]) => id.endsWith('.tip'))?.[1];
  if (typeof size === 'number' && (tip === 'circle' || tip === 'square')) return <BrushPreview size={size} shape={tip} small />;
  return <Box as="span" className="preset-row__icon">{member && <Icon name={member.icon} />}</Box>;
};

export { PresetPreview };
