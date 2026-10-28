/* @layer renderer-app @kind component */
import { Stack } from '@drizztdourden08/tessera';
import { memberOptions } from '../../../editor/tool-options/member-options';
import type { ToolId } from '../../../editor/tool.type';
import type { Surface } from '../../../editor/tool-catalogue/surface.type';
import { OptionRow } from '../../OptionControls';

const ActiveOptions = ({ surface, tool }: { surface: Surface; tool: ToolId }) => {
  const specs = memberOptions(surface, tool);
  if (specs.length === 0) return null;
  return (
    <Stack gap="xs" className="tools-panel__options">
      {specs.map((spec) => (
        <OptionRow key={spec.id} spec={spec} compact />
      ))}
    </Stack>
  );
};

export { ActiveOptions };
