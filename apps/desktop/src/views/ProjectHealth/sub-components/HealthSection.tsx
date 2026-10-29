/* @layer renderer-app @kind component */
import { Box, ListItemList, Text } from '@drizztdourden08/tessera';
import type { ReactNode } from 'react';

type HealthSectionProps = {
  readonly title: string;
  readonly hint: string;
  readonly count: number;
  readonly actions?: ReactNode;
  readonly children: ReactNode;
};

const HealthSection = ({ title, hint, count, actions, children }: HealthSectionProps) => (
  <Box as="section" className="project-health__section" aria-label={title}>
    <Box className="project-health__section-head">
      <Text as="h3" variant="subtitle">
        {`${title} (${count})`}
      </Text>
      {actions !== undefined && <Box className="project-health__section-actions">{actions}</Box>}
    </Box>
    <Text as="p" variant="caption" tone="muted">
      {hint}
    </Text>
    <ListItemList label={title}>{children}</ListItemList>
  </Box>
);

export { HealthSection };
