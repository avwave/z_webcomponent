import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {actions, CheckboxContext} from '../CheckList/checklistContext';

export const status = {
  CHECKED: "CHECKED",
  UNCHECKED: "UNCHECKED",
  INDETERMINATE: "INDETERMINATE",
};

const CheckboxContainer = styled.li`
  display: block;
  height: 28px;
  top: -9px;
  padding-bottom: 5px;
  padding-left: 5px;
  transition: 0.25s all ease-out;
  &:hover {
    background-color: #efefef;
  }
`;

const Icon = styled.span`
  display: flex;
  &:after {
    color: white;
    content: "✔";
    font-weight: bold;
    font-size: 10px;
    text-align: center;
    flex: 1 1 0;
  }
`;

const StyledCheckbox = styled.div`
  display: inline-block;
  width: 12px;
  height: 12px;
  background: ${(props) => (props.checked ? "#6A99CA" : "#FFFFFF")};
  border: solid 1px ${(props) => (props.checked ? "#6A99CA" : "#979797")};
  border-radius: 3px;
  transition: all 150ms;

  ${Icon} {
    visibility: ${(props) => (props.checked ? "visible" : "hidden")};
  }
`;

const StyledLabel = styled.label`
  padding-left: 16px;
  font-weight: 300;
  size: 14px;
  line-height: 28px;
  vertical-align: middle;
`;

export default function Checkbox({ item }) {
  const { id, title, state } = item;
  const context = React.useContext(CheckboxContext)
  const [ctxstate, dispatch]  = context || [[], ()=>{}]

  const onToggle = () => {
    dispatch({
      payload: { id: id },
      type: actions.TOGGLE_ITEM,
    });
  }

  return (
    <CheckboxContainer onClick={() => onToggle(id)}>
      <StyledCheckbox checked={state === status.CHECKED} name="checked">
        <Icon />
      </StyledCheckbox>
      <StyledLabel>{title}</StyledLabel>
    </CheckboxContainer>
  );
}

Checkbox.propTypes = {
  /** Composition of the task */
  item: PropTypes.shape({
    /** Id of the task */
    id: PropTypes.string.isRequired,
    /** Title of the task */
    title: PropTypes.string.isRequired,
    /** Current state of the task */
    state: PropTypes.string.isRequired,
  }),
  /** Event to change the task to archived */
  onToggle: PropTypes.func,
};
