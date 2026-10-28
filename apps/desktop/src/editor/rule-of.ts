/* @layer renderer-app @kind logic */
import { inkRule, inkTable } from '@bxel/raster';
import type { Ink, InkRule } from '@bxel/raster';
import type { EditorTarget } from './editor.type';

const ruleOf = (target: EditorTarget, ink: Ink | undefined): InkRule | null => inkRule(ink, inkTable(target.bank, ink));

export { ruleOf };
