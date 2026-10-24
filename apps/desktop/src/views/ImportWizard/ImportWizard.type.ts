/* @layer renderer-app @kind types */
import type {
  ColorsView,
  ImportContext,
  ImportErrors,
  ImportForm,
  ImportStep,
  ImportTarget,
  SliceForm,
  SliceRect,
  SourceImage,
} from '../../image-import/image-import.type';

interface ImportWizardState {
  form: ImportForm;
  step: ImportStep;
  steps: readonly ImportStep[];
  colors: ColorsView;
  errors: ImportErrors;
  rects: readonly SliceRect[];
  names: readonly string[];
  context: ImportContext;
  issue: string | null;
  failure: string | null;
  update: (patch: Partial<ImportForm>) => void;
  setSlice: (patch: Partial<SliceForm>) => void;
  setTarget: (target: ImportTarget) => void;
  advance: () => void;
  back: () => void;
  cancel: () => void;
}

interface StepProps {
  image: SourceImage;
  wizard: ImportWizardState;
}

interface ImportDialogProps {
  image: SourceImage;
}

interface SlicePreviewProps {
  image: SourceImage;
  rects: readonly SliceRect[];
}

interface SliceLook {
  sunken: string;
  line: string;
  text: string;
}

interface WizardActionsProps {
  wizard: ImportWizardState;
}

interface PairFieldProps {
  label: string;
  x: number;
  y: number;
  min: number;
  max: number;
  error?: string | undefined;
  onX: (value: number) => void;
  onY: (value: number) => void;
}

export type { ImportDialogProps, ImportWizardState, PairFieldProps, SliceLook, SlicePreviewProps, StepProps, WizardActionsProps };
