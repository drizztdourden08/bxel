/* @layer renderer-app @kind component */
import { Button, ColorSwatch, Flex, SegmentedControl, Span, Text } from '@drizztdourden08/tessera';
import { ColorPickerPopover } from '@drizztdourden08/tessera/color-picker-popover';
import { useRef, useState } from 'react';
import { ASSET_VIEW_TEXT, BACKGROUND_KINDS } from '../../../asset-view/asset-view.constants';
import { useAssetView } from '../../../asset-view/useAssetView';
import { BACKGROUND_TEXT } from '../ViewPanel.constants';

const BackgroundSection = () => {
  const { view, patch, reset } = useAssetView();
  const anchor = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const solid = view.background === 'solid';
  return (
    <Flex direction="column" gap="sm">
      <SegmentedControl
        size="sm"
        label={BACKGROUND_TEXT.kind}
        value={view.background}
        options={BACKGROUND_KINDS.map((kind) => ({ value: kind, label: ASSET_VIEW_TEXT[kind] }))}
        onChange={(background) => patch({ background })}
      />
      {solid && (
        <Flex gap="sm" align="center">
          <Span ref={anchor}>
            <ColorSwatch
              color={view.backgroundColour}
              aria-label={BACKGROUND_TEXT.colourButton}
              aria-haspopup="dialog"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            />
            <ColorPickerPopover
              open={open}
              anchorRef={anchor}
              value={view.backgroundColour}
              disableAlpha
              title={BACKGROUND_TEXT.colour}
              onChange={(backgroundColour) => patch({ backgroundColour })}
              onClose={() => setOpen(false)}
            />
          </Span>
          <Text as="span" variant="caption">{view.backgroundColour}</Text>
        </Flex>
      )}
      <Flex gap="sm" align="center" justify="between">
        <Text variant="caption" tone="muted">{BACKGROUND_TEXT.hint}</Text>
        <Button size="xs" variant="ghost" onClick={reset}>{BACKGROUND_TEXT.reset}</Button>
      </Flex>
    </Flex>
  );
};

export { BackgroundSection };
