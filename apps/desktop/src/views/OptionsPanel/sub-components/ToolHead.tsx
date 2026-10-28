/* @layer renderer-app @kind component */
import { Button, Icon, Tag, Text } from '@drizztdourden08/tessera';
import { matchingPreset } from '../../../editor/presets/matching-preset';
import { openSaveDraft } from '../../../editor/presets/open-save-draft';
import { presetsOfTool } from '../../../editor/presets/presets-of-tool';
import { allPresets } from '../../../editor/presets/all-presets';
import { shownMember } from '../../../editor/tool-catalogue/shown-member';
import type { ToolSlot } from '../../../editor/tool-catalogue/tool-catalogue.type';
import { resetTool } from '../../../editor/tool-options/reset-tool';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import { useToolPresetStore } from '../../../stores/useToolPresetStore';
import { useToolStore } from '../../../stores/useToolStore';
import { BrushPreview } from '../../OptionControls';
import { OPTIONS_PANEL_TEXT } from '../OptionsPanel.constants';

const BRUSH_TOOLS = ['pencil', 'eraser', 'shape'];

const ToolHead = ({ slot, editable }: { slot: ToolSlot; editable: boolean }) => {
  const shape = useToolStore((state) => state.shape);
  const size = useToolStore((state) => state.brushSize);
  const tip = useToolStore((state) => state.brushShape);
  const variant = useSelectionStore((state) => state.variant);
  const user = useToolPresetStore((state) => state.user);
  const member = shownMember(slot, { shape, variant });
  const matched = matchingPreset(presetsOfTool(allPresets(user), slot.tool), member.id);
  return (
    <header className="options-panel__head">
      {BRUSH_TOOLS.includes(slot.tool) ? (
        <BrushPreview size={size} shape={tip} />
      ) : (
        <span className="options-panel__tool-icon">
          <Icon name={member.icon} />
        </span>
      )}
      <div className="options-panel__title">
        <Text variant="title">{member.label}</Text>
        {editable && <Tag color={matched ? 'primary' : 'neutral'}>{matched?.name ?? OPTIONS_PANEL_TEXT.custom}</Tag>}
        <Text variant="caption" tone="muted">
          {member.description}
        </Text>
      </div>
      {editable && (
        <div className="options-panel__actions">
          <Button size="sm" variant="secondary" icon={<Icon name="save" />} onClick={() => void openSaveDraft()}>
            Save as preset
          </Button>
          <Button size="sm" variant="tertiary" icon={<Icon name="rotate-ccw" />} onClick={() => resetTool(slot.tool)}>
            {OPTIONS_PANEL_TEXT.resetTool}
          </Button>
        </div>
      )}
    </header>
  );
};

export { ToolHead };
