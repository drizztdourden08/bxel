/* @layer renderer-app @kind component */
import { Button, Callout, Flex, PanelContainer, Stack } from '@drizztdourden08/tessera';
import { OVERVIEW_TEXT } from '../../../asset-overview/asset-overview.constants';
import { duplicateFocused } from '../../../asset-overview/duplicate-focused';
import { exportFocused } from '../../../asset-overview/export-focused';
import { sizeFieldsOf } from '../../../asset-overview/size-fields-of';
import { EXPORT_KIND_OF } from '../../../asset-list/export-row.constants';
import type { OverviewPartProps } from '../AssetOverview.type';
import { SizeForm } from './SizeForm';
import { SpriteMoves } from './SpriteMoves';

const ActionsPanel = ({ model }: OverviewPartProps) => {
  const { focus } = model;
  const fields = sizeFieldsOf(focus);
  return (
    <PanelContainer title={OVERVIEW_TEXT.actionsTitle} level={3}>
      <Stack gap="md">
        {focus.readOnly && <Callout tone="info">{OVERVIEW_TEXT.readOnly}</Callout>}
        <Flex gap="xs" wrap>
          <Button size="sm" variant="secondary" disabled={focus.readOnly} onClick={() => duplicateFocused(focus)}>
            {OVERVIEW_TEXT.duplicate}
          </Button>
          {EXPORT_KIND_OF[focus.key.kind] !== undefined && (
            <Button size="sm" variant="secondary" onClick={() => exportFocused(focus)}>
              {OVERVIEW_TEXT.exportAsset}
            </Button>
          )}
        </Flex>
        {focus.key.kind === 'sprite' && <SpriteMoves model={model} />}
        {fields !== null && <SizeForm key={`${focus.key.id}:${fields.width}:${fields.height}`} model={model} fields={fields} />}
      </Stack>
    </PanelContainer>
  );
};

export { ActionsPanel };
