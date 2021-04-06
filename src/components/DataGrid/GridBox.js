import { Box, withTheme } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components'

const StyledGridBox = styled(Box)`
  background: ${(props) => props.background};
`;

function GridBox({ theme, variant, children, align = "center" }) {
  return (
    <StyledGridBox
      background={variant ? theme.palette[variant].light : "transparent"}
      display="flex"
      width="100%"
      height="100%"
      justifyContent={align}
      alignItems="center"
    >
      {children}
    </StyledGridBox>
  );
}
export default withTheme(GridBox);