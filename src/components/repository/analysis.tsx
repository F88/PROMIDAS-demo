import { Stack, Alert, Typography, Box } from "@mui/material";
import type { PrototypeInMemoryStats } from "@f88/promidas";
import { SectionCard } from "../common/section-card";
import { ActionButton } from "../common/action-button";

interface AnalysisProps {
  analysis: { min: number | null; max: number | null } | null;
  analysisLoading: boolean;
  analysisError: string | null;
  stats: PrototypeInMemoryStats | null;
  analyze: () => void;
  clearAnalysis: () => void;
}

export function Analysis({
  analysis,
  analysisLoading,
  analysisError,
  stats,
  analyze,
  clearAnalysis,
}: AnalysisProps) {
  return (
    <SectionCard
      title="analyzePrototypes()"
      description="Extract min/max ID range from snapshot"
      category="Analysis"
    >
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <ActionButton
          onClick={analyze}
          disabled={analysisLoading || !stats || stats.size === 0}
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
        <Stack spacing={1.5}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Minimum ID:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {analysis.min !== null ? analysis.min : "N/A"}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Maximum ID:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {analysis.max !== null ? analysis.max : "N/A"}
            </Typography>
          </Box>
        </Stack>
      )}
    </SectionCard>
  );
}
