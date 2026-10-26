/* @layer renderer-app @kind component */
import { Callout, Stack, Text } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../../project-manager/project-manager.constants';
import { projectFacts } from '../../../project-manager/project-facts';
import type { ManagerPartProps } from '../ProjectManager.type';
import { AssetsSection } from './AssetsSection';
import { ConfigPages } from './ConfigPages';
import { ProjectFacts } from './ProjectFacts';

const ProjectBody = ({ model }: ManagerPartProps) => {
  const { open, disk } = model;
  if (open) {
    return (
      <Stack gap="md">
        <ProjectFacts facts={projectFacts(open.manifest, open.rootRealPath, open.projectFile)} />
        <ConfigPages model={model} />
        <AssetsSection model={model} />
      </Stack>
    );
  }
  if (disk.status === 'failed') return <Callout tone="warning">{disk.message}</Callout>;
  if (disk.status !== 'ready') return <Text tone="muted">{MANAGER_TEXT.loading}</Text>;
  const { manifest, projectFile } = disk.project;
  return (
    <Stack gap="md">
      <Callout tone="info">{MANAGER_TEXT.readOnlyNote}</Callout>
      <ProjectFacts facts={projectFacts(manifest, model.selected?.rootRealPath ?? '', projectFile)} />
      <ConfigPages model={model} />
      <AssetsSection model={model} />
    </Stack>
  );
};

export { ProjectBody };
