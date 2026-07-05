import { PropsWithChildren } from 'react';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import OGLogo from 'assets/og-agency-logo.png';

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <Stack
      component="main"
      direction="column"
      alignItems="center"
      justifyContent="center"
      width={1}
      minHeight="100vh"
      sx={{
        background: 'radial-gradient(ellipse at top left, #1a1f3c 0%, #0d1117 60%, #0a0f1e 100%)',
        px: 2,
      }}
    >
      {/* Logo */}
      <Box mb={3}>
        <Box
          component="img"
          src={OGLogo}
          alt="O.G. Agency"
          sx={{ height: 80, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.5))' }}
        />
      </Box>

      {/* Card */}
      <Paper
        sx={{
          py: 4,
          px: { xs: 3, sm: 4 },
          width: 1,
          maxWidth: 440,
          borderRadius: 3,
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        }}
      >
        {children}
      </Paper>
    </Stack>
  );
};

export default AuthLayout;
