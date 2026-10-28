/* @layer renderer-app @kind component */
import { EmptyState, ListDetailLayout } from '@drizztdourden08/tessera';
import { PROJECTS_TEXT } from './ProjectList.constants';
import { useProjectList } from './behavior/useProjectList';
import { ProjectDetail } from './sub-components/ProjectDetail';
import { ProjectsColumn } from './sub-components/ProjectsColumn';
import './ProjectList.css';

const ProjectList = () => {
  const model = useProjectList();
  return (
    <ListDetailLayout
      className="project-list"
      listContainers={[{ title: PROJECTS_TEXT.listTitle, content: <ProjectsColumn model={model} /> }]}
      listLabel={PROJECTS_TEXT.listLabel}
      listShowTitle={false}
      detailLabel={PROJECTS_TEXT.detailLabel}
      detail={model.selected === null ? null : <ProjectDetail model={model} project={model.selected} />}
      emptyDetail={<EmptyState size="sm" title={PROJECTS_TEXT.emptyTitle} message={PROJECTS_TEXT.emptyMessage} />}
      storageKey={PROJECTS_TEXT.storageKey}
    />
  );
};

export { ProjectList };
