/**
 * Config Container
 *
 * Container component for configuration-related UI elements.
 * This can be used to group configuration settings and controls.
 */

import { Box } from '@mui/material';

interface ConfigContainerProps {
  isActive?: boolean;
  children?: React.ReactNode;
}

export function ConfigContainer({
  isActive = false,
  children,
}: ConfigContainerProps) {
  return (
    <div
      className={`container-wrapper config-container ${
        isActive ? 'active' : ''
      }`}
    >
      <span className="container-label">Config</span>
      <Box mt={1}>{children}</Box>
    </div>
  );
}
