/* @layer renderer-app @kind logic */
import { layerCrumb } from './layer-crumb';
import { spriteCrumb } from './sprite-crumb';
import { HEADER_TEXT } from './stage-header.constants';
import type { Crumb, HeaderActions, HeaderInput, HeaderModel } from './stage-header.type';

const scopeCrumbs = (input: HeaderInput, actions: HeaderActions): Crumb[] => {
  const { sprite } = input;
  if (!sprite?.multi) return [];
  const layer = layerCrumb(sprite, actions);
  return [spriteCrumb(sprite, actions), ...(layer ? [layer] : [])];
};

const sheetHeader = (input: HeaderInput, actions: HeaderActions): HeaderModel => {
  const scope = scopeCrumbs(input, actions);
  return {
    crumbs: [{ id: 'sheet', label: HEADER_TEXT.sheet(input.assetName), icon: 'pixel-atlas', current: scope.length === 0 }, ...scope],
    chips: input.sheetSelected > 0 && scope.length === 0 ? [{ id: 'selected', text: HEADER_TEXT.selected(input.sheetSelected), tone: 'neutral' }] : [],
    actions: [],
  };
};

export { sheetHeader };
