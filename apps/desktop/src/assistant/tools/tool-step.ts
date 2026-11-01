/* @layer renderer-app @kind logic */
import type { ToolReply } from '@bxel/mcp';
import { allPresets } from '../../editor/presets/all-presets';
import { applyPreset } from '../../editor/presets/apply-preset';
import { currentSurface } from '../../editor/tool-catalogue/current-surface';
import { memberById } from '../../editor/tool-catalogue/member-by-id';
import { slotsOf } from '../../editor/tool-catalogue/slots-of';
import { pickMember } from '../../editor/tool-pick/pick-member';
import { writeOption } from '../../editor/tool-options/write-option';
import type { ToolId } from '../../editor/tool.type';
import { useToolPresetStore } from '../../stores/useToolPresetStore';
import { useToolStore } from '../../stores/useToolStore';
import { APP_TOOL_TEXT } from './app-tool.constants';
import { isReply } from './is-reply';
import { resolveOptions } from './resolve-options';
import type { Resolved } from './resolve-options';
import { toolBusy } from './tool-busy';
import { viewFail } from './view-fail';
import type { ViewStep } from './view-steps.type';

type Pick = { readonly tool: ToolId; readonly run: () => void };

const pickOf = (tool: NonNullable<Parameters<ViewStep>[0]['tool']>): Pick | ToolReply => {
  const { id, member, preset } = tool;
  const current = useToolStore.getState().tool;
  if (member !== undefined) {
    const found = memberById(member);
    if (!found) return viewFail(APP_TOOL_TEXT.noMember(member), 'tool.member');
    const surface = currentSurface();
    if (!slotsOf(surface).includes(found.slot)) return viewFail(APP_TOOL_TEXT.memberHere(member, surface), 'tool.member');
    return { tool: found.member.tool, run: () => pickMember(found.member) };
  }
  if (preset !== undefined) {
    const found = allPresets(useToolPresetStore.getState().user).find((each) => each.id === preset);
    const owner = found ? memberById(found.member) : undefined;
    if (!found || !owner) return viewFail(APP_TOOL_TEXT.noPreset(preset), 'tool.preset');
    return { tool: owner.member.tool, run: () => void applyPreset(found) };
  }
  if (id !== undefined) return { tool: id, run: () => useToolStore.getState().selectTool(id) };
  return { tool: current, run: () => undefined };
};

const writeAll = (writes: readonly Resolved[]): ToolReply | null => {
  for (const { key, spec, value } of writes) {
    const live = spec.tool === useToolStore.getState().tool;
    const why = live && spec.appliesWhen?.() === false ? 'Another option makes it irrelevant.' : live ? spec.disabledReason?.() : undefined;
    if (why !== undefined) return viewFail(APP_TOOL_TEXT.optionOff(key, why), `tool.options.${key}`);
    writeOption(spec, value);
  }
  return null;
};

const toolStep: ViewStep = (patch) => {
  const { tool } = patch;
  if (!tool) return null;
  const busy = toolBusy();
  if (busy) return busy;
  const picked = pickOf(tool);
  if (isReply(picked)) return picked;
  const writes = resolveOptions(tool.options ?? {}, picked.tool, 'tool.options');
  if (isReply(writes)) return writes;
  picked.run();
  return writeAll(writes);
};

export { toolStep };
