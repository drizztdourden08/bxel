/* @layer renderer-app @kind component */
import { commandZone } from '@drizztdourden08/brock-react';
import { Box } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import { COMMAND_ZONE } from '../../keymap/command-zone.constants';
import { useDefaultOpen } from './behavior/useDefaultOpen';
import { useFollowActive } from './behavior/useFollowActive';
import { useProjectKeys } from './behavior/useProjectKeys';
import { useProjectMenu } from './behavior/useProjectMenu';
import { useProjectPanel } from './behavior/useProjectPanel';
import { useWidthWatch } from './behavior/useWidthWatch';
import { FilterChips } from './sub-components/FilterChips';
import { ProjectBody } from './sub-components/ProjectBody';
import { ProjectFooter } from './sub-components/ProjectFooter';
import { ProjectHeader } from './sub-components/ProjectHeader';
import { ProjectSearch } from './sub-components/ProjectSearch';
import { ProjectStart } from './sub-components/ProjectStart';
import './ProjectPanel.css';

const ProjectPanel = () => {
  const model = useProjectPanel();
  const ref = useRef<HTMLElement>(null);
  useProjectMenu(model);
  useProjectKeys(model);
  useFollowActive(model);
  useDefaultOpen(model);
  useWidthWatch(ref, model.setWidth);
  if (!model.project) return <ProjectStart model={model} />;
  return (
    <Box ref={ref} className="project-panel" {...commandZone(COMMAND_ZONE.project)}>
      <ProjectHeader model={model} />
      <ProjectSearch model={model} />
      <FilterChips model={model} />
      <ProjectBody model={model} />
      <ProjectFooter model={model} />
    </Box>
  );
};

export { ProjectPanel };
