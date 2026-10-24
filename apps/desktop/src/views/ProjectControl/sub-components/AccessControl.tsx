/* @layer renderer-app @kind component */
import { Select, Text } from '@drizztdourden08/tessera';
import { ACCESS_OPTIONS } from '../../AssistantProjects/AssistantProjects.constants';
import { useAssistantProjects } from '../../AssistantProjects/behavior/useAssistantProjects';

const AccessControl = () => {
  const model = useAssistantProjects();
  const row = model.rows.find((each) => each.open);
  if (!row) return <Text variant="caption">No project is open.</Text>;
  return <Select options={ACCESS_OPTIONS} value={row.access} onChange={(value) => model.setAccess(row, value)} aria-label="Assistant access to this project" />;
};

export { AccessControl };
