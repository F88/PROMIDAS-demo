import CategoryIcon from '@mui/icons-material/Category';
import EventIcon from '@mui/icons-material/Event';
import GroupsIcon from '@mui/icons-material/Groups';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PeopleIcon from '@mui/icons-material/People';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import { parseUsername, type ParsedUsername } from 'promidas-utils/utils';

import { buildPrototypeLink, buildUserLink } from '../../utils/link';

import type { NormalizedPrototype } from 'promidas/types';

interface PrototypeCardProps {
  prototype: NormalizedPrototype;
}

/**
 * Format a ProtoPedia username element (`displayName@profileId`) for display
 * as `displayName (profileId)`, using parseUsername from promidas-utils.
 */
function formatUsername(parsedUsername: ParsedUsername): string {
  const { displayName, profileId } = parsedUsername;
  if (displayName && profileId) {
    return `${displayName} (${profileId})`;
  }
  // Empty display name (~20% of authors) -> show the handle; no `@` -> as-is.
  return displayName || (profileId ? `@${profileId}` : '');
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
      <CardHeader
        title={prototype.prototypeNm}
        subheader={`ID: ${prototype.id}`}
      />

      <CardContent>
        {prototype.summary && (
          <Typography
            //
            variant="body1"
            sx={{
              color: 'text.secondary',
              mb: 2,
            }}
          >
            {prototype.summary}
          </Typography>
        )}

        <Stack spacing={1.5} sx={{ mt: 2 }}>
          {/* Team */}
          {prototype.teamNm && (
            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                alignItems: 'center',
              }}
            >
              <GroupsIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {prototype.teamNm}
              </Typography>
            </Stack>
          )}

          {/* Users  */}
          {prototype.users && prototype.users.length > 0 && (
            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                alignItems: 'center',
              }}
            >
              <PeopleIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
              <Stack
                direction="row"
                spacing={0.5}
                sx={{ flexWrap: 'wrap', gap: 0.5 }}
              >
                {prototype.users.map((user, index) => {
                  const parsedUsername = parseUsername(user);
                  const profileUrl = buildUserLink(
                    parsedUsername.profileId || parsedUsername.displayName,
                  );
                  return profileUrl ? (
                    <Chip
                      key={index}
                      label={formatUsername(parsedUsername)}
                      size="small"
                      variant="outlined"
                      clickable
                      component="a"
                      href={profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ) : (
                    <Chip
                      key={index}
                      label={formatUsername(parsedUsername)}
                      size="small"
                      variant="outlined"
                    />
                  );
                })}
              </Stack>
            </Stack>
          )}

          {prototype.tags && prototype.tags.length > 0 && (
            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                alignItems: 'center',
              }}
            >
              <LocalOfferIcon
                fontSize="small"
                color="action"
                sx={{ mr: 0.5 }}
              />
              <Stack
                direction="row"
                spacing={0.5}
                sx={{ flexWrap: 'wrap', gap: 0.5 }}
              >
                {prototype.tags.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" color="primary" />
                ))}
              </Stack>
            </Stack>
          )}

          {prototype.events && prototype.events.length > 0 && (
            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                alignItems: 'center',
              }}
            >
              <EventIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
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
            </Stack>
          )}

          {prototype.materials && prototype.materials.length > 0 && (
            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                alignItems: 'center',
              }}
            >
              <CategoryIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
              <Stack
                direction="row"
                spacing={0.5}
                sx={{ flexWrap: 'wrap', gap: 0.5 }}
              >
                {prototype.materials.map((material, index) => (
                  <Chip key={index} label={material} size="small" />
                ))}
              </Stack>
            </Stack>
          )}
        </Stack>
      </CardContent>
      {prototype.mainUrl && (
        <CardActions>
          <Button
            // variant="contained"
            endIcon={<OpenInNewIcon />}
            href={buildPrototypeLink(prototype.id)}
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
