import React from 'react';
import { RouterProvider } from 'react-router';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './dashdark/theme/theme';
import router from './dashdark/routes/router';
import './dashdark/index.css';

export const DashdarkWrapper: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  );
};
