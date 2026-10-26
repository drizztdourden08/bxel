/* @layer renderer-app @kind component */
import { EmptyState, ListDetailLayout } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../project-manager/project-manager.constants';
import { useProjectManager } from './behavior/useProjectManager';
import { ProjectDetail } from './sub-components/ProjectDetail';
import { ProjectList } from './sub-components/ProjectList';
import './ProjectManager.css';

const ProjectManager = () => {
  const model = useProjectManager();
  return (
    <ListDetailLayout
      className="project-manager"
      listContainers={[{ title: MANAGER_TEXT.listTitle, content: <ProjectList model={model} /> }]}
      listLabel={MANAGER_TEXT.listLabel}
      detailLabel={MANAGER_TEXT.detailLabel}
      detail={model.selected === null ? null : <ProjectDetail model={model} />}
      emptyDetail={<EmptyState size="sm" title={MANAGER_TEXT.emptyTitle} message={MANAGER_TEXT.emptyMessage} />}
      storageKey={MANAGER_TEXT.storageKey}
    />
  );
};

export { ProjectManager };
