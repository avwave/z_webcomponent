import React from "react";
import PropTypes from "prop-types";
import { Checkbox } from "../Checkbox";
import styled from "styled-components";
import { CheckboxContext } from "./checklistContext";

const StyledList = styled.ul`
  list-style-type: none;
  padding: 16px;
  padding-bottom: 0px;
  border-top: solid 1px #c4c4c4;
`;

const StyledContainer = styled.div`
  background-color: #ffffff;
  width: 250px;
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

export default function Checklist({
  items,
  title,
  onToggle,
  actionComponent,
  filterActionComponent,
  lineItemComponent
}) {
  const LineItemComponent = lineItemComponent || Checkbox

  const events = { onToggle };

  const [state, dispatch] = React.useContext(CheckboxContext);

  if (state.items.length === 0) {
    return <div>No results</div>;
  }

  return (
    <StyledContainer>
      <StyledHeader>{title}</StyledHeader>

      {filterActionComponent ? (
        <FilterActionComponentContainer>
          {filterActionComponent}
        </FilterActionComponentContainer>
      ) : null}

      <StyledList>
        {state.items.map((item) => (
          <LineItemComponent key={item.id} item={item} {...events} />
        ))}
      </StyledList>

      {actionComponent ? (
        <ActionComponentContainer>{actionComponent}</ActionComponentContainer>
      ) : null}
    </StyledContainer>
  );
}

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
