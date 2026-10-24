/* @layer renderer-app @kind component */
import { Flex, Icon, IconButton, Select, Text } from '@drizztdourden08/tessera';
import { PANEL_TEXT } from '../../../project/project.constants';
import type { OpenProject } from '../../../project/project.type';
import type { PanelPartProps } from '../ProjectPanel.type';

const FolderBar = ({ model, project }: PanelPartProps & { readonly project: OpenProject }) => (
  <Flex align="center" gap="xs">
    <IconButton label={PANEL_TEXT.up} size="xs" disabled={model.segments.length === 0} onClick={model.up}>
      <Icon name="arrow-up" />
    </IconButton>
    {project.folders.length > 1 && (
      <Select
        aria-label={PANEL_TEXT.folderLabel}
        value={model.folder?.folderId ?? ''}
        onChange={model.chooseFolder}
        options={project.folders.map((folder) => ({ value: folder.folderId, label: folder.name }))}
      />
    )}
    <Text variant="caption" tone="muted">
      {['', ...model.segments].join(' / ').trim() || PANEL_TEXT.rootLabel}
    </Text>
  </Flex>
);

export { FolderBar };
