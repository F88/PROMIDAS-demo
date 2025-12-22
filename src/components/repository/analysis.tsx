import {
  Stack,
  Alert,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import { SectionCard } from '../common/section-card';
import { ActionButton } from '../common/action-button';
import { getStoreState } from '../../utils/store-state-utils';
import { usePrototypeAnalysis } from '../../hooks';

type FlowPattern =
  | 'get-store-info'
  | 'get-from-snapshot'
  | 'fetch-individual'
  | 'forced-fetch'
  | 'simple-display';

interface AnalysisProps {
  stats: PrototypeInMemoryStats | null;
  visualizeFlow: (
    operation: () => Promise<void> | void,
    pattern: FlowPattern,
  ) => Promise<void>;
}

export function Analysis({ stats, visualizeFlow }: AnalysisProps) {
  const {
    analysis,
    loading: analysisLoading,
    error: analysisError,
    analyze,
    clear: clearAnalysis,
  } = usePrototypeAnalysis();

  const wrappedAnalyze = () => {
    visualizeFlow(() => {
      analyze();
    }, 'get-from-snapshot');
  };

  const disabled = analysisLoading || getStoreState(stats) === 'not-stored';

  return (
    <SectionCard
      title="analyzePrototypes()"
      description="Snapshotを分析"
      category="Analysis"
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          mb: 2,
        }}
      >
        <ActionButton
          onClick={wrappedAnalyze}
          disabled={disabled}
          loading={analysisLoading}
        >
          実行
        </ActionButton>
        <ActionButton
          disabled={analysis == null}
          onClick={clearAnalysis}
          variant="secondary"
        >
          クリア
        </ActionButton>
      </Stack>
      {analysisError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {analysisError}
        </Alert>
      )}
      {analysis && !analysisLoading && (
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell
                component="th"
                scope="row"
                sx={{ color: 'text.secondary', fontWeight: 400 }}
              >
                Minimum ID
              </TableCell>
              <TableCell sx={{ fontWeight: 500 }}>
                {analysis.min !== null ? analysis.min : 'N/A'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                component="th"
                scope="row"
                sx={{ color: 'text.secondary', fontWeight: 400 }}
              >
                Maximum ID
              </TableCell>
              <TableCell sx={{ fontWeight: 500 }}>
                {analysis.max !== null ? analysis.max : 'N/A'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </SectionCard>
  );
}
