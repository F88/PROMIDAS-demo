/**
 * Config Container
 *
 * Container component for configuration-related UI elements.
 * This can be used to group configuration settings and controls.
 */

import { Box } from '@mui/material';
import { ContainerWrapper } from '../common/container-wrapper';

interface ConfigContainerProps {
  isActive?: boolean;
  children?: React.ReactNode;
}

export function ConfigContainer({
  isActive = false,
  children,
}: ConfigContainerProps) {
  return (
    <ContainerWrapper type="config" label="Config" isActive={isActive}>
      <Box mt={1}>{children}</Box>
    </ContainerWrapper>
  );
}
