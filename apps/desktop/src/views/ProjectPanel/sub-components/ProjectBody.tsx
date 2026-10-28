/* @layer renderer-app @kind component */
import type { PanelPartProps } from '../ProjectPanel.type';
import { ProjectEmpty } from './ProjectEmpty';
import { ProjectGrid } from './ProjectGrid';
import { ProjectTree } from './ProjectTree';

const ProjectBody = ({ model }: PanelPartProps) => {
  if (model.browser.rows.length === 0) return <ProjectEmpty model={model} />;
  return model.density === 'grid' ? <ProjectGrid model={model} /> : <ProjectTree model={model} />;
};

export { ProjectBody };
