import { Typography } from '@mui/material';

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
    <div
      className={`container-wrapper fetcher-container ${
        isActive ? 'active' : ''
      }`}
    >
      <span className="container-label">Fetcher</span>
      <Typography
        variant="body2"
        color={isActive ? 'success.main' : 'text.secondary'}
        align="center"
      >
        {isActive ? '📡 Fetching data from API...' : 'Ready to fetch'}
      </Typography>
    </div>
  );
}
