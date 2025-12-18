import { Box, Chip } from '@mui/material';
import { type ReactNode } from 'react';

type ContainerType = 'fetcher' | 'store' | 'repository' | 'config';

interface ContainerWrapperProps {
  type: ContainerType;
  label: string;
  isActive?: boolean;
  children: ReactNode;
}

const containerColors: Record<ContainerType, string> = {
  fetcher: '#10b981',
  store: '#f59e0b',
  repository: '#667eea',
  config: '#8b5cf6',
};

export function ContainerWrapper({
  type,
  label,
  isActive = false,
  children,
}: ContainerWrapperProps) {
  const color = containerColors[type];

  return (
    <Box
      className={`container-wrapper ${type}-container ${isActive ? 'active' : ''}`}
      sx={{
        position: 'relative',
        border: `2px solid ${color}20`,
        borderRadius: 3,
        p: 3,
        mb: 4,
        transition: 'all 0.3s ease',
      }}
    >
      <Chip
        label={label}
        size="small"
        sx={{
          position: 'absolute',
          top: -12,
          left: 20,
          backgroundColor: 'background.paper',
          color: color,
          fontWeight: 600,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          border: 'none',
          px: 1,
        }}
      />
      {children}
    </Box>
  );
}
