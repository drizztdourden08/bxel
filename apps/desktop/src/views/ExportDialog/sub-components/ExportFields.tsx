/* @layer renderer-app @kind component */
import { Stack } from '@drizztdourden08/tessera';
import { framesOfAnimation } from '../../../export/frames-of-animation';
import type { ExportFieldsProps } from '../ExportDialog.type';
import { AnimationFields } from './AnimationFields';
import { ColourField } from './ColourField';
import { DestinationFields } from './DestinationFields';
import { KindField } from './KindField';
import { MapFormatField } from './MapFormatField';
import { ScaleField } from './ScaleField';
import { SheetFields } from './SheetFields';
import { TargetFields } from './TargetFields';

const ExportFields = ({ model, onEnter }: ExportFieldsProps) => {
  const { settings, change } = model.draft;
  const first = model.plan.files[0];
  const imagery = settings.kind !== 'map';
  return (
    <Stack gap="md" className="export-dialog__fields">
      <KindField settings={settings} change={change} />
      {!imagery && <MapFormatField settings={settings} change={change} />}
      {settings.kind === 'animation' && <AnimationFields settings={settings} change={change} />}
      {imagery && !framesOfAnimation(settings) && (
        <TargetFields
          settings={settings}
          change={change}
          spriteCount={model.spriteCount}
          selectedCount={model.selectedCount}
          sheetLabel={model.sheetLabel}
          tags={model.tags}
        />
      )}
      {settings.kind === 'sheet' && <SheetFields settings={settings} change={change} />}
      {imagery && <ScaleField settings={settings} change={change} />}
      {imagery && <ColourField settings={settings} change={change} indexed={model.plan.indexed} />}
      <DestinationFields
        settings={settings}
        change={change}
        placeholder={first?.name ?? ''}
        onBrowse={model.actions.browse}
        onEnter={onEnter}
      />
    </Stack>
  );
};

export { ExportFields };
