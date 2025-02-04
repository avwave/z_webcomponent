import React from 'react';
import styled from 'styled-components'
import withTheme from '@mui/styles/withTheme';
import { useTheme } from '@mui/material';

const ProgressMeter = styled.div`
  height: 100%;
  position: relative;
  background: ${(props) => props.background};
  z-index: 1;
`;
const ProgressDiv = styled.div`
  position: absolute;
  top: 0;
  width: ${(props) => `${props.progress}%`};
  display: block;
  height: 100%;
  background: ${(props) => props.background};
  z-index: -1;
`;

function ProgressContainer({progress, variant="primary", foregroundColor, backgroundColor, children}){
  const theme = useTheme()
  return (
    <ProgressMeter background={backgroundColor ?? theme?.palette?.[variant]?.dark}>
      <ProgressDiv
        background={foregroundColor ?? theme?.palette?.[variant]?.light}
        progress={progress}
      />
      {children}
    </ProgressMeter>
    
  );
}
  

export default withTheme(ProgressContainer)