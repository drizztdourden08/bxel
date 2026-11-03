/* @layer renderer-app @kind component */
import { Box, Text } from '@drizztdourden08/tessera';
import type { OptionSpec } from '../../../editor/tool-options/tool-options.type';
import { OptionRow } from '../../OptionControls';
import { OPTIONS_PANEL_TEXT } from '../OptionsPanel.constants';

const groupLabel = (group: string): string => (group in OPTIONS_PANEL_TEXT.groups ? OPTIONS_PANEL_TEXT.groups[group as keyof typeof OPTIONS_PANEL_TEXT.groups] : group);

const OptionSection = ({ group, specs }: { group: string; specs: readonly OptionSpec[] }) => (
  <Box as="section" className="tool-options__section" aria-label={groupLabel(group)}>
    <Text variant="overline" tone="muted" className="tool-options__heading">
      {groupLabel(group)}
    </Text>
    {specs.map((spec) => (
      <OptionRow key={spec.id} spec={spec} />
    ))}
  </Box>
);

export { OptionSection };
