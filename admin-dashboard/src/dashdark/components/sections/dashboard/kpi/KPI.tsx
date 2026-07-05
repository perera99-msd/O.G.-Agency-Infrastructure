import { fontFamily } from 'theme/typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import IconifyIcon from 'components/base/IconifyIcon';
import RateChip from 'components/common/RateChip';
import { KPIProps } from 'data/kpiData';

const KPI = (props: KPIProps) => {
  const { icon, title, value, rate, isUp } = props;

  return (
    <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
      <Paper sx={{ p: 2.25, pl: 2.5, display: 'flex', flexDirection: 'column', height: 116 }}>
        <Stack
          direction="column"
          justifyContent="space-between"
          height={1}
        >
          <Stack alignItems="center" justifyContent="space-between" direction="row">
            <Stack alignItems="center" gap={1} direction="row">
              <IconifyIcon icon={icon} color="primary.main" fontSize="h5.fontSize" />
              <Typography variant="subtitle2" color="text.secondary" fontFamily={fontFamily.workSans}>
                {title}
              </Typography>
            </Stack>

            <IconButton
              aria-label="menu"
              size="small"
              sx={{ color: 'neutral.light', fontSize: 'h5.fontSize' }}
            >
              <IconifyIcon icon="solar:menu-dots-bold" />
            </IconButton>
          </Stack>

          <Stack alignItems="center" gap={0.875} direction="row">
            <Typography variant="h3" fontWeight={600} letterSpacing={1}>
              {value}
            </Typography>
            <RateChip rate={rate} isUp={isUp} />
          </Stack>
        </Stack>
      </Paper>
    </Grid>
  );
};

export default KPI;
