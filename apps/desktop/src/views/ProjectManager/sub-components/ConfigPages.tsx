/* @layer renderer-app @kind component */
import { Callout, Icon, ListItemList, ListItemRow, PanelContainer, Stack } from '@drizztdourden08/tessera';
import { CONFIG_PAGES, MANAGER_TEXT } from '../../../project-manager/project-manager.constants';
import type { ManagerPartProps } from '../ProjectManager.type';

const ConfigPages = ({ model }: ManagerPartProps) => (
  <PanelContainer title={MANAGER_TEXT.configTitle} level={3}>
    <Stack gap="sm">
      {model.editable ? null : <Callout tone="info">{MANAGER_TEXT.configOpenOnly}</Callout>}
      <ListItemList label={MANAGER_TEXT.configTitle}>
        {CONFIG_PAGES.map((entry) => (
          <ListItemRow
            key={entry.page}
            icon={<Icon name={entry.icon} />}
            name={entry.label}
            meta={entry.description}
            onClick={model.editable ? () => model.actions.openConfig(entry.page) : undefined}
          />
        ))}
      </ListItemList>
    </Stack>
  </PanelContainer>
);

export { ConfigPages };
