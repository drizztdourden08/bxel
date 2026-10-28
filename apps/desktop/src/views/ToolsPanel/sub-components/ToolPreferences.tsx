/* @layer renderer-app @kind component */
import { Button, Disclosure, FormRow, Slider, Stack, Toggle } from '@drizztdourden08/tessera';
import { HOLD_RANGE, TOOL_PREFS_DEFAULTS } from '../../../stores/tool-prefs-store.constants';
import { useToolPrefsStore } from '../../../stores/useToolPrefsStore';
import { useToolStore } from '../../../stores/useToolStore';
import { TOOLS_PANEL_TEXT } from '../ToolsPanel.constants';

const ToolPreferences = () => {
  const prefs = useToolPrefsStore();
  const share = useToolStore((state) => state.shareBrush);
  const hidden = prefs.hiddenMembers.length > 0;
  return (
    <Disclosure summary={TOOLS_PANEL_TEXT.preferences} size="sm">
      <Stack gap="sm">
        <FormRow label={TOOLS_PANEL_TEXT.openOnHover} description={TOOLS_PANEL_TEXT.openOnHoverHint} descriptionOverflow="hint">
          <Toggle aria-label={TOOLS_PANEL_TEXT.openOnHover} checked={prefs.openOnHover} onChange={(openOnHover) => prefs.patch({ openOnHover })} />
        </FormRow>
        <FormRow
          label={TOOLS_PANEL_TEXT.holdDelay}
          description={TOOLS_PANEL_TEXT.holdDelayHint}
          descriptionOverflow="hint"
          changed={prefs.holdMs !== TOOL_PREFS_DEFAULTS.holdMs}
          onReset={() => prefs.patch({ holdMs: TOOL_PREFS_DEFAULTS.holdMs })}
        >
          <Slider aria-label={TOOLS_PANEL_TEXT.holdDelay} min={HOLD_RANGE.min} max={HOLD_RANGE.max} step={HOLD_RANGE.step} value={prefs.holdMs} input onChange={(holdMs) => prefs.patch({ holdMs })} />
        </FormRow>
        <FormRow label={TOOLS_PANEL_TEXT.shareBrush} description={TOOLS_PANEL_TEXT.shareBrushHint} descriptionOverflow="hint">
          <Toggle aria-label={TOOLS_PANEL_TEXT.shareBrush} checked={share} onChange={(on) => useToolStore.getState().setShareBrush(on)} />
        </FormRow>
        {hidden && (
          <Button size="sm" variant="secondary" onClick={prefs.resetLayout}>
            {TOOLS_PANEL_TEXT.showOnRail}
          </Button>
        )}
      </Stack>
    </Disclosure>
  );
};

export { ToolPreferences };
