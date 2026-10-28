/* @layer renderer-app @kind logic */
import { HEADER_TEXT } from './stage-header.constants';
import type { HeaderInput, HeaderModel } from './stage-header.type';

const sheetHeader = (input: HeaderInput): HeaderModel => ({
  crumbs: [{ id: 'sheet', label: HEADER_TEXT.sheet(input.assetName), icon: 'pixel-atlas', current: true }],
  chips: input.sheetSelected > 0 ? [{ id: 'selected', text: HEADER_TEXT.selected(input.sheetSelected), tone: 'neutral' }] : [],
  actions: [],
});

export { sheetHeader };
