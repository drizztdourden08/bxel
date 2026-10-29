/* @layer renderer-app @kind component */
import { keepsWidgetFocus } from '@drizztdourden08/brock-react';
import { Box } from '@drizztdourden08/tessera';
import type { PanelPartProps } from '../ProjectPanel.type';
import { ProjectEmpty } from './ProjectEmpty';
import { ProjectGrid } from './ProjectGrid';
import { ProjectTree } from './ProjectTree';
import './ProjectBody.css';

const ProjectBody = ({ model }: PanelPartProps) => {
  if (model.browser.rows.length === 0) return <ProjectEmpty model={model} />;
  return (
    <Box className="project-body" {...keepsWidgetFocus()}>
      {model.density === 'grid' ? <ProjectGrid model={model} /> : <ProjectTree model={model} />}
    </Box>
  );
};

export { ProjectBody };
