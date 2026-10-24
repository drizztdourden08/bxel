/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, TargetScope } from '@bxel/document';
import { decodePixelBlock, PIXELS_PATCH_WIRE_SCHEMA } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import type { WireStep } from './tool-input.type';

const optionsOf = (step: WireStep, index: number): McpResult<unknown> => {
  if (step.name !== COMMAND_NAME.pixelsPatch) return { ok: true, value: step.options };
  const wire = PIXELS_PATCH_WIRE_SCHEMA.parse(step.options);
  const pixels = decodePixelBlock(wire.pixels, wire.rect, `steps.${index}.options.pixels`);
  if (!pixels.ok) return { ...pixels, error: { ...pixels.error, step: index } };
  return { ok: true, value: { ...wire, pixels: pixels.value } };
};

const toCommandSteps = (steps: readonly WireStep[]): McpResult<CommandStep[]> => {
  const out: CommandStep[] = [];
  for (const [index, step] of steps.entries()) {
    const options = optionsOf(step, index);
    if (!options.ok) return options;
    const targets = (step.targets ?? null) as TargetScope | null;
    out.push({ name: step.name, targets, options: options.value, ...(step.ref === undefined ? {} : { ref: step.ref }) });
  }
  return { ok: true, value: out };
};

export { toCommandSteps };
