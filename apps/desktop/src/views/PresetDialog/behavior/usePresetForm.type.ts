/* @layer renderer-app @kind types */
interface PresetForm {
  name: string;
  ticked: readonly string[];
  setName: (name: string) => void;
  toggle: (id: string) => void;
  valid: boolean;
}

export type { PresetForm };
