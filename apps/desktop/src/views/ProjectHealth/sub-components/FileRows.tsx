/* @layer renderer-app @kind component */
import { Button, Icon, ListItemRow } from '@drizztdourden08/tessera';
import { iconOfKind } from '../../../project-health/icon-of-kind';
import { HEALTH_TEXT } from '../../../project-health/project-health.constants';
import type { FileRowsProps } from './FileRows.type';
import { PathMeta } from './PathMeta';

const FileRows = ({ findings, show }: FileRowsProps) => (
  <>
    {findings.map((finding) => (
      <ListItemRow
        key={finding.fix}
        icon={<Icon name={iconOfKind(finding.kind)} />}
        name={finding.name}
        meta={<PathMeta build={(path) => path(finding.path)} />}
        actionVisibility="always"
        action={
          <Button size="sm" variant="ghost" onClick={() => show(finding.path)}>
            {HEALTH_TEXT.show}
          </Button>
        }
      />
    ))}
  </>
);

export { FileRows };
