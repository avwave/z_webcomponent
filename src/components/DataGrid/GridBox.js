import { Box } from '@material-ui/core';
import React from 'react';

export default function GridBox({ children, align = "center" }) {
  return (
    <Box
      display="flex"
      width="100%"
      height="100%"
      justifyContent={align}
      alignItems="center"
    >
      {children}
    </Box>
  );
}