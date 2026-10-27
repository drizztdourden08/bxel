/* @layer renderer-app @kind component */
import { Stack } from '@drizztdourden08/tessera';
import { useAssistantPanel } from './behavior/useAssistantPanel';
import { ActivityList } from './sub-components/ActivityList';
import { ClientConfigBlock } from './sub-components/ClientConfigBlock';
import { LevelPicker } from './sub-components/LevelPicker';
import { ProgramGrant } from './sub-components/ProgramGrant';
import { ProgramList } from './sub-components/ProgramList';
import { SessionList } from './sub-components/SessionList';
import './AssistantPanel.css';

const AssistantPanel = () => {
  const model = useAssistantPanel();
  const open = model.programs.find((program) => program.key === model.permissionsKey);
  return (
    <Stack gap="lg" className="assistant-panel">
      <LevelPicker model={model} />
      <SessionList model={model} />
      <ProgramList model={model} />
      {open && <ProgramGrant key={open.key} program={open} onGrant={model.setProgramGrant} />}
      <ClientConfigBlock model={model} />
      <ActivityList model={model} />
    </Stack>
  );
};

export { AssistantPanel };
