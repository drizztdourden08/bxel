/* @layer renderer-app @kind types */
interface CancelApplyProps {
  valid: boolean;
  onCancel: () => void;
  onApply: () => void;
}

export type { CancelApplyProps };
