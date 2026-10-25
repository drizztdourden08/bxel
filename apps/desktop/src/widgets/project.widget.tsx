/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { ProjectPanel } from '../views/ProjectPanel';

const meta: WidgetMeta = {
  label: 'Project',
  icon: 'folder',
  defaultOpen: false,
  defaultSide: 'left',
  defaultDockedSize: 300,
  fill: true,
  popOut: false,
  defaultVisibility: 'context-only',
};

const ProjectWidget = () => <ProjectPanel />;

export default ProjectWidget;
export { meta };
