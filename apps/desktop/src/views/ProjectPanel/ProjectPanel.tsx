/* @layer renderer-app @kind component */
import { commandZone } from '@drizztdourden08/brock-react';
import { Stack } from '@drizztdourden08/tessera';
import { COMMAND_ZONE } from '../../keymap/command-zone.constants';
import { useProjectKeys } from './behavior/useProjectKeys';
import { useProjectPanel } from './behavior/useProjectPanel';
import { EntryList } from './sub-components/EntryList';
import { FileNameRow } from './sub-components/FileNameRow';
import { FolderBar } from './sub-components/FolderBar';
import { FolderNameRow } from './sub-components/FolderNameRow';
import { ProjectHeader } from './sub-components/ProjectHeader';
import { ProjectStart } from './sub-components/ProjectStart';
import { RenameRow } from './sub-components/RenameRow';
import { AssetsView } from './sub-components/AssetsView';
import { ViewBar } from './sub-components/ViewBar';

const ProjectPanel = () => {
  const model = useProjectPanel();
  const { project } = model;
  useProjectKeys(model);
  if (!project) return <ProjectStart model={model} />;
  return (
    <Stack gap="sm" {...commandZone(COMMAND_ZONE.project)}>
      <ProjectHeader model={model} project={project} />
      <ViewBar model={model} />
      {model.naming && <FileNameRow model={model} />}
      {model.makingFolder && <FolderNameRow model={model} />}
      {model.view === 'assets' ? (
        <AssetsView model={model.assets} />
      ) : (
        <>
          <FolderBar model={model} project={project} />
          {model.renaming !== null && <RenameRow key={model.renaming} model={model} />}
          <EntryList model={model} />
        </>
      )}
    </Stack>
  );
};

export { ProjectPanel };
