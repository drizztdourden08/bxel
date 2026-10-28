/* @layer renderer-app @kind component */
import { Button, Icon, Stack, Text } from '@drizztdourden08/tessera';
import { presetFields } from '../../../editor/presets/preset-fields';
import { resetAllTools } from '../../../editor/tool-options/reset-all-tools';
import type { ToolId } from '../../../editor/tool.type';
import { PresetList } from '../../PresetList';
import { OPTIONS_PANEL_TEXT } from '../OptionsPanel.constants';

const PanelFooter = ({ tool }: { tool: ToolId }) => (
  <>
    {presetFields(tool).length > 0 && (
      <Stack gap="xs">
        <Text variant="overline" tone="muted" className="options-panel__heading">
          {OPTIONS_PANEL_TEXT.presets}
        </Text>
        <PresetList tool={tool} />
      </Stack>
    )}
    <Button size="sm" variant="tertiary" icon={<Icon name="rotate-ccw" />} onClick={resetAllTools}>
      {OPTIONS_PANEL_TEXT.resetAll}
    </Button>
  </>
);

export { PanelFooter };
