/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, TargetScope } from '@bxel/document';
import { decodePixelBlock, PIXELS_PATCH_WIRE_SCHEMA, WIRE_MASK_SCHEMA } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import type { WireStep } from './tool-input.type';

const atStep = <T>(result: McpResult<T>, index: number): McpResult<T> => (result.ok ? result : { ...result, error: { ...result.error, step: index } });

const patchOptions = (step: WireStep, index: number): McpResult<unknown> => {
  const wire = PIXELS_PATCH_WIRE_SCHEMA.parse(step.options);
  const pixels = decodePixelBlock(wire.pixels, wire.rect, `steps.${index}.options.pixels`);
  return pixels.ok ? { ok: true, value: { ...wire, pixels: pixels.value } } : atStep(pixels, index);
};

const maskOptions = (options: unknown, index: number): McpResult<unknown> => {
  if (typeof options !== 'object' || options === null || !('mask' in options)) return { ok: true, value: options };
  const wire = WIRE_MASK_SCHEMA.safeParse(options.mask);
  if (!wire.success) return { ok: true, value: options };
  const bits = decodePixelBlock(wire.data.bits, wire.data, `steps.${index}.options.mask.bits`);
  return bits.ok ? { ok: true, value: { ...options, mask: { width: wire.data.width, height: wire.data.height, bits: bits.value } } } : atStep(bits, index);
};

const splitOptions = (options: unknown): McpResult<unknown> => ({ ok: true, value: { strict: true, ...(typeof options === 'object' && options !== null ? options : {}) } });

const plainOptions = (step: WireStep, index: number): McpResult<unknown> =>
  step.name === COMMAND_NAME.pixelsPatch ? patchOptions(step, index) : maskOptions(step.options, index);

const optionsOf = (step: WireStep, index: number): McpResult<unknown> =>
  step.name === COMMAND_NAME.animationSplit ? splitOptions(step.options) : plainOptions(step, index);

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
