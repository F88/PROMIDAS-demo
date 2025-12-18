import type { NormalizedPrototype } from '@f88/promidas/types';
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Box,
  Stack,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PeopleIcon from '@mui/icons-material/People';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EventIcon from '@mui/icons-material/Event';
import CategoryIcon from '@mui/icons-material/Category';

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
              sx={{ mb: 2 }}
            >
              {prototype.summary}
            </Typography>
          )}

          {prototype.users && prototype.users.length > 0 && (
            <Box sx={{ mb: 1 }}>
              <Stack
                direction="row"
                spacing={0.5}
                alignItems="center"
                sx={{ mb: 0.5 }}
              >
                <PeopleIcon fontSize="small" color="action" />
              </Stack>
              <Stack
                direction="row"
                spacing={0.5}
                sx={{ flexWrap: 'wrap', gap: 0.5 }}
              >
                {prototype.users.map((user, index) => (
                  <Chip
                    key={index}
                    label={user}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
          )}

          {prototype.tags && prototype.tags.length > 0 && (
            <Box sx={{ mb: 1 }}>
              <Stack
                direction="row"
                spacing={0.5}
                alignItems="center"
                sx={{ mb: 0.5 }}
              >
                <LocalOfferIcon fontSize="small" color="action" />
              </Stack>
              <Stack
                direction="row"
                spacing={0.5}
                sx={{ flexWrap: 'wrap', gap: 0.5 }}
              >
                {prototype.tags.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" color="primary" />
                ))}
              </Stack>
            </Box>
          )}

          {prototype.events && prototype.events.length > 0 && (
            <Box sx={{ mb: 1 }}>
              <Stack
                direction="row"
                spacing={0.5}
                alignItems="center"
                sx={{ mb: 0.5 }}
              >
                <EventIcon fontSize="small" color="action" />
              </Stack>
              <Stack
                direction="row"
                spacing={0.5}
                sx={{ flexWrap: 'wrap', gap: 0.5 }}
              >
                {prototype.events.map((event, index) => (
                  <Chip
                    key={index}
                    label={event}
                    size="small"
                    color="secondary"
                  />
                ))}
              </Stack>
            </Box>
          )}

          {prototype.materials && prototype.materials.length > 0 && (
            <Box sx={{ mb: 1 }}>
              <Stack
                direction="row"
                spacing={0.5}
                alignItems="center"
                sx={{ mb: 0.5 }}
              >
                <CategoryIcon fontSize="small" color="action" />
              </Stack>
              <Stack
                direction="row"
                spacing={0.5}
                sx={{ flexWrap: 'wrap', gap: 0.5 }}
              >
                {prototype.materials.map((material, index) => (
                  <Chip key={index} label={material} size="small" />
                ))}
              </Stack>
            </Box>
          )}
        </CardContent>
      </CardActionArea>
      {prototype.mainUrl && (
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
      )}
    </Card>
  );
}
