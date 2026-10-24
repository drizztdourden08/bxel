/* @layer renderer-app @kind component */
import { useProjectStore } from '../../stores/useProjectStore';
import { ProjectCreateForm } from './sub-components/ProjectCreateForm';

const ProjectCreateDialog = () => {
  const shown = useProjectStore((state) => state.dialog);
  return shown ? <ProjectCreateForm /> : null;
};

export { ProjectCreateDialog };
