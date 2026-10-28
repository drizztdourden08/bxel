/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { ONION_TEXT } from '../../../timeline/onion.constants';

const OnionDiagram = () => {
  const { before, after, on } = useTimelineStore((state) => state.onion);
  const cells = [...Array.from({ length: before }, (_, index) => ({ key: `b${index}`, side: 'before', step: before - index })), { key: 'now', side: 'now', step: 0 }, ...Array.from({ length: after }, (_, index) => ({ key: `a${index}`, side: 'after', step: index + 1 }))];
  return (
    <Box className="onion-diagram" role="img" aria-label={ONION_TEXT.strip} data-on={on ? 'yes' : 'no'}>
      {cells.map((cell) => (
        <Box key={cell.key} className="onion-diagram__cell" data-side={cell.side} data-step={cell.step} />
      ))}
    </Box>
  );
};

export { OnionDiagram };
