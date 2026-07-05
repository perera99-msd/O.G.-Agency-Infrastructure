import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import IconifyIcon from 'components/base/IconifyIcon';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '../../../firebase';

const googleProvider = new GoogleAuthProvider();

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign in failed.';
      if (
        msg.includes('user-not-found') ||
        msg.includes('wrong-password') ||
        msg.includes('invalid-credential')
      ) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign in failed.';
      if (!msg.includes('popup-closed-by-user')) setError(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Stack alignItems="center" mb={3.5}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2.5,
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
          }}
        >
          <IconifyIcon icon="mingcute:lock-line" sx={{ color: '#fff', fontSize: 24 }} />
        </Box>
        <Typography variant="h4" fontWeight={700} color="text.primary" letterSpacing={-0.5}>
          Welcome back
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5} textAlign="center">
          Sign in to your O.G. Agency dashboard
        </Typography>
      </Stack>

      {/* Error */}
      {error && (
        <Alert
          severity="error"
          onClose={() => setError('')}
          sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.8rem' }}
        >
          {error}
        </Alert>
      )}

      {/* Google Button */}
      <Button
        variant="outlined"
        fullWidth
        size="large"
        onClick={handleGoogleSignIn}
        disabled={googleLoading || loading}
        startIcon={
          googleLoading ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            <IconifyIcon icon="logos:google-icon" />
          )
        }
        sx={{
          mb: 2.5,
          py: 1.4,
          borderRadius: 2,
          borderColor: 'rgba(255,255,255,0.12)',
          color: 'text.primary',
          fontWeight: 600,
          letterSpacing: 0.3,
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(8px)',
          '&:hover': {
            borderColor: 'rgba(99,102,241,0.5)',
            background: 'rgba(99,102,241,0.08)',
          },
        }}
      >
        {googleLoading ? 'Signing in…' : 'Continue with Google'}
      </Button>

      <Divider sx={{ mb: 2.5, color: 'text.secondary', fontSize: '0.75rem' }}>
        or continue with email
      </Divider>

      {/* Email / Password Form */}
      <Stack component="form" onSubmit={handleEmailSignIn} spacing={2}>
        <TextField
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          variant="filled"
          placeholder="Email address"
          autoComplete="email"
          fullWidth
          autoFocus
          required
          disabled={loading || googleLoading}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconifyIcon icon="mingcute:mail-line" sx={{ opacity: 0.5, fontSize: 18 }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          variant="filled"
          placeholder="Password"
          autoComplete="current-password"
          fullWidth
          required
          disabled={loading || googleLoading}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconifyIcon icon="mingcute:key-2-line" sx={{ opacity: 0.5, fontSize: 18 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end" sx={{ opacity: password ? 1 : 0 }}>
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    <IconifyIcon icon={showPassword ? 'ion:eye' : 'ion:eye-off'} />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={loading || googleLoading}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
          sx={{
            py: 1.4,
            borderRadius: 2,
            fontWeight: 700,
            letterSpacing: 0.5,
            fontSize: '0.95rem',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)',
              boxShadow: '0 12px 32px rgba(99,102,241,0.5)',
            },
          }}
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </Button>
      </Stack>
    </Box>
  );
};

export default SignIn;
