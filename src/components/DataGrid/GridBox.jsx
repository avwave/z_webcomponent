import { Box, useTheme } from '@mui/material';
import withTheme from '@mui/styles/withTheme';
import React from 'react';
import styled from 'styled-components'

const StyledGridBox = styled(Box)`
  background: ${(props) => props.background};
`;

function GridBox({ verticalAlign='center', variant, children, align = "center" }) {
  const theme = useTheme()
  return (
    <StyledGridBox
      background={variant ? theme.palette[variant].light : "transparent"}
      display="flex"
      flexDirection="column"
      width="100%"
      height="100%"
      alignItems={align}
      justifyContent={verticalAlign}
    >
      {children}
    </StyledGridBox>
  );
}
export default withTheme(GridBox);