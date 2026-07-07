import { Box, Typography } from '@mui/material';

import type { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  description?: string;
  category?: string;
  children: ReactNode;
}

export function SectionCard({
  title,
  description,
  // category,
  children,
}: SectionCardProps) {
  return (
    <Box
      sx={{
        p: 2,
        // mb: 3,
        backgroundColor: 'background.paper',
        // backgroundColor: 'yellow',
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
      }}
    >
      {/* {category && (
        <Chip
          label={category}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ mb: 1 }}
        />
      )} */}
      <Typography
        variant="h6"
        component="h3"
        gutterBottom
        sx={{
          fontWeight: 600,
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
        }}
      >
        {title}
      </Typography>
      {description && (
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            mb: 1,
          }}
        >
          {description}
        </Typography>
      )}
      {children}
    </Box>
  );
}
