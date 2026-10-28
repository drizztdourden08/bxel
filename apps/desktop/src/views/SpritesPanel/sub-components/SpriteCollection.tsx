/* @layer renderer-app @kind component */
import { Button, Center, EmptyState, Flex, Icon } from '@drizztdourden08/tessera';
import { SHEET_TEXT } from '../../../sheet-manager/sheet-text.constants';
import { useManagerStore } from '../../../stores/useManagerStore';
import { useCreateDialogStore } from '../../../stores/useCreateDialogStore';
import type { SpriteViewProps } from '../SpritesPanel.type';
import { SpriteGrid } from './SpriteGrid';
import { SpriteList } from './SpriteList';

const SpriteCollection = (props: SpriteViewProps) => {
  const view = useManagerStore((state) => state.view);
  const zoom = useManagerStore((state) => state.zoom);
  const patch = useManagerStore((state) => state.patch);
  const clearFilters = useManagerStore((state) => state.clearFilters);
  const { model } = props;
  const total = model.facts.length + model.animationFacts.length;
  if (total === 0) {
    return (
      <Center direction="column" className="sprites-panel__empty">
        <EmptyState
          size="sm"
          icon={<Icon name="pixel-atlas" size={32} />}
          title={SHEET_TEXT.empty.sheet}
          message={SHEET_TEXT.empty.sheetBody}
          action={
            <Flex gap="xs" wrap justify="center">
              <Button size="xs" variant="primary" onClick={() => patch({ libraryRequest: Date.now() })}>
                {SHEET_TEXT.addFromProject}
              </Button>
              <Button size="xs" onClick={() => useCreateDialogStore.getState().show('sprite')}>
                {SHEET_TEXT.newSprite}
              </Button>
            </Flex>
          }
        />
      </Center>
    );
  }
  if (model.shown.length + model.animations.length === 0) {
    return (
      <Center direction="column" className="sprites-panel__empty">
        <EmptyState size="sm" message={SHEET_TEXT.empty.noMatch} />
        <Button size="xs" onClick={clearFilters}>
          {SHEET_TEXT.empty.clearSearch}
        </Button>
      </Center>
    );
  }
  return view === 'grid' ? <SpriteGrid {...props} box={zoom} /> : <SpriteList {...props} />;
};

export { SpriteCollection };
