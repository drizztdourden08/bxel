/* @layer renderer-app @kind component */
import { Flex, Icon, IconButton, Text } from '@drizztdourden08/tessera';
import { ACCESS_LABEL, PANEL_TEXT } from '../../../project/project.constants';
import type { OpenProject } from '../../../project/project.type';
import type { PanelPartProps } from '../ProjectPanel.type';
import { AddAssetMenu } from './AddAssetMenu';

const ProjectHeader = ({ model, project }: PanelPartProps & { readonly project: OpenProject }) => (
  <Flex justify="between" align="center" gap="sm" wrap>
    <Flex direction="column">
      <Text variant="label">{project.manifest.name}</Text>
      <Text variant="caption" tone="muted">
        {PANEL_TEXT.assistant(ACCESS_LABEL[project.manifest.assistant.access])}
      </Text>
    </Flex>
    <Flex gap="xs">
      <AddAssetMenu model={model} />
      <IconButton label={PANEL_TEXT.newFolder} size="sm" onClick={model.startFolder}>
        <Icon name="folder" />
      </IconButton>
      <IconButton label={PANEL_TEXT.refresh} size="sm" onClick={model.refresh}>
        <Icon name="refresh-cw" />
      </IconButton>
      <IconButton label={PANEL_TEXT.settingsLabel} size="sm" onClick={model.openSettings}>
        <Icon name="settings" />
      </IconButton>
      <IconButton label={PANEL_TEXT.closeLabel} size="sm" onClick={model.closeProject}>
        <Icon name="x" />
      </IconButton>
    </Flex>
  </Flex>
);

export { ProjectHeader };
