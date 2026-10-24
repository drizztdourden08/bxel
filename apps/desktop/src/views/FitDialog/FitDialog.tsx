/* @layer renderer-app @kind component */
import { DialogShell, ScrollArea } from '@drizztdourden08/tessera';
import type { FitDialogProps } from './FitDialog.type';
import './FitDialog.css';

const FitDialog = ({ className, children, ...shell }: FitDialogProps) => (
  <DialogShell {...shell} className={className ? `fit-dialog ${className}` : 'fit-dialog'}>
    <ScrollArea axis="y" scrollbar="slim" className="fit-dialog__body">
      {children}
    </ScrollArea>
  </DialogShell>
);

export { FitDialog };
