/* @layer renderer-app @kind logic */
import { createOverlay } from './create-overlay';
import type { EditorTarget, GradientSession, GradientSpec } from './editor.type';

const beginGradient = (target: EditorTarget, spec: GradientSpec): GradientSession => ({
  ...createOverlay(target),
  kind: 'gradient',
  spec,
  label: '',
});

export { beginGradient };
