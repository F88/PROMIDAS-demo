import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material';

interface ActionButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'danger';
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
      case 'primary':
      default:
        return 'primary';
    }
  };

  return (
    <Button
      variant={variant === 'secondary' ? 'outlined' : 'contained'}
      color={getColor()}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </Button>
  );
}
