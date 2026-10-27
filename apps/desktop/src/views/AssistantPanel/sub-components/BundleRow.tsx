/* @layer renderer-app @kind component */
import type { Level, ToolName } from '@bxel/mcp';
import { Badge, Disclosure, SettingsRow, Stack } from '@drizztdourden08/tessera';
import { GRANT_TEXT_UI } from '../ProgramGrant.constants';
import type { BundleRowModel } from '../behavior/grant-rows.type';
import { LevelControl } from './LevelControl';
import { ToolRow } from './ToolRow';

type BundleRowProps = {
  readonly row: BundleRowModel;
  readonly searching: boolean;
  readonly onBundle: (level: Level) => void;
  readonly onTool: (tool: ToolName, level: Level) => void;
  readonly onFollow: (tool: ToolName) => void;
};

const BundleRow = ({ row, searching, onBundle, onTool, onFollow }: BundleRowProps) => (
  <Stack gap="sm">
    <SettingsRow
      id={`bundle-${row.id}`}
      title={row.label}
      description={row.note === null ? row.description : `${row.description} ${row.note}`}
      badge={row.overrides > 0 ? <Badge variant="inline" value={row.overrides} color="info" label={GRANT_TEXT_UI.overrides(row.overrides)} /> : undefined}
      input={{ kind: 'custom', control: <LevelControl name={row.name} level={row.level} options={row.options} onChange={onBundle} /> }}
    />
    {row.tools.length > 0 && (
      <Disclosure size="sm" summary={GRANT_TEXT_UI.toolCount(row.tools.length, row.label, row.overrides)} defaultOpen={searching}>
        <Stack gap="sm">
          {row.tools.map((tool) => (
            <ToolRow key={tool.id} row={tool} onChange={(level) => onTool(tool.id, level)} onFollow={() => onFollow(tool.id)} />
          ))}
        </Stack>
      </Disclosure>
    )}
  </Stack>
);

export { BundleRow };
