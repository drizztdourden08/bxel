/* @layer renderer-app @kind types */
import type { StripPlan, StripResult, StripSpec } from '../../add-frames/add-frames.type';

interface StripFieldsProps {
  spec: StripSpec;
  plan: StripPlan;
  result: StripResult;
  onSpec: (change: Partial<StripSpec>) => void;
  onResult: (result: StripResult) => void;
}

export type { StripFieldsProps };
