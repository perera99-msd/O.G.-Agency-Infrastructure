import { Box, BoxProps } from '@mui/material';
import { Icon, IconProps } from '@iconify/react';

interface IconifyProps extends BoxProps {
  icon: IconProps['icon'];
}

const IconifyIcon = ({ icon, ...rest }: IconifyProps) => {
  return (
    <Box {...rest} display="flex" alignItems="center" justifyContent="center">
      <Icon icon={icon} />
    </Box>
  );
};

export default IconifyIcon;
