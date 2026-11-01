/* @layer renderer-app @kind component */
import { keepsWidgetFocus } from '@drizztdourden08/brock-react';
import { Box } from '@drizztdourden08/tessera';
import type { WheelEvent } from 'react';
import { useMiddleOpen } from '../behavior/useMiddleOpen';
import { wheelDensity } from '../behavior/wheel-density';
import type { PanelPartProps } from '../ProjectPanel.type';
import { ProjectEmpty } from './ProjectEmpty';
import { ProjectGrid } from './ProjectGrid';
import { ProjectTree } from './ProjectTree';
import './ProjectBody.css';

const ProjectBody = ({ model }: PanelPartProps) => {
  const middle = useMiddleOpen(model);
  if (model.browser.rows.length === 0) return <ProjectEmpty model={model} />;
  const onWheel = (event: WheelEvent<HTMLElement>) => {
    if (!event.ctrlKey) return;
    const change = wheelDensity(model.view, event.deltaY);
    if (change) model.view.set(change);
  };
  return (
    <Box className="project-body" onWheel={onWheel} {...middle} {...keepsWidgetFocus()}>
      {model.density === 'grid' ? <ProjectGrid model={model} /> : <ProjectTree model={model} />}
    </Box>
  );
};

export { ProjectBody };
