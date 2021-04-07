import React from "react";
import styled from "styled-components";
import { withTheme } from "@material-ui/core/styles";

const Edge = styled.div`
  border-left: ${(props) => `${props.edgeWidth}px`} solid;
  border-color: ${(props) => `${props.edgeColor}`};
  padding-left: ${(props) => `${props.edgePadding}px`};
  display: block;
  height: 100%;
  background: ${(props) => props.background};
`;

function EdgeContainer({
  theme,
  variant = "primary",
  edgeWidth = 5,
  edgeColor,
  edgePadding,
  backgroundColor,
  children,
  clear
}) {
  return (
    <Edge
      background={!clear?(backgroundColor ?? theme.palette[variant].light):'transparent'}
      edgeWidth={edgeWidth}
      edgePadding={edgePadding ?? theme.spacing(1)}
      edgeColor={edgeColor ?? theme.palette[variant].dark}
    >
      {children}
    </Edge>
  );
}

export default withTheme(EdgeContainer);
