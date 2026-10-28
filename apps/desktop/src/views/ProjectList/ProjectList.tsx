/* @layer renderer-app @kind component */
import { Button, EmptyState, Flex, ListDetailLayout, ListItemList, Stack, Text } from '@drizztdourden08/tessera';
import { PROJECTS_TEXT } from './ProjectList.constants';
import { useProjectList } from './behavior/useProjectList';
import { ProjectCard } from './sub-components/ProjectCard';
import { ProjectDetail } from './sub-components/ProjectDetail';
import type { ProjectListModel } from './ProjectList.type';
import './ProjectList.css';

const ProjectsList = ({ model }: { readonly model: ProjectListModel }) => (
  <Stack gap="sm">
    <Flex gap="xs" wrap>
      <Button size="sm" variant="primary" onClick={model.actions.newProject}>
        {PROJECTS_TEXT.newProject}
      </Button>
      <Button size="sm" variant="secondary" onClick={model.actions.browseProject}>
        {PROJECTS_TEXT.openProject}
      </Button>
    </Flex>
    {model.known.length === 0 ? (
      <Text tone="muted">{PROJECTS_TEXT.listEmpty}</Text>
    ) : (
      <ListItemList label={PROJECTS_TEXT.listTitle}>
        {model.known.map((project) => (
          <ProjectCard key={project.key} model={model} project={project} />
        ))}
      </ListItemList>
    )}
  </Stack>
);

/** The Projects page: every project Bxel knows, pinned by recency, and what is inside the one picked. */
const ProjectList = () => {
  const model = useProjectList();
  return (
    <ListDetailLayout
      className="project-list"
      listContainers={[{ title: PROJECTS_TEXT.listTitle, content: <ProjectsList model={model} /> }]}
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
