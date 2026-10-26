/* @layer renderer-app @kind component */
import { Button, Flex, Text } from '@drizztdourden08/tessera';
import { useFrameBar } from './behavior/useFrameBar';
import { FRAME_BAR_TEXT } from './FrameBar.constants';
import './FrameBar.css';

const FrameBar = () => {
  const bar = useFrameBar();
  if (!bar) return null;
  return (
    <Flex wrap gap="md" align="center" className="frame-bar">
      <Flex as="nav" aria-label={FRAME_BAR_TEXT.region}>
        <ol className="frame-bar__path">
          {bar.path.map((step, index) => (
            <li key={step}>
              {index > 0 && <Text as="span" tone="muted" aria-hidden="true">{`${FRAME_BAR_TEXT.separator} `}</Text>}
              <Text as="span" variant="label">{step}</Text>
            </li>
          ))}
        </ol>
      </Flex>
      {bar.notes.map((note) => (
        <Text key={note} variant="caption" tone="muted" role="status">{note}</Text>
      ))}
      <Flex gap="sm" align="center" className="frame-bar__actions">
        {bar.canOpen && <Button size="sm" variant="secondary" onClick={bar.open}>{FRAME_BAR_TEXT.openSprite}</Button>}
        {bar.canCopy && <Button size="sm" variant="secondary" disabled={bar.readOnly} onClick={bar.copy}>{FRAME_BAR_TEXT.makeCopy}</Button>}
      </Flex>
    </Flex>
  );
};

export { FrameBar };
