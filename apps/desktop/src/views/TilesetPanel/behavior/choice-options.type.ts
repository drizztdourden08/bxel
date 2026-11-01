/* @layer renderer-app @kind types */
import type { ChoiceFilter } from '../../../stores/tileset-view-store.type';

interface ChoiceOption extends ChoiceFilter {
  readonly label: string;
}

export type { ChoiceOption };
