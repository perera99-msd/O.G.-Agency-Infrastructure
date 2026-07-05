import { useState } from 'react';
import Avatar, { avatarClasses } from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Chip from '@mui/material/Chip';
import IconifyIcon from 'components/base/IconifyIcon';
import { listClasses } from '@mui/material';
import { useAuth } from '../../../../context/AuthContext';

const ProfileMenu = () => {
  const { user, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Admin';
  const email = user?.email || '';
  const photoURL = user?.photoURL || '';

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Tooltip title="Account">
        <ButtonBase
          onClick={handleOpen}
          disableRipple
          aria-controls={open ? 'profile-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          sx={{ borderRadius: 2 }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              px: 1.25,
              py: 0.6,
              borderRadius: 2,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.04)',
              transition: 'all 0.2s',
              '&:hover': {
                background: 'rgba(99,102,241,0.1)',
                borderColor: 'rgba(99,102,241,0.3)',
              },
            }}
          >
            {/* Avatar with gradient ring */}
            <Box sx={{ position: 'relative' }}>
              <Box
                sx={{
                  p: '2px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                }}
              >
                <Avatar
                  src={photoURL}
                  sx={{
                    height: 28,
                    width: 28,
                    bgcolor: 'primary.dark',
                    fontSize: 12,
                    fontWeight: 700,
                    border: '2px solid #0d1117',
                  }}
                >
                  {!photoURL && displayName.charAt(0).toUpperCase()}
                </Avatar>
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#22c55e',
                  border: '1.5px solid #0d1117',
                }}
              />
            </Box>

            <Stack direction="column" alignItems="flex-start" sx={{ display: { xs: 'none', sm: 'flex' } }}>
              <Typography variant="caption" fontWeight={700} color="text.primary" lineHeight={1.2}>
                {displayName}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.secondary', opacity: 0.7, lineHeight: 1.2 }}>
                Administrator
              </Typography>
            </Stack>

            <IconifyIcon
              icon="mingcute:down-line"
              sx={{
                fontSize: 14,
                color: 'text.secondary',
                display: { xs: 'none', sm: 'block' },
                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            />
          </Stack>
        </ButtonBase>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id="profile-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        sx={{
          mt: 1.5,
          [`& .${listClasses.root}`]: {
            width: 260,
            [`& .${avatarClasses.root}`]: { width: 36, height: 36, mr: 1.25 },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2.5,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(15,20,40,0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
            },
          },
        }}
      >
        {/* User info header */}
        <Box sx={{ px: 2, py: 1.5 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ position: 'relative' }}>
              <Box sx={{ p: '2px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                <Avatar
                  src={photoURL}
                  sx={{ height: 40, width: 40, bgcolor: 'primary.dark', fontSize: 16, fontWeight: 700, border: '2px solid #0d1117' }}
                >
                  {!photoURL && displayName.charAt(0).toUpperCase()}
                </Avatar>
              </Box>
              <Box sx={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', bgcolor: '#22c55e', border: '2px solid #0d1117' }} />
            </Box>
            <Stack minWidth={0}>
              <Typography variant="subtitle2" fontWeight={700} noWrap>{displayName}</Typography>
              <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.7rem' }}>{email}</Typography>
            </Stack>
          </Stack>
          <Chip
            label="Administrator"
            size="small"
            sx={{
              mt: 1,
              height: 20,
              fontSize: '0.62rem',
              fontWeight: 600,
              letterSpacing: 0.5,
              bgcolor: 'rgba(99,102,241,0.15)',
              color: '#a5b4fc',
              border: '1px solid rgba(99,102,241,0.3)',
              '& .MuiChip-label': { px: 1 },
            }}
          />
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

        <MenuItem sx={{ py: 1.2, mx: 1, my: 0.5, borderRadius: 1.5, '&:hover': { bgcolor: 'rgba(99,102,241,0.1)' } }}>
          <ListItemIcon><IconifyIcon icon="mingcute:user-2-line" sx={{ fontSize: 18, color: 'text.secondary' }} /></ListItemIcon>
          <Typography variant="body2" color="text.secondary">View Profile</Typography>
        </MenuItem>

        <MenuItem sx={{ py: 1.2, mx: 1, my: 0.5, borderRadius: 1.5, '&:hover': { bgcolor: 'rgba(99,102,241,0.1)' } }}>
          <ListItemIcon><IconifyIcon icon="mingcute:settings-3-line" sx={{ fontSize: 18, color: 'text.secondary' }} /></ListItemIcon>
          <Typography variant="body2" color="text.secondary">Account Settings</Typography>
        </MenuItem>

        <MenuItem sx={{ py: 1.2, mx: 1, my: 0.5, borderRadius: 1.5, '&:hover': { bgcolor: 'rgba(99,102,241,0.1)' } }}>
          <ListItemIcon><IconifyIcon icon="ion:notifications-outline" sx={{ fontSize: 18, color: 'text.secondary' }} /></ListItemIcon>
          <Typography variant="body2" color="text.secondary">Notifications</Typography>
        </MenuItem>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mx: 1 }} />

        <MenuItem
          onClick={signOut}
          sx={{
            py: 1.2, mx: 1, my: 0.5, borderRadius: 1.5,
            '&:hover': { bgcolor: 'rgba(248,113,113,0.1)' },
          }}
        >
          <ListItemIcon><IconifyIcon icon="mingcute:exit-line" sx={{ fontSize: 18, color: '#f87171' }} /></ListItemIcon>
          <Typography variant="body2" sx={{ color: '#f87171', fontWeight: 500 }}>Sign Out</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProfileMenu;
