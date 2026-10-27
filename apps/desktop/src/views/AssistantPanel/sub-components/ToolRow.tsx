/* @layer renderer-app @kind component */
import type { Level } from '@bxel/mcp';
import { Badge, Flex, Icon, IconButton, SettingsRow } from '@drizztdourden08/tessera';
import { GRANT_TEXT_UI } from '../ProgramGrant.constants';
import type { ToolRowModel } from '../behavior/grant-rows.type';
import { LevelControl } from './LevelControl';

type ToolRowProps = {
  readonly row: ToolRowModel;
  readonly onChange: (level: Level) => void;
  readonly onFollow: () => void;
};

const ToolRow = ({ row, onChange, onFollow }: ToolRowProps) => (
  <SettingsRow
    id={`tool-${row.id}`}
    title={row.id}
    description={row.description}
    badge={row.overridden ? <Badge variant="inline" value="Override" color="info" label={GRANT_TEXT_UI.overrideBadge} /> : undefined}
    input={{
      kind: 'custom',
      control: (
        <Flex gap="sm" align="center">
          <LevelControl name={row.name} level={row.level} options={row.options} onChange={onChange} />
          {row.overridden && (
            <IconButton size="sm" variant="ghost" label={row.followLabel} onClick={onFollow}>
              <Icon name="rotate-ccw" />
            </IconButton>
          )}
        </Flex>
      ),
    }}
  />
);

export { ToolRow };
