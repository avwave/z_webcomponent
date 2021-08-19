import React, { useContext } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import * as Styles from "./styles";
import { LinearProgress } from "@material-ui/core";
import { actions, GridContext } from "../GridContext";

const StyledContainer = styled.div``;
const StyledElement = styled.div`
  ${Styles.base};
  ${(props) => Styles.variant[props.variant]};
  ${(props) => props.selected ? Styles.selected : {}};
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
  variant,
  hasProgress,
  selected,
  id,
  columnId
}) {
  const context = useContext(GridContext);
  const [ctxstate, dispatch] = context || [[], () => {}];

  function onCellClick() {
    if(variant==='header') {
      ctxstate.onColumnSelect(columnId)
    } else {
      dispatch({
        payload: { cellId: id },
        type: actions.CELL_CLICK,
      });
    }
    
  }

  return (
    <StyledContainer>
      <StyledElement
        variant={variant}
        onClick={()=>onCellClick()}
        hasProgress={hasProgress}
        selected={selected}
      >
        <StyledTitle>{title}</StyledTitle>
        <StyledSubtitle>{subtitle}</StyledSubtitle>
      </StyledElement>
      {hasProgress ? <LinearProgress /> : <></>}
    </StyledContainer>
  );
}

Element.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  variant: PropTypes.string,
  selected: PropTypes.bool,
  id: PropTypes.string,
  columnId: PropTypes.string,
  hasProgress: PropTypes.bool,
};
