/* @layer renderer-app @kind component */
import { Stack } from '@drizztdourden08/tessera';
import type { ProjectPartProps } from '../ProjectList.type';
import { DetailBody } from './DetailBody';
import { DetailHead } from './DetailHead';

const ProjectDetail = ({ model, project }: ProjectPartProps) => (
  <Stack gap="md" className="project-list__detail">
    <DetailHead key={project.key} model={model} project={project} />
    <DetailBody model={model} project={project} />
  </Stack>
);

export { ProjectDetail };
