/* @layer renderer-app @kind component */
import { Box, Button, Flex, Text } from '@drizztdourden08/tessera';
import { readOption } from '../../../editor/tool-options/read-option';
import { resetOption } from '../../../editor/tool-options/reset-option';
import { setOption } from '../../../editor/tool-options/set-option';
import { OPTION_CONTROLS_TEXT } from '../OptionControls.constants';
import type { OptionRowProps } from '../OptionControls.type';
import { OptionField } from './OptionField';
import './OptionRow.css';

const OptionRow = ({ spec, compact = false }: OptionRowProps) => {
  const value = readOption(spec);
  const reason = spec.disabledReason?.();
  const changed = spec.kind !== 'action' && value !== spec.default;
  return (
    <Box className="option-row" data-kind={spec.kind} data-changed={changed}>
      <Flex align="center" justify="between" gap="sm">
        <Text variant="label">{spec.label}</Text>
        {changed && (
          <Button size="xs" variant="ghost" aria-label={OPTION_CONTROLS_TEXT.resetOption(spec.label)} onClick={() => resetOption(spec)}>
            {OPTION_CONTROLS_TEXT.reset}
          </Button>
        )}
      </Flex>
      {!compact && (
        <Text variant="caption" tone="muted">
          {reason ?? spec.description}
        </Text>
      )}
      {compact && reason !== undefined && (
        <Text variant="caption" tone="muted">
          {reason}
        </Text>
      )}
      <Box className="option-row__control">
        <OptionField spec={spec} value={value} disabledReason={reason} onChange={(next) => (spec.kind === 'action' ? spec.write(next) : setOption(spec, next))} />
      </Box>
    </Box>
  );
};

export { OptionRow };
