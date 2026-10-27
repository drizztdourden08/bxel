/* @layer renderer-app @kind types */
import type { PresetChoice } from '../behavior/grant-rows.type';

type PresetSelectProps = {
  readonly name: string;
  readonly value: PresetChoice;
  readonly onChange: (choice: PresetChoice) => void;
};

export type { PresetSelectProps };
