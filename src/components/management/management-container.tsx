import { Grid } from '@mui/material';
import { ContainerWrapper } from '../common/container-wrapper';
import { RepositoryManager } from './repository-manager';

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
