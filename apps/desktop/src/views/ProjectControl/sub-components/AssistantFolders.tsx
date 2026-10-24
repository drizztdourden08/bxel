/* @layer renderer-app @kind component */
import type { FolderId } from '@bxel/project';
import { Checkbox, Stack } from '@drizztdourden08/tessera';
import { toast } from '@drizztdourden08/brock-react';
import { focusedProject } from '../../../project-config/focused-project';
import { PROJECT_CONFIG_TEXT } from '../../../project-config/project-config.constants';
import { setAssistantFolders } from '../../../project-config/set-assistant-folders';
import { useProjectFocus } from '../../../project-config/useProjectFocus';

const AssistantFolders = () => {
  const focus = useProjectFocus();
  if (!focus) return null;
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
      {manifest.folders.map((folder, index) => (
        <Checkbox
          key={folder.folderId}
          size="sm"
          label={index === 0 ? `${folder.name} (project folder)` : folder.name}
          checked={selected.includes(folder.folderId)}
          onChange={(on) => toggle(folder.folderId, on)}
        />
      ))}
    </Stack>
  );
};

export { AssistantFolders };
