/* @layer renderer-app @kind component */
import { EmptyState, Stack } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../../project-manager/project-manager.constants';
import type { ManagerPartProps } from '../ProjectManager.type';
import { ProjectBody } from './ProjectBody';
import { ProjectHeader } from './ProjectHeader';

const ProjectDetail = ({ model }: ManagerPartProps) => {
  const { selected } = model;
  if (selected === null) return <EmptyState size="sm" title={MANAGER_TEXT.emptyTitle} message={MANAGER_TEXT.emptyMessage} />;
  return (
    <Stack gap="md" className="project-manager__detail">
      <ProjectHeader key={selected.key} model={model} project={selected} />
      <ProjectBody model={model} />
    </Stack>
  );
};

export { ProjectDetail };
