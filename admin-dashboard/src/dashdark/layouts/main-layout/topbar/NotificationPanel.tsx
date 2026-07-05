import { useState, useEffect, useRef } from 'react';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import ButtonBase from '@mui/material/ButtonBase';
import IconifyIcon from 'components/base/IconifyIcon';
import { useAdmin } from '../../../../context/AdminContext';

interface AppNotification {
  id: string;
  type: 'message' | 'destination' | 'job' | 'gallery' | 'blog';
  title: string;
  subtitle: string;
  time: string;
  read: boolean;
  icon: string;
  iconColor: string;
}

const typeConfig = {
  message:     { icon: 'mingcute:mail-line',       iconColor: '#6366f1' },
  destination: { icon: 'mingcute:earth-2-line',    iconColor: '#22c55e' },
  job:         { icon: 'mingcute:briefcase-line',   iconColor: '#f59e0b' },
  gallery:     { icon: 'mingcute:photo-album-line', iconColor: '#ec4899' },
  blog:        { icon: 'mingcute:news-line',        iconColor: '#14b8a6' },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const NotificationPanel = () => {
  const { responses, destinations, jobs, gallery, blogs, unreadCount } = useAdmin();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Track previous counts to detect changes
  const prevCounts = useRef({ dest: 0, jobs: 0, gallery: 0, blogs: 0, responses: 0 });
  const [hasNew, setHasNew] = useState(false);

  // Build notifications list from all data sources
  useEffect(() => {
    const notifs: AppNotification[] = [];

    // Contact messages — newest first
    responses.slice(0, 5).forEach(r => {
      notifs.push({
        id: `msg-${r.id}`,
        type: 'message',
        title: `New message from ${r.senderName}`,
        subtitle: r.destinationOfInterest ? `Interested in ${r.destinationOfInterest}` : r.email,
        time: r.submittedAt,
        read: r.status !== 'new',
        ...typeConfig.message,
      });
    });

    // Destinations — most recent 3
    destinations.slice(0, 3).forEach(d => {
      notifs.push({
        id: `dest-${d.id}`,
        type: 'destination',
        title: `Destination: ${d.country}`,
        subtitle: `${d.region} · ${d.activeJobs} active jobs`,
        time: new Date().toISOString(),
        read: readIds.has(`dest-${d.id}`),
        ...typeConfig.destination,
      });
    });

    // Jobs
    jobs.slice(0, 3).forEach(j => {
      notifs.push({
        id: `job-${j.id}`,
        type: 'job',
        title: `Job: ${j.title}`,
        subtitle: `${j.country} · ${j.status}`,
        time: new Date().toISOString(),
        read: readIds.has(`job-${j.id}`),
        ...typeConfig.job,
      });
    });

    // Blogs
    blogs.slice(0, 2).forEach(b => {
      notifs.push({
        id: `blog-${b.id}`,
        type: 'blog',
        title: `Blog: ${b.title}`,
        subtitle: `By ${b.author} · ${b.category}`,
        time: b.publishDate,
        read: readIds.has(`blog-${b.id}`),
        ...typeConfig.blog,
      });
    });

    setNotifications(notifs.slice(0, 12));

    // Detect new items
    const curr = {
      dest: destinations.length,
      jobs: jobs.length,
      gallery: gallery.length,
      blogs: blogs.length,
      responses: responses.length,
    };
    const prev = prevCounts.current;
    if (
      curr.dest > prev.dest ||
      curr.jobs > prev.jobs ||
      curr.gallery > prev.gallery ||
      curr.blogs > prev.blogs ||
      curr.responses > prev.responses
    ) {
      setHasNew(true);
    }
    prevCounts.current = curr;
  }, [responses, destinations, jobs, gallery, blogs, readIds]);

  const open = Boolean(anchorEl);
  const unread = notifications.filter(n => !n.read).length;
  const totalBadge = unreadCount + (hasNew ? 1 : 0);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
    setHasNew(false);
  };
  const handleClose = () => setAnchorEl(null);

  const markAllRead = () => {
    const allIds = new Set(notifications.map(n => n.id));
    setReadIds(allIds);
  };

  const markRead = (id: string) => {
    setReadIds(prev => new Set([...prev, id]));
  };

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          size="large"
          onClick={handleOpen}
          sx={{
            color: open ? 'primary.light' : 'text.secondary',
            transition: 'color 0.2s',
          }}
        >
          <Badge
            badgeContent={unreadCount > 0 ? unreadCount : undefined}
            color="error"
            variant={totalBadge > 0 && unreadCount === 0 ? 'dot' : 'standard'}
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.6rem',
                minWidth: 16,
                height: 16,
                animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': { boxShadow: '0 0 0 0 rgba(239,68,68,0.5)' },
                  '70%': { boxShadow: '0 0 0 6px rgba(239,68,68,0)' },
                  '100%': { boxShadow: '0 0 0 0 rgba(239,68,68,0)' },
                },
              },
            }}
          >
            <IconifyIcon icon="ion:notifications-outline" />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              width: 360,
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(13,18,32,0.97)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
              overflow: 'hidden',
            },
          },
        }}
      >
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            px: 2.5,
            py: 2,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(168,85,247,0.08) 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <IconifyIcon icon="ion:notifications" sx={{ color: '#6366f1', fontSize: 20 }} />
            <Typography variant="subtitle1" fontWeight={700} color="text.primary">
              Notifications
            </Typography>
            {unread > 0 && (
              <Chip
                label={unread}
                size="small"
                sx={{
                  height: 18,
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  bgcolor: 'rgba(99,102,241,0.25)',
                  color: '#a5b4fc',
                  border: '1px solid rgba(99,102,241,0.35)',
                  '& .MuiChip-label': { px: 0.75 },
                }}
              />
            )}
          </Stack>
          {unread > 0 && (
            <ButtonBase
              onClick={markAllRead}
              sx={{ borderRadius: 1, px: 1, py: 0.5 }}
            >
              <Typography variant="caption" color="primary.light" fontWeight={500}>
                Mark all read
              </Typography>
            </ButtonBase>
          )}
        </Stack>

        {/* List */}
        <Box sx={{ maxHeight: 420, overflowY: 'auto', '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 } }}>
          {notifications.length === 0 ? (
            <Stack alignItems="center" justifyContent="center" py={6} spacing={1}>
              <IconifyIcon icon="mingcute:bell-slash-line" sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.4 }} />
              <Typography variant="body2" color="text.secondary">No notifications yet</Typography>
            </Stack>
          ) : (
            notifications.map((n, idx) => (
              <Box key={n.id}>
                <ButtonBase
                  onClick={() => markRead(n.id)}
                  sx={{ width: '100%', textAlign: 'left', display: 'block' }}
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="flex-start"
                    sx={{
                      px: 2.5,
                      py: 1.5,
                      position: 'relative',
                      bgcolor: n.read ? 'transparent' : 'rgba(99,102,241,0.05)',
                      transition: 'background 0.2s',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' },
                    }}
                  >
                    {/* Unread dot */}
                    {!n.read && (
                      <Box
                        sx={{
                          position: 'absolute',
                          left: 8,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 5,
                          height: 5,
                          borderRadius: '50%',
                          bgcolor: '#6366f1',
                        }}
                      />
                    )}

                    {/* Icon */}
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        bgcolor: `${n.iconColor}18`,
                        border: `1px solid ${n.iconColor}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        mt: 0.25,
                      }}
                    >
                      <IconifyIcon icon={n.icon} sx={{ fontSize: 16, color: n.iconColor }} />
                    </Box>

                    {/* Content */}
                    <Stack flexGrow={1} minWidth={0} spacing={0.25}>
                      <Typography
                        variant="body2"
                        fontWeight={n.read ? 400 : 600}
                        color={n.read ? 'text.secondary' : 'text.primary'}
                        noWrap
                      >
                        {n.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.7 }} noWrap>
                        {n.subtitle}
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.62rem', color: n.iconColor, opacity: 0.8 }}>
                        {timeAgo(n.time)}
                      </Typography>
                    </Stack>
                  </Stack>
                </ButtonBase>
                {idx < notifications.length - 1 && (
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.04)', mx: 2.5 }} />
                )}
              </Box>
            ))
          )}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            px: 2.5,
            py: 1.5,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.02)',
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.6 }}>
            Showing latest activity from all sections
          </Typography>
        </Box>
      </Popover>
    </>
  );
};

export default NotificationPanel;
