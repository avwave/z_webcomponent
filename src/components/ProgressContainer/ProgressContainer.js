import React from 'react';
import styled from 'styled-components'
import { withTheme } from "@material-ui/core/styles";

const ProgressMeter = styled.div`
  height: 100%;
  position: relative;
  background: ${(props) => props.background};
`;
const ProgressDiv = styled.div`
  width: ${(props) => `${props.progress}%`};
  display: block;
  height: 100%;
  background: ${(props) => props.background};
`;

function ProgressContainer({theme, progress, variant="primary", foregroundColor, backgroundColor, children}){
  return (
    <ProgressMeter background={backgroundColor ?? theme.palette[variant].dark}>
      <ProgressDiv
        background={foregroundColor ?? theme.palette[variant].light}
        progress={progress}
      >
        {children}
      </ProgressDiv>
    </ProgressMeter>
  );
}
  

export default withTheme(ProgressContainer)