/* @layer renderer-app @kind component */
import { Box, Flex, Icon } from '@drizztdourden08/tessera';
import { HEADER_TEXT } from '../../../stage-header/stage-header.constants';
import type { BreadcrumbTrailProps } from '../StageHeader.type';
import { CrumbItem } from './CrumbItem';

const BreadcrumbTrail = ({ crumbs }: BreadcrumbTrailProps) => (
  <Flex as="nav" aria-label={HEADER_TEXT.region} className="stage-header__trail">
    <Flex role="list" gap="2xs" align="center" className="stage-header__list">
      {crumbs.map((crumb, index) => (
        <Flex key={crumb.id} role="listitem" gap="2xs" align="center" className="stage-header__item">
          {index > 0 && <Icon name="chevron-right" size={12} className="stage-header__sep" aria-hidden="true" />}
          <Box className="stage-header__crumb-box">
            <CrumbItem crumb={crumb} last={index === crumbs.length - 1} />
          </Box>
        </Flex>
      ))}
    </Flex>
  </Flex>
);

export { BreadcrumbTrail };
