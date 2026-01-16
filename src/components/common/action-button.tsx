import { Button } from '@mui/material';

import type { ButtonProps } from '@mui/material';

interface ActionButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outlined';
  loading?: boolean;
}

export function ActionButton({
  variant = 'primary',
  loading = false,
  children,
  disabled,
  ...props
}: ActionButtonProps) {
  const getColor = () => {
    switch (variant) {
      case 'danger':
        return 'error';
      case 'secondary':
        return 'secondary';
      case 'outlined':
        return 'primary';
      case 'primary':
      default:
        return 'primary';
    }
  };

  const getVariant = (): 'contained' | 'outlined' => {
    if (variant === 'secondary' || variant === 'outlined') {
      return 'outlined';
    }
    return 'contained';
  };

  return (
    <Button
      variant={getVariant()}
      color={getColor()}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </Button>
  );
}
