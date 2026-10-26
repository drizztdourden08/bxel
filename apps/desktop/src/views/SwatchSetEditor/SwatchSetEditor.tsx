/* @layer renderer-app @kind component */
import { Callout, EmptyState, ListDetailLayout, Stack } from '@drizztdourden08/tessera';
import { SWATCH_EDITOR_TEXT } from './SwatchSetEditor.constants';
import { useSwatchSetEditor } from './behavior/useSwatchSetEditor';
import { SetDetail } from './sub-components/SetDetail';
import { SetList } from './sub-components/SetList';
import './SwatchSetEditor.css';

const SwatchSetEditor = () => {
  const model = useSwatchSetEditor();
  return (
    <Stack gap="md" className="swatch-set-editor">
      {model.error !== null && <Callout tone="danger">{model.error}</Callout>}
      <ListDetailLayout
        listContainers={[{ title: SWATCH_EDITOR_TEXT.listTitle, content: <SetList model={model} /> }]}
        listLabel={SWATCH_EDITOR_TEXT.listLabel}
        detailLabel={SWATCH_EDITOR_TEXT.detailLabel}
        detail={model.current === null ? null : <SetDetail model={model} />}
        emptyDetail={<EmptyState size="sm" title={SWATCH_EDITOR_TEXT.emptyTitle} message={SWATCH_EDITOR_TEXT.emptyMessage} />}
        storageKey={SWATCH_EDITOR_TEXT.storageKey}
      />
    </Stack>
  );
};

export { SwatchSetEditor };
