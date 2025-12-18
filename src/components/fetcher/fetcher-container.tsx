import { Typography, Box } from '@mui/material';
import { ContainerWrapper } from '../common/container-wrapper';
import { useDownloadProgress } from '../../hooks/use-download-progress';

/**
 * Fetcher Container
 *
 * Visualizes API fetch operations.
 * This container highlights when data is being fetched from the ProtoPedia API.
 */
export function FetcherContainer() {
  const progressLog = useDownloadProgress();
  const latestProgress = progressLog[progressLog.length - 1];
  const isActive =
    latestProgress &&
    latestProgress.status !== 'idle' &&
    latestProgress.status !== 'completed';

  // const formatBytes = (bytes?: number) => {
  //   if (bytes === undefined) return 'N/A';
  //   return `${(bytes / 1024).toFixed(1)} KB`;
  // };

  /**
   * Format a single log entry for display
   *
   * @see * https://raw.githubusercontent.com/F88/promidas/refs/heads/main/lib/fetcher/docs/DESIGN.md
   */
  const formatLogEntry = (progress: (typeof progressLog)[0]) => {
    const time = new Date(progress.timestamp).toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    });

    // https://raw.githubusercontent.com/F88/promidas/refs/heads/main/lib/fetcher/docs/DESIGN.md
    switch (progress.status) {
      case 'idle':
        return `[${time}] Ready to fetch`;
      case 'started': {
        const prepareTimeS =
          progress.prepareTimeMs !== undefined
            ? (progress.prepareTimeMs / 1000).toFixed(2)
            : 'N/A';
        return `[${time}] 🚀 Download starting (limit=${progress.limit}, estimated ~${progress.estimatedBytes ?? 0} bytes) (prepared in ${prepareTimeS}s)`;
      }
      case 'in-progress': {
        const percentageStr =
          progress.percentage !== undefined
            ? progress.percentage.toFixed(1)
            : 'N/A';
        const incrementStr =
          progress.increment !== undefined ? `, +${progress.increment}` : '';
        return `[${time}] 📡 Download progress: ${percentageStr}% (${progress.receivedBytes ?? 0} / ${progress.estimatedBytes ?? 0} bytes${incrementStr})`;
      }
      case 'completed': {
        const downloadTimeS =
          progress.downloadTimeMs !== undefined
            ? (progress.downloadTimeMs / 1000).toFixed(2)
            : 'N/A';
        const totalTimeS =
          progress.totalTimeMs !== undefined
            ? (progress.totalTimeMs / 1000).toFixed(2)
            : 'N/A';
        return `[${time}] ✅ Download complete: ${progress.receivedBytes ?? 0} bytes received (estimated ${progress.estimatedBytes ?? 0} bytes) in ${downloadTimeS}s (total: ${totalTimeS}s)`;
      }
      default:
        return `[${time}] Unknown status`;
    }
  };

  return (
    <ContainerWrapper type="fetcher" label="Fetcher" isActive={isActive}>
      <Box sx={{ width: '100%' }}>
        {progressLog.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
          >
            Ready to fetch
          </Typography>
        ) : (
          <Box
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.75rem',
            }}
          >
            {progressLog.map((progress, index) => (
              <Typography
                key={index}
                variant="body2"
                color={
                  progress.status === 'completed'
                    ? 'success.main'
                    : progress.status === 'started'
                      ? 'warning.main'
                      : progress.status === 'in-progress'
                        ? 'info.main'
                        : 'text.secondary'
                }
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  lineHeight: 1.5,
                }}
              >
                {formatLogEntry(progress)}
              </Typography>
            ))}
          </Box>
        )}
      </Box>
    </ContainerWrapper>
  );
}
