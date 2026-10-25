/* @layer renderer-app @kind component */
import { Icon, ListItemRow, Select } from '@drizztdourden08/tessera';
import { ACCESS_OPTIONS, GRANTS_TEXT } from '../AssistantProjects.constants';
import type { GrantRowProps } from '../AssistantProjects.type';

const GrantRowCard = ({ row, onChange }: GrantRowProps) => (
  <ListItemRow
    icon={<Icon name="folder" />}
    name={row.name}
    meta={GRANTS_TEXT.meta(row.open, row.folders)}
    actionVisibility="always"
    action={<Select options={ACCESS_OPTIONS} value={row.access} onChange={onChange} aria-label={GRANTS_TEXT.grantLabel(row.name)} />}
  />
);

export { GrantRowCard };
