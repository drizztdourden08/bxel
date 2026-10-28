/* @layer renderer-app @kind component */
import { Box, Icon, IconButton, SegmentedControl, Select, Slider } from '@drizztdourden08/tessera';
import { BROWSER_TEXT, SORT_OPTIONS, THUMB_STOPS, VIEW_OPTIONS } from '../../../project-browser/project-browser.constants';
import type { BrowserView, SortKey } from '../../../project-browser/project-browser.type';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';

const isSort = (value: string): value is SortKey => SORT_OPTIONS.some((option) => option.value === value);

const ViewControls = () => {
  const { view, sort, size, setView, setSort, setSize } = useBrowserStore();
  const stop = Math.max(0, THUMB_STOPS.indexOf(size));
  return (
    <Box className="browser-view-controls">
      <SegmentedControl<BrowserView>
        size="sm"
        aria-label={BROWSER_TEXT.viewGroup}
        value={view}
        options={VIEW_OPTIONS.map((option) => ({ value: option.value, label: <Box as="span" className="browser-view-controls__option"><Icon name={option.icon} size={14} />{option.label}</Box>, title: option.label }))}
        onChange={setView}
      />
      <Box className="browser-view-controls__sort">
      <Select
        size="sm"
        aria-label={BROWSER_TEXT.sort}
        options={SORT_OPTIONS.map((option) => ({ value: option.value, label: option.label }))}
        value={sort.key}
        onChange={(value) => isSort(value) && setSort({ key: value, descending: sort.descending })}
      />
      </Box>
      <IconButton
        label={sort.descending ? BROWSER_TEXT.descending : BROWSER_TEXT.ascending}
        size="sm"
        variant="tertiary"
        onClick={() => setSort({ key: sort.key, descending: !sort.descending })}
      >
        <Icon name={sort.descending ? 'chevron-down' : 'chevron-up'} />
      </IconButton>
      {view === 'grid' && (
        <Slider
          size="sm"
          min={0}
          max={THUMB_STOPS.length - 1}
          step={1}
          value={stop}
          showValue={false}
          aria-label={BROWSER_TEXT.thumbSize}
          onChange={(value) => setSize(THUMB_STOPS[value] ?? size)}
        />
      )}
    </Box>
  );
};

export { ViewControls };
