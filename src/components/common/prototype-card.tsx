import type { NormalizedPrototype } from '@f88/promidas/types';
import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material';

interface PrototypeCardProps {
  prototype: NormalizedPrototype;
}

export function PrototypeCard({ prototype }: PrototypeCardProps) {
  return (
    <Card
      sx={{
        maxWidth: 600,
        mx: 'auto',
        boxShadow: 2,
      }}
    >
      <CardActionArea>
        <CardHeader
          title={prototype.prototypeNm}
          subheader={`ID: ${prototype.id}`}
        />

        <CardContent>
          {prototype.summary && (
            <Typography
              //
              variant="body1"
              color="text.secondary"
            >
              {prototype.summary}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
      {/* {prototype.mainUrl && (
        <CardActions>
          <Button
            // variant="contained"
            endIcon={<OpenInNewIcon />}
            href={prototype.mainUrl}
            target="_blank"
            rel="noopener noreferrer"
            // sx={{ mb: 2 }}
          >
            View on ProtoPedia
          </Button>
        </CardActions>
      )} */}
    </Card>
  );
}
