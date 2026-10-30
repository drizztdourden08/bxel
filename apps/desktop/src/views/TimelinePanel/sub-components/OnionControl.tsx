/* @layer renderer-app @kind component */
import { Icon, SplitButton } from '@drizztdourden08/tessera';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { ONION_TEXT } from '../../../timeline/onion.constants';
import { OnionDiagram } from './OnionDiagram';
import { OnionPanel } from './OnionPanel';

const OnionControl = () => {
  const on = useTimelineStore((state) => state.onion.on);
  const setOnion = useTimelineStore((state) => state.setOnion);
  return (
    <SplitButton
      label={ONION_TEXT.toggle}
      menuLabel={ONION_TEXT.settings}
      icon={<Icon name="pixel-onion-skin" />}
      size="sm"
      pressed={on}
      onClick={() => setOnion({ on: !on })}
      panel={() => (
        <>
          <OnionDiagram />
          <OnionPanel />
        </>
      )}
    />
  );
};

export { OnionControl };
