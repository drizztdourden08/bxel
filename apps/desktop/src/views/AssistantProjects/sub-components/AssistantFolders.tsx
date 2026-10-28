/* @layer renderer-app @kind component */
import type { FolderId } from '@bxel/project';
import { Checkbox, Stack, Text } from '@drizztdourden08/tessera';
import { toast } from '@drizztdourden08/brock-react';
import { focusedProject } from '../../../project-config/focused-project';
import { PROJECT_CONFIG_TEXT } from '../../../project-config/project-config.constants';
import { setAssistantFolders } from '../../../project-config/set-assistant-folders';
import { useProjectFocus } from '../../../project-config/useProjectFocus';
import { useAssistantProjects } from '../behavior/useAssistantProjects';

const AssistantFolders = () => {
  const focus = useProjectFocus();
  const access = useAssistantProjects().rows.find((row) => row.open)?.access;
  if (!focus) return null;
  const off = access !== 'read' && access !== 'edit';
  const { manifest } = focus.project;
  const selected = manifest.assistant.folders ?? manifest.folders.map((folder) => folder.folderId);
  const toggle = (folderId: FolderId, on: boolean): void => {
    const current = focusedProject();
    if (!current) return;
    const next = on ? [...selected, folderId] : selected.filter((each) => each !== folderId);
    void setAssistantFolders(current, next).then((error) => {
      if (error !== null) toast(PROJECT_CONFIG_TEXT.failed(error), { variant: 'danger' });
    });
  };
  return (
    <Stack gap="xs">
      {off && (
        <Text variant="caption" tone="muted">
          {PROJECT_CONFIG_TEXT.foldersOff}
        </Text>
      )}
      {manifest.folders.map((folder, index) => (
        <Checkbox
          key={folder.folderId}
          size="sm"
          label={index === 0 ? PROJECT_CONFIG_TEXT.projectFolder(folder.name) : folder.name}
          disabled={off}
          checked={selected.includes(folder.folderId)}
          onChange={(on) => toggle(folder.folderId, on)}
        />
      ))}
    </Stack>
  );
};

export { AssistantFolders };
