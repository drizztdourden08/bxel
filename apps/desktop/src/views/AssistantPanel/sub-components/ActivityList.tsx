/* @layer renderer-app @kind component */
import { ListItemList, ListItemRow, SettingsSection, Text } from '@drizztdourden08/tessera';
import { ACTIVITY_SHOWN, PANEL_TEXT } from '../AssistantPanel.constants';
import type { PanelPartProps } from '../AssistantPanel.type';

const ActivityList = ({ model }: PanelPartProps) => (
  <SettingsSection id="recent-calls" title={PANEL_TEXT.activityTitle} description={PANEL_TEXT.activityHint}>
    {model.activity.length === 0 ? (
      <Text tone="muted">{PANEL_TEXT.activityEmpty}</Text>
    ) : (
      <ListItemList label={PANEL_TEXT.activityTitle}>
        {model.activity.slice(0, ACTIVITY_SHOWN).map((entry) => (
          <ListItemRow
            key={`${entry.at}-${entry.tool}`}
            name={entry.tool}
            meta={`${new Date(entry.at).toLocaleTimeString()}, ${entry.client}, ${entry.code}, ${entry.durationMs} ms`}
          />
        ))}
      </ListItemList>
    )}
  </SettingsSection>
);

export { ActivityList };
