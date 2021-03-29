import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import * as Styles from "./styles";
import { LinearProgress } from "@material-ui/core";

const StyledContainer = styled.div``;
const StyledElement = styled.div`
  ${Styles.base};
  ${(props) => Styles.variant[props.variant]};
  padding-bottom: ${(props) => (props.hasProgress ? "0px" : "4px")};
`;
const StyledTitle = styled.div`
  font-weight: bold;
  line-height: 1.5;
`;
const StyledSubtitle = styled.div`
  font-weight: normal;
  font-size: smaller;
`;

export default function Element({
  title,
  subtitle,
  onClick,
  variant,
  hasProgress,
}) {
  console.log("🚀 ~ file: Element.js ~ line 30 ~ title,subtitle,onClick,variant,hasProgress", title,subtitle,onClick,variant,hasProgress)
  
  return (
    <StyledContainer>
      <StyledElement
        variant={variant}
        onClick={onClick}
        hasProgress={hasProgress}
      >
        <StyledTitle>{title}</StyledTitle>
        <StyledSubtitle>{subtitle}</StyledSubtitle>
      </StyledElement>
      {hasProgress ? <LinearProgress /> : <></>}
    </StyledContainer>
  );
}

Element.propTypes = {
  onClick: PropTypes.func,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  variant: PropTypes.string,
  hasProgress: PropTypes.bool,
};
