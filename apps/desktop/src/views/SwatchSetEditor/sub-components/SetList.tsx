/* @layer renderer-app @kind component */
import type { SwatchSetId } from '@bxel/project';
import { Button, ItemList, Stack } from '@drizztdourden08/tessera';
import { SWATCH_EDITOR_TEXT } from '../SwatchSetEditor.constants';
import type { SetBarProps } from '../SwatchSetEditor.type';
import { CopyBar } from './CopyBar';

const SetList = ({ model }: SetBarProps) => (
  <Stack gap="md">
    <ItemList
      title={SWATCH_EDITOR_TEXT.listTitle}
      showTitle={false}
      items={model.sets}
      getId={(set) => set.setId}
      getName={(set) => set.name}
      render={(set) => ({ meta: SWATCH_EDITOR_TEXT.colourCount(set.colors.length) })}
      selectedId={model.current?.setId ?? null}
      onSelect={(id) => model.select(id as SwatchSetId)}
      onCreate={model.create}
      createLabel={SWATCH_EDITOR_TEXT.newSet}
      onDelete={(id) => model.remove(id as SwatchSetId)}
      empty={SWATCH_EDITOR_TEXT.setPlaceholder}
    />
    <Button size="sm" variant="secondary" onClick={model.importFile}>
      {SWATCH_EDITOR_TEXT.importFile}
    </Button>
    <CopyBar model={model} />
  </Stack>
);

export { SetList };
