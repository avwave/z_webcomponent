import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Checkbox } from "../Checkbox";
import styled from "styled-components";
import { CheckboxContext } from "./checklistContext";
import isEmpty from "lodash.isempty";
import withTheme from '@mui/styles/withTheme';
import { Button } from "@mui/material";

const StyledList = styled.ul`
  list-style-type: none;
  padding: 16px;
  padding-bottom: 0px;
  border-top: ${(props) => (props.hasTitle ? "solid 1px #c4c4c4" : "none")};
  max-height: ${(props) => props.maxHeight};
  min-height: 20px;
  overflow: auto;
  
`;

const StyledContainer = styled.div`
  background-color: #ffffff;
  min-width: 250px;
  max-width: 300px;
  border-radius: 5px;
  box-shadow: 1px 3px 4px 0px rgba(0, 0, 0, 0.1);
  border: solid 1px #c2c2c2;
  display: flex;
  flex-direction: column;
`;

const StyledHeader = styled.h3`
  text-align: center;
  padding-top: 12px;
  font-size: 14px;
  line-height: 28px;
  font-weight: 400;
  flex: 1;
`;

const ActionComponentContainer = styled.div`
  padding-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FilterActionComponentContainer = styled.div`
  padding-top: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DefaultActionComponentButton = styled(Button)`
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
`;

function Checklist({
  theme,
  title,
  onToggle,
  actionComponent,
  filterActionComponent,
  lineItemComponent,
  maxDisplayHeight = "500px",
  actionComponentLabel,
  actionComponentVariant = "primary",
  actionComponentOnClick = () => {},
}) {
  const LineItemComponent = lineItemComponent || Checkbox;

  const events = { onToggle };

  const [state, dispatch] = useContext(CheckboxContext);

  return (
    <StyledContainer>
      {!isEmpty(title) ? <StyledHeader>{title}</StyledHeader> : null}

      {filterActionComponent ? (
        <FilterActionComponentContainer>
          {filterActionComponent}
        </FilterActionComponentContainer>
      ) : null}

      <StyledList maxHeight={maxDisplayHeight} hasTitle={!isEmpty(title)}>
        {state.items.length === 0 ? <li>No results</li> : <></>}
        {state.items.map((item, index) => (
          <li key={`${item.id}-${index}`}>
            <LineItemComponent
              key={`${item.id}-${index}`}
              item={item}
              {...events}
            />
          </li>
        ))}
      </StyledList>

      {actionComponent ? (
        <ActionComponentContainer>{actionComponent}</ActionComponentContainer>
      ) : null}

      {actionComponentLabel ? (
        <DefaultActionComponentButton
          color={actionComponentVariant}
          variant='contained'
          onClick={() => actionComponentOnClick()}
          disableElevation
          size="large"
        >
          {actionComponentLabel}
        </DefaultActionComponentButton>
      ) : null}
    </StyledContainer>
  );
}

export default withTheme(Checklist);

Checklist.propTypes = {
  /** The list of tasks */
  items: PropTypes.arrayOf(Checkbox.propTypes.item).isRequired,
  /** Event to change the task to pinned */
  title: PropTypes.string,
  actionComponent: PropTypes.any,
  filterActionComponent: PropTypes.any,
};
Checklist.defaultProps = {
  items: [],
};
