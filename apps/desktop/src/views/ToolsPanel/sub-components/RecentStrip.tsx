/* @layer renderer-app @kind component */
import { Button, Icon, Stack, Text } from '@drizztdourden08/tessera';
import { memberById } from '../../../editor/tool-catalogue/member-by-id';
import { pickMember } from '../../../editor/tool-pick/pick-member';
import { useToolStore } from '../../../stores/useToolStore';
import { TOOLS_PANEL_TEXT } from '../ToolsPanel.constants';

const RecentStrip = () => {
  const kind = useToolStore((state) => state.activeSurface);
  const recent = useToolStore((state) => state.recentMembers[kind]);
  const found = recent.flatMap((id) => memberById(id)?.member ?? []);
  return (
    <Stack gap="xs" role="group" aria-label={TOOLS_PANEL_TEXT.recent}>
      <Text variant="overline" tone="muted" className="tools-panel__heading">
        {TOOLS_PANEL_TEXT.recent}
      </Text>
      {found.length === 0 ? (
        <Text variant="caption" tone="muted">
          {TOOLS_PANEL_TEXT.recentEmpty}
        </Text>
      ) : (
        <div className="tools-panel__recent">
          {found.map((member) => (
            <Button key={member.id} size="xs" variant="ghost" icon={<Icon name={member.icon} />} onClick={() => pickMember(member)}>
              {member.label}
            </Button>
          ))}
        </div>
      )}
    </Stack>
  );
};

export { RecentStrip };
