/* @layer renderer-app @kind component */
import { Text, Tooltip } from '@drizztdourden08/tessera';
import { middleTruncate } from '../../../project-health/middle-truncate';
import { projectRelative } from '../../../project-health/project-relative';
import { META_MAX } from '../../../project-health/project-health.constants';
import { useProjectStore } from '../../../stores/useProjectStore';
import type { PathMetaProps } from './PathMeta.type';

const PathMeta = ({ build }: PathMetaProps) => {
  const project = useProjectStore((state) => state.project);
  const full = build((path) => path);
  const shown = middleTruncate(build((path) => projectRelative(project, path)), META_MAX);
  return (
    <Tooltip content={full}>
      <Text as="span" variant="caption" tone="muted">
        {shown}
      </Text>
    </Tooltip>
  );
};

export { PathMeta };
