/* @layer renderer-app @kind component */
import { SplitPane } from '@drizztdourden08/tessera';
import { SHEET_TEXT } from '../../../sheet-manager/sheet-text.constants';
import { useManagerStore } from '../../../stores/useManagerStore';
import type { BrowserSplitProps } from '../SpritesPanel.type';
import { LibraryDrawer } from './LibraryDrawer';
import { SidePane } from './SidePane';

const BrowserSplit = ({ model, wide, body }: BrowserSplitProps) => {
  const request = useManagerStore((state) => state.libraryRequest);
  const layoutOpen = useManagerStore((state) => state.layoutOpen);
  const showLayout = wide && layoutOpen;
  const count = model.library.sprites.length + model.library.animations.length;
  return (
    <SplitPane
      key={`${request}:${wide}:${showLayout}`}
      orientation={wide ? 'horizontal' : 'vertical'}
      defaultRatio={wide ? 0.7 : 0.65}
      minRatio={0.25}
      collapsible
      defaultCollapsed={request === 0 && !showLayout ? 'end' : 'none'}
      startLabel={SHEET_TEXT.titleLabel}
      endLabel={SHEET_TEXT.library.label(count)}
      className="sprites-panel__split"
      start={body}
      end={wide ? <SidePane model={model} /> : <LibraryDrawer model={model} />}
    />
  );
};

export { BrowserSplit };
