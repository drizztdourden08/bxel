/* @layer renderer-app @kind types */
import type { BackgroundKind, InFileOutcome, CreationForm, CreationErrors, CreationKind, CreationSummary, SpriteCheck } from '../../new-sprite/new-sprite.type';

interface KindOption {
  value: CreationKind;
  label: string;
}

interface BackgroundOption {
  value: BackgroundKind;
  label: string;
}

type CreateUpdate = (patch: Partial<CreationForm>) => void;

interface CreateFieldsProps {
  form: CreationForm;
  errors: CreationErrors;
  update: CreateUpdate;
}

interface CreateFormState {
  form: CreationForm;
  errors: CreationErrors;
  summary: CreationSummary;
  failure: string | null;
  valid: boolean;
  update: CreateUpdate;
  create: () => void;
}

interface SpriteFormState extends CreateFormState {
  check: SpriteCheck;
}

interface CreateFormBase {
  form: CreationForm;
  errors: CreationErrors;
  summary: CreationSummary;
  failure: string | null;
  update: CreateUpdate;
  settle: (outcome: InFileOutcome) => boolean;
}

interface CreateActionsProps {
  label: string;
  valid: boolean;
  onCreate: () => void;
}

interface FileShare {
  name: string;
  sprites: number;
  count: string;
}

export type { BackgroundOption, CreateActionsProps, FileShare, KindOption, CreateFieldsProps, CreateFormBase, CreateFormState, SpriteFormState };
