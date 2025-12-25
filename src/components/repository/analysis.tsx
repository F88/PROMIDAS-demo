import { useEffect } from 'react';

import type { PrototypeInMemoryStats } from '@f88/promidas';
import { getStoreState } from '@f88/promidas-utils/store';

import {
  Alert,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';

import { usePrototypeAnalysis } from '../../hooks';
import { ActionButton } from '../common/action-button';
import { SectionCard } from '../common/section-card';

interface AnalysisProps {
  stats: PrototypeInMemoryStats | null;
  onUseSnapshot?: (isActive: boolean) => void;
}

export function Analysis({ stats, onUseSnapshot }: AnalysisProps) {
  const {
    analysis,
    loading: analysisLoading,
    error: analysisError,
    analyze,
    clear: clearAnalysis,
  } = usePrototypeAnalysis();

  // Control store/repo indicator when data is retrieved
  useEffect(() => {
    if (analysis && !analysisLoading) {
      onUseSnapshot?.(true);
    }
  }, [analysis, analysisLoading, onUseSnapshot]);

  const disabled = analysisLoading || getStoreState(stats) === 'not-stored';

  return (
    <SectionCard
      title="analyzePrototypes"
      description="Snapshotを分析"
      category="Analysis"
    >
      <Stack
        direction="row"
        spacing={1}
        sx={
          {
            // mb: 2,
          }
        }
      >
        <ActionButton
          onClick={analyze}
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
        <>
          <Table
            size="small"
            sx={{
              mt: 2,
            }}
          >
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
        </>
      )}
    </SectionCard>
  );
}
