/* @layer renderer-app @kind component */
import { Stack } from '@drizztdourden08/tessera';
import { useProjectPanel } from './behavior/useProjectPanel';
import { EntryList } from './sub-components/EntryList';
import { FolderBar } from './sub-components/FolderBar';
import { FileNameRow } from './sub-components/FileNameRow';
import { ProjectHeader } from './sub-components/ProjectHeader';
import { ProjectStart } from './sub-components/ProjectStart';

const ProjectPanel = () => {
  const model = useProjectPanel();
  const { project } = model;
  if (!project) return <ProjectStart model={model} />;
  return (
    <Stack gap="sm">
      <ProjectHeader model={model} project={project} />
      <FolderBar model={model} project={project} />
      {model.naming && <FileNameRow model={model} />}
      <EntryList model={model} />
    </Stack>
  );
};

export { ProjectPanel };
