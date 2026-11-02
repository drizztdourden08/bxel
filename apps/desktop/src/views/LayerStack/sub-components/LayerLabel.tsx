/* @layer renderer-app @kind component */
import { useEffect, useRef } from 'react';
import { Box, Text } from '@drizztdourden08/tessera';
import { useLayerViewStore } from '../../../stores/useLayerViewStore';
import { colourName } from '../behavior/colour-name';
import { layerBadges } from '../behavior/layer-badges';
import { layerRowStyle } from '../behavior/layer-tag-style';
import { rowMarks } from '../behavior/row-marks';
import { thumbGestures } from '../behavior/thumb-gestures';
import { LAYER_STACK_TEXT } from '../LayerStack.constants';
import { LayerKindMark } from './LayerKindMark';
import { LayerName } from './LayerName';
import { LayerThumb } from './LayerThumb';
import type { LayerLabelProps } from './LayerLabel.type';
import './LayerLabel.css';

const nameOf = (row: LayerLabelProps['row']): string | undefined => {
  if (row.kind === 'group') return LAYER_STACK_TEXT.groupOf(row.name, row.childCount);
  return row.kind === 'reference' ? LAYER_STACK_TEXT.referenceOf(row.name) : undefined;
};

const LayerLabel = ({ row, active, picked, folded, thumbSize, follow, onRename }: LayerLabelProps) => {
  const renaming = useLayerViewStore((state) => state.renamingId === row.id);
  const flash = useLayerViewStore((state) => (state.flash?.id === row.id ? state.flash.tick : null));
  const holder = useRef<HTMLElement>(null);
  const was = useRef(false);
  useEffect(() => {
    if (was.current && !renaming) holder.current?.closest<HTMLElement>('[role="treeitem"]')?.focus();
    was.current = renaming;
  }, [renaming]);
  if (renaming) {
    return <LayerName name={row.name} onRename={onRename} onDone={() => useLayerViewStore.getState().setRenaming(null)} />;
  }
  return (
    <Box
      as="span"
      ref={holder}
      className="layer-row__main"
      style={layerRowStyle(row)}
      aria-current={active ? 'true' : undefined}
      aria-label={nameOf(row)}
      {...rowMarks(row, active, picked)}
      onDoubleClick={(event) => {
        event.stopPropagation();
        useLayerViewStore.getState().setRenaming(row.id);
      }}
    >
      {flash !== null && <Box as="span" key={flash} className="layer-row__flash" aria-hidden />}
      {row.thumb && thumbSize > 0 && (
        <Box as="span" className="layer-row__thumb" {...thumbGestures(row.id, row.thumb.kind === 'sprite')}>
          <LayerThumb source={row.thumb} size={thumbSize} follow={follow} />
        </Box>
      )}
      {row.kind !== 'pixel' && <LayerKindMark kind={row.kind} folded={folded} />}
      <Box as="span" className="layer-row__text">
        <Text as="span" className="layer-row__name">{row.name}</Text>
        {row.note && <Text as="span" variant="caption" tone="muted" className="layer-row__note">{row.note}</Text>}
      </Box>
      {layerBadges(row).map((badge) => (
        <Text key={badge.id} as="span" variant="caption" tone="muted" className="layer-row__badge" data-badge={badge.id} title={badge.title}>
          {badge.text}
        </Text>
      ))}
      {row.colour && <Box as="span" className="visually-hidden">{`, ${colourName(row.colour)}`}</Box>}
    </Box>
  );
};

export { LayerLabel };
