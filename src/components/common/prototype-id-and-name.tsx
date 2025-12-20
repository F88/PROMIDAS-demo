import { Chip } from '@mui/material';

interface PrototypeIdAndNameProps {
  id: number;
  name?: string;
}

export function PrototypeIdAndName({ id, name }: PrototypeIdAndNameProps) {
  const label = name ? `${id}: ${name}` : `${id}`;

  return <Chip label={label} size="small" variant="outlined" />;
}
