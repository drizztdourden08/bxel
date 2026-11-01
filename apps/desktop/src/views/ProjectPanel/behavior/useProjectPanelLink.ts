/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { keyOfPath } from '../../../panel-browser/key-of-path';
import { useProjectPanelLinkStore } from '../../../stores/useProjectPanelLinkStore';
import type { PanelParts } from '../ProjectPanel.type';

const useProjectPanelLink = ({ view, search, selection, data }: Pick<PanelParts, 'view' | 'search' | 'selection' | 'data'>): void => {
  const command = useProjectPanelLinkStore((state) => state.command);
  const keys = [...selection.keys].join('\n');
  const chips = search.chips.map((chip) => chip.text).join('\n');

  useEffect(() => {
    useProjectPanelLinkStore.getState().publish({
      mode: view.mode,
      selection: keys === '' ? [] : keys.split('\n'),
      text: search.text,
      chips: chips === '' ? [] : chips.split('\n'),
    });
  }, [view.mode, keys, search.text, chips]);

  useEffect(() => () => useProjectPanelLinkStore.getState().publish(null), []);

  useEffect(() => {
    if (command === null) return;
    const next = useProjectPanelLinkStore.getState().take();
    if (next === null) return;
    if (next.mode !== undefined) view.set({ mode: next.mode });
    if (next.chips !== undefined) {
      search.clear();
      for (const chip of next.chips) search.toggle(chip);
    }
    if (next.text !== undefined) search.setText(next.text);
    if (next.selection !== undefined) {
      selection.choose(next.selection.flatMap((path) => keyOfPath(data.tree, path) ?? []));
    }
  }, [command, view, search, selection, data.tree]);
};

export { useProjectPanelLink };
