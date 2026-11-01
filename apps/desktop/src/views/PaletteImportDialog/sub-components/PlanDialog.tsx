/* @layer renderer-app @kind component */
import { Callout, DialogShell, Stack } from '@drizztdourden08/tessera';
import type { PlanDialogProps } from '../PaletteImportDialog.type';

const PlanDialog = ({ title, className, actions, error, failure, onClose, children }: PlanDialogProps) => (
  <DialogShell open title={title} onClose={onClose} actions={actions} className={className}>
    <Stack gap="md">
      {children}
      {error !== null && <Callout tone="warning">{error}</Callout>}
      {failure !== null && <Callout tone="danger">{failure}</Callout>}
    </Stack>
  </DialogShell>
);

export { PlanDialog };
