/**
 * Config Container
 *
 * Container component for configuration-related UI elements.
 * This can be used to group configuration settings and controls.
 */

import { Grid } from '@mui/material';
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
      <Grid container spacing={2}>
        <Grid
          size={{
            xs: 12,
            sm: 12,
            md: 12,
          }}
        >
          {children}
        </Grid>
      </Grid>
    </ContainerWrapper>
  );
}
