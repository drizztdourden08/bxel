/* @layer renderer-app @kind component */
import { useContextMenu } from '@drizztdourden08/brock-react';
import { EmptyState, Flex } from '@drizztdourden08/tessera';
import { ruledEntries } from '../../context-menu/ruled-entries';
import { evaluate } from '../../ui-context/evaluate';
import { SECTION_MENU } from '../../view-section/view-section.constants';
import { useBxelContext } from '../../ui-context/useBxelContext';
import { useCanvasSurface } from '../../canvas-surface/useCanvasSurface';
import { Navigator } from '../Navigator';
import { ZoomField } from '../ZoomField';
import { VIEW_PANEL_TEXT } from './ViewPanel.constants';
import { usePreviewStore } from '../../stores/usePreviewStore';
import { viewSectionEntries } from './behavior/view-section-entries';
import { BackgroundSection } from './sub-components/BackgroundSection';
import { GuidesSection } from './sub-components/GuidesSection';
import { OnionSection } from './sub-components/OnionSection';
import { OverlaysSection } from './sub-components/OverlaysSection';
import { ReferenceSection } from './sub-components/ReferenceSection';
import { PreviewSection } from './sub-components/PreviewSection';
import { SymmetrySection } from './sub-components/SymmetrySection';
import { TiledSection } from './sub-components/TiledSection';
import { ViewSection } from './sub-components/ViewSection';
import './ViewPanel.css';

const ViewPanel = () => {
  const context = useBxelContext((current) => current);
  const surface = useCanvasSurface();
  const previewShown = usePreviewStore((state) => state.shown);
  useContextMenu(SECTION_MENU.zone, { label: SECTION_MENU.label, entries: ruledEntries(viewSectionEntries) });
  const shown = (id: string): boolean => evaluate(`viewpanel.${id}`, context).state !== 'hidden';
  if (surface === 'none') return <EmptyState message={VIEW_PANEL_TEXT.empty} />;
  return (
    <Flex direction="column" className="view-panel">
      <ViewSection section="navigator" title={VIEW_PANEL_TEXT.navigator} icon="pixel-map-pick">
        <Navigator />
      </ViewSection>
      <ViewSection section="zoom" title={VIEW_PANEL_TEXT.zoom} icon="pixel-zoom">
        <ZoomField />
      </ViewSection>
      {previewShown && shown('preview') && (
        <ViewSection section="preview" title={VIEW_PANEL_TEXT.preview} icon="pixel-view-preview">
          <PreviewSection />
        </ViewSection>
      )}
      <ViewSection section="overlays" title={VIEW_PANEL_TEXT.overlays} icon="pixel-grid">
        <OverlaysSection surface={surface} />
      </ViewSection>
      {shown('guides') && (
        <ViewSection section="guides" title={VIEW_PANEL_TEXT.guides} icon="pixel-rulers">
          <GuidesSection />
        </ViewSection>
      )}
      {shown('onion') && (
        <ViewSection section="onion" title={VIEW_PANEL_TEXT.onion} icon="pixel-onion-skin">
          <OnionSection />
        </ViewSection>
      )}
      {shown('tiled') && (
        <ViewSection section="tiled" title={VIEW_PANEL_TEXT.tiled} icon="pixel-tiled">
          <TiledSection />
        </ViewSection>
      )}
      {shown('symmetry') && (
        <ViewSection section="symmetry" title={VIEW_PANEL_TEXT.symmetry} icon="pixel-mirror-x">
          <SymmetrySection />
        </ViewSection>
      )}
      {shown('reference') && (
        <ViewSection section="reference" title={VIEW_PANEL_TEXT.reference} icon="pixel-view-reference">
          <ReferenceSection />
        </ViewSection>
      )}
      <ViewSection section="background" title={VIEW_PANEL_TEXT.background} icon="image">
        <BackgroundSection />
      </ViewSection>
    </Flex>
  );
};

export { ViewPanel };
