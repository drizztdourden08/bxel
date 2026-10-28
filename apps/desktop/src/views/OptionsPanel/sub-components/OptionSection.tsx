/* @layer renderer-app @kind component */
import { Text } from '@drizztdourden08/tessera';
import type { OptionSpec } from '../../../editor/tool-options/tool-options.type';
import { OptionRow } from '../../OptionControls';
import { OPTIONS_PANEL_TEXT } from '../OptionsPanel.constants';

const groupLabel = (group: string): string => (group in OPTIONS_PANEL_TEXT.groups ? OPTIONS_PANEL_TEXT.groups[group as keyof typeof OPTIONS_PANEL_TEXT.groups] : group);

const OptionSection = ({ group, specs }: { group: string; specs: readonly OptionSpec[] }) => (
  <section className="options-panel__section" aria-label={groupLabel(group)}>
    <Text variant="overline" tone="muted" className="options-panel__heading">
      {groupLabel(group)}
    </Text>
    {specs.map((spec) => (
      <OptionRow key={spec.id} spec={spec} />
    ))}
  </section>
);

export { OptionSection };
