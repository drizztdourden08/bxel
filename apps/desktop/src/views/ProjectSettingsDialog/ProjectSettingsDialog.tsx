/* @layer renderer-app @kind component */
import { useProjectStore } from '../../stores/useProjectStore';
import { ProjectSettingsForm } from './sub-components/ProjectSettingsForm';

const ProjectSettingsDialog = () => {
  const shown = useProjectStore((state) => state.settingsDialog);
  const project = useProjectStore((state) => state.project);
  return shown && project ? <ProjectSettingsForm project={project} /> : null;
};

export { ProjectSettingsDialog };
