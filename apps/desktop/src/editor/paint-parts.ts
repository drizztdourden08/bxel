/* @layer renderer-app @kind logic */
import type { Size } from '@bxel/raster';
import type { ToolSettings } from '../stores/tool-store.type';
import { brushOf } from './brush-of';
import type { EditorTarget } from './editor.type';
import type { InkChoice } from './ink-of.type';
import { ruleOf } from './rule-of';
import { symmetryOf } from './symmetry-of';
import { wrapOf } from './wrap-of';

const paintParts = (tools: ToolSettings, target: EditorTarget, size: Size, choice: InkChoice) => ({
  brush: brushOf(tools),
  symmetry: symmetryOf(tools, size),
  wrap: wrapOf(),
  ...(choice.ink ? { ink: choice.ink } : {}),
  rule: ruleOf(target, choice.ink),
});

export { paintParts };
