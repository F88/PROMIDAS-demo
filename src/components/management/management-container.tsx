import { Box } from '@mui/material';
import { ContainerWrapper } from '../common/container-wrapper';
import { RepositoryManager } from './repository-manager';

export const ManagementContainer = () => {
  return (
    <ContainerWrapper type="management" label="Management">
      <Box mt={1}>
        <RepositoryManager />
      </Box>
    </ContainerWrapper>
  );
};
