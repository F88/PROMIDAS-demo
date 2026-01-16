import { Grid } from '@mui/material';

import { RepositoryManager } from './repository-manager';
import { ContainerWrapper } from '../common/container-wrapper';

export const ManagementContainer = () => {
  return (
    <ContainerWrapper type="management" label="Management">
      <Grid container spacing={2}>
        <Grid
          size={{
            xs: 12,
            sm: 12,
            md: 12,
          }}
        >
          <RepositoryManager />
        </Grid>
      </Grid>
    </ContainerWrapper>
  );
};
