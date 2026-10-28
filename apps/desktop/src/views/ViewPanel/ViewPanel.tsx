/* @layer renderer-app @kind component */
import { EmptyState, Flex } from '@drizztdourden08/tessera';
import { useSurface } from '../../hooks/useSurface';
import { hasPart } from '../../surface/has-part';
import { Navigator } from '../Navigator';
import { ZoomField } from '../ZoomField';
import { VIEW_PANEL_TEXT } from './ViewPanel.constants';
import { BackgroundSection } from './sub-components/BackgroundSection';
import { OnionSection } from './sub-components/OnionSection';
import { OverlaysSection } from './sub-components/OverlaysSection';
import { SymmetrySection } from './sub-components/SymmetrySection';
import { TiledSection } from './sub-components/TiledSection';
import { ViewSection } from './sub-components/ViewSection';
import './ViewPanel.css';

const ViewPanel = () => {
  const surface = useSurface();
  if (surface === 'none') return <EmptyState message={VIEW_PANEL_TEXT.empty} />;
  return (
    <Flex direction="column" className="view-panel">
      <ViewSection title={VIEW_PANEL_TEXT.navigator} icon="pixel-map-pick">
        <Navigator />
      </ViewSection>
      <ViewSection title={VIEW_PANEL_TEXT.zoom} icon="pixel-zoom">
        <ZoomField />
      </ViewSection>
      <ViewSection title={VIEW_PANEL_TEXT.overlays} icon="pixel-grid">
        <OverlaysSection surface={surface} />
      </ViewSection>
      {hasPart(surface, 'playback') && (
        <ViewSection title={VIEW_PANEL_TEXT.onion} icon="pixel-onion-skin">
          <OnionSection />
        </ViewSection>
      )}
      {hasPart(surface, 'tiled') && (
        <ViewSection title={VIEW_PANEL_TEXT.tiled} icon="pixel-tiled">
          <TiledSection />
        </ViewSection>
      )}
      {hasPart(surface, 'symmetry') && (
        <ViewSection title={VIEW_PANEL_TEXT.symmetry} icon="pixel-mirror-x">
          <SymmetrySection />
        </ViewSection>
      )}
      <ViewSection title={VIEW_PANEL_TEXT.background} icon="image">
        <BackgroundSection />
      </ViewSection>
    </Flex>
  );
};

export { ViewPanel };
