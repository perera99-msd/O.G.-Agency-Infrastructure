import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconifyIcon from 'components/base/IconifyIcon';
import { useAuth } from '../../../../../context/AuthContext';

const ProfileListItem = () => {
  const { user, signOut } = useAuth();

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Admin';
  const email = user?.email || '';
  const photoURL = user?.photoURL || '';

  return (
    <Box
      sx={{
        mx: 1.5,
        mb: 2,
        borderRadius: 3,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(168,85,247,0.08) 100%)',
        border: '1px solid rgba(99,102,241,0.2)',
      }}
    >
      {/* Top accent bar */}
      <Box sx={{ height: 3, background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)' }} />

      <Box sx={{ p: 1.75 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          {/* Avatar with online ring */}
          <Box sx={{ position: 'relative', flexShrink: 0 }}>
            <Box
              sx={{
                p: '2px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              }}
            >
              <Avatar
                src={photoURL}
                alt={displayName}
                sx={{
                  height: 40,
                  width: 40,
                  bgcolor: 'primary.dark',
                  fontSize: 16,
                  fontWeight: 700,
                  border: '2px solid #0d1117',
                }}
              >
                {!photoURL && displayName.charAt(0).toUpperCase()}
              </Avatar>
            </Box>
            {/* Online dot */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 1,
                right: 1,
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: '#22c55e',
                border: '2px solid #0d1117',
              }}
            />
          </Box>

          {/* Name + email */}
          <Stack flexGrow={1} minWidth={0} spacing={0.1}>
            <Typography
              variant="subtitle2"
              color="text.primary"
              fontWeight={700}
              letterSpacing={0.2}
              noWrap
            >
              {displayName}
            </Typography>
            <Typography
              variant="caption"
              noWrap
              sx={{ color: 'text.secondary', opacity: 0.75, fontSize: '0.68rem' }}
            >
              {email}
            </Typography>
          </Stack>

          {/* Sign out */}
          <Tooltip title="Sign out" placement="top">
            <IconButton
              size="small"
              onClick={signOut}
              sx={{
                color: 'text.secondary',
                flexShrink: 0,
                '&:hover': { color: '#f87171', bgcolor: 'rgba(248,113,113,0.1)' },
              }}
            >
              <IconifyIcon icon="mingcute:exit-line" sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>
        </Stack>

        <Divider sx={{ my: 1.25, borderColor: 'rgba(255,255,255,0.06)' }} />

        {/* Role badge */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Chip
            label="Administrator"
            size="small"
            sx={{
              height: 20,
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: 0.5,
              bgcolor: 'rgba(99,102,241,0.2)',
              color: '#a5b4fc',
              border: '1px solid rgba(99,102,241,0.3)',
              '& .MuiChip-label': { px: 1 },
            }}
          />
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#22c55e' }} />
            <Typography variant="caption" sx={{ color: '#22c55e', fontSize: '0.65rem', fontWeight: 500 }}>
              Online
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default ProfileListItem;
