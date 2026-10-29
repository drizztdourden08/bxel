/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera';
import type { TagBarEdgesProps } from './TagBarEdges.type';

const TagBarEdges = ({ bar, drag }: TagBarEdgesProps) => (
  <>
    {(['start', 'end'] as const).map((edge) => (
      <Box
        key={edge}
        className="tag-bar__edge"
        data-edge={edge}
        aria-hidden="true"
        onPointerDown={(event) => drag.grab(bar, event, edge)}
        onPointerMove={drag.move}
        onPointerUp={(event) => drag.release(event)}
      />
    ))}
  </>
);

export { TagBarEdges };
