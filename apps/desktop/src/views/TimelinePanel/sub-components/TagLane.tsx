/* @layer renderer-app @kind component */
import { Box, Pressable, Text } from '@drizztdourden08/tessera';
import { selectTag } from '../../../timeline/select-tag';
import type { TagLaneProps } from '../TimelinePanel.type';

const TagLane = ({ cells }: TagLaneProps) => (
  <Box role="row" className="timeline-grid__row timeline-grid__row--tags">
    <Box className="timeline-grid__corner" role="presentation" />
    {cells.map((cell, index) =>
      cell === null ? (
        <Box key={index} role="presentation" />
      ) : (
        <Pressable
          key={index}
          className="timeline-tag"
          data-colour={cell.colour}
          data-edge={cell.edge}
          data-selected={cell.selected ? 'yes' : 'no'}
          aria-pressed={cell.selected}
          aria-label={cell.label}
          tabIndex={-1}
          onClick={() => selectTag(cell.tagId)}
        >
          <Text as="span" variant="caption">{cell.name}</Text>
        </Pressable>
      ),
    )}
  </Box>
);

export { TagLane };
