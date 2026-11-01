/* @layer renderer-app @kind types */
interface PresetForm {
  name: string;
  ticked: readonly string[];
  inProject: boolean;
  canProject: boolean;
  setName: (name: string) => void;
  toggle: (id: string) => void;
  setInProject: (value: boolean) => void;
  valid: boolean;
}

export type { PresetForm };
