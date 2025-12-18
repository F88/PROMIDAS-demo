import { Typography } from '@mui/material';
import { ContainerWrapper } from '../common/container-wrapper';

/**
 * Fetcher Container
 *
 * Visualizes API fetch operations.
 * This container highlights when data is being fetched from the ProtoPedia API.
 */

interface FetcherContainerProps {
  isActive?: boolean;
}

export function FetcherContainer({ isActive = false }: FetcherContainerProps) {
  return (
    <ContainerWrapper type="fetcher" label="Fetcher" isActive={isActive}>
      <Typography
        variant="body2"
        color={isActive ? 'success.main' : 'text.secondary'}
        align="center"
      >
        {isActive ? '📡 Fetching data from API...' : 'Ready to fetch'}
      </Typography>
    </ContainerWrapper>
  );
}
