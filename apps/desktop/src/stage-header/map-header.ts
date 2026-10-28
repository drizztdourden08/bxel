/* @layer renderer-app @kind logic */
import { HEADER_TEXT } from './stage-header.constants';
import { stateChip } from './state-chip';
import type { HeaderActions, HeaderChip, HeaderInput, HeaderModel, MapHeader } from './stage-header.type';

const layerChip = (map: MapHeader, actions: HeaderActions, readOnly: boolean): HeaderChip[] => {
  if (map.layerState === '' || map.layerId === null) return [];
  const locked = map.layerState === 'locked';
  const layerId = map.layerId;
  return [stateChip({ locked, readOnly, run: () => actions.flagMapLayer(locked ? 'locked' : 'visible', layerId) })];
};

const mapHeader = (input: HeaderInput, actions: HeaderActions): HeaderModel => {
  const { map } = input;
  if (!map) return { crumbs: [], chips: [], actions: [] };
  return {
    crumbs: [
      ...(map.mapName === null ? [] : [{ id: 'map', label: map.mapName, icon: 'pixel-tilemap' as const }]),
      ...(map.layerName === null ? [] : [{ id: 'layer', label: HEADER_TEXT.layer(map.layerName), icon: 'pixel-layers' as const, note: map.layerState === '' ? undefined : map.layerState, current: true }]),
    ],
    chips: [
      { id: 'placing', text: HEADER_TEXT.mapPlacing, tone: 'info' },
      ...(map.turn === null ? [] : [{ id: 'turn', text: HEADER_TEXT.turn(map.turn), tone: 'neutral' as const }]),
      ...(map.selection === null ? [] : [{ id: 'selection', text: map.selection, tone: 'neutral' as const }]),
      ...layerChip(map, actions, input.readOnly),
    ],
    actions: [],
  };
};

export { mapHeader };
