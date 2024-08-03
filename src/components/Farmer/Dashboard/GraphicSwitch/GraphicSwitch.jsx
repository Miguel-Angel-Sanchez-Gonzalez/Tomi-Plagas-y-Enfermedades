import React, { useState } from 'react';
import { Switch, Box, styled } from '@mui/material';

const primaryColor = '#3b82f6';

const StyledSwitch = styled(Switch)(({ theme }) => ({
  width: 65,
  height: 28,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(40px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: primaryColor,
        opacity: 1,
        border: 0,
      },
      '& .MuiSwitch-thumb': {
        color: '#fff',
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      width: 23,
      height: 23,
      borderRadius: 18,
    },
  },
  '& .MuiSwitch-track': {
    borderRadius: 20,
    backgroundColor: theme.palette.mode === 'dark' ? '#39393D' : '#E9E9EA',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    position: 'relative',
  },
}));

const GraphicSwitch = ({ onChange }) => {
  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    onChange(event.target.checked ? 'BarChart' : 'LineChart');
  };

  return (
    <Box display="flex" alignItems="center">
      <StyledSwitch checked={checked} onChange={handleChange} />
    </Box>
  );
};

export default GraphicSwitch;
