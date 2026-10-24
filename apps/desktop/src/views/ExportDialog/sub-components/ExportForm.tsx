/* @layer renderer-app @kind component */
import { DialogShell, Flex, Paragraph, Stack } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { useExportStore } from '../../../export/useExportStore';
import { useExportModel } from '../behavior/useExportModel';
import { EXPORT_DIALOG_TEXT } from '../ExportDialog.constants';
import { ExportActions } from './ExportActions';
import { ExportFields } from './ExportFields';
import { PresetBar } from './PresetBar';
import { PreviewPanel } from './PreviewPanel';

const ExportForm = () => {
  const model = useExportModel();
  const hide = useExportStore((state) => state.hide);
  const [naming, setNaming] = useState(false);
  if (!model) return null;
  const { plan, blocker, running, presets, actions } = model;
  const exportNow = (): void => {
    if (blocker === null && !running) actions.run();
  };
  const buttons = (
    <ExportActions
      count={plan.files.length}
      blocker={blocker}
      running={running}
      onSavePreset={() => setNaming(true)}
      onCancel={hide}
      onExport={exportNow}
    />
  );
  return (
    <DialogShell open title={EXPORT_DIALOG_TEXT.title} onClose={hide} actions={buttons}>
      <Stack gap="md">
        <Flex gap="lg" className="export-dialog__body">
          <ExportFields model={model} onEnter={exportNow} />
          <PreviewPanel plan={plan} source={model.source} blocker={blocker} />
        </Flex>
        <PresetBar presets={presets.presets} naming={naming} onApply={presets.apply} onSave={presets.save} onDone={() => setNaming(false)} />
        <Paragraph tone="dim">{EXPORT_DIALOG_TEXT.revision(plan.revision)}</Paragraph>
      </Stack>
    </DialogShell>
  );
};

export { ExportForm };
