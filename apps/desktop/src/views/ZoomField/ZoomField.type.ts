/* @layer renderer-app @kind types */
interface ZoomPresetsProps {
  percent: number | null;
  disabled: boolean;
}

interface ZoomActionsProps {
  disabled: boolean;
}

export type { ZoomActionsProps, ZoomPresetsProps };
