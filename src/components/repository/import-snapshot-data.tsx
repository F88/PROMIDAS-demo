import { Alert, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import type { SnapshotOperationFailure } from '@f88/promidas/repository';
import type { SerializableSnapshot } from '@f88/promidas/repository/types';
import { ActionButton } from '../common/action-button';
import { SectionCard } from '../common/section-card';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface ImportSnapshotDataProps {
  importLoading: boolean;
  importSuccess: string | null;
  importError: SnapshotOperationFailure | null;
  handleImportSnapshot: (data: SerializableSnapshot) => void;
}

export function ImportSnapshotData({
  importLoading,
  importSuccess,
  importError,
  handleImportSnapshot,
}: ImportSnapshotDataProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const data = JSON.parse(json) as SerializableSnapshot;
        handleImportSnapshot(data);
      } catch (error) {
        console.error('Failed to parse snapshot file', error);
        // Using alert for parse error since hook error is for operation failure
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
    // Reset input value to allow selecting same file again
    event.target.value = '';
  };

  return (
    <SectionCard title="Import Snapshot">
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        JSONファイルからスナップショットを復元
      </Typography>

      <Box
        sx={
          {
            // mb: 2,
          }
        }
      >
        <ActionButton
          variant="secondary"
          component="label"
          disabled={importLoading}
          loading={importLoading}
          startIcon={<CloudUploadIcon />}
        >
          JSON
          <VisuallyHiddenInput
            type="file"
            onChange={handleFileChange}
            accept=".json"
          />
        </ActionButton>
      </Box>

      {importSuccess && (
        <Alert
          severity="success"
          sx={{
            mt: 2,
          }}
        >
          {importSuccess}
        </Alert>
      )}
      {importError && (
        <Alert
          severity="error"
          sx={{
            mt: 2,
          }}
        >
          {importError.message}
        </Alert>
      )}
    </SectionCard>
  );
}
