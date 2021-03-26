import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledButton = styled.button`
  background: ${(props) => (props.outlined ? "transparent" : "#6A99CA")};
  color: ${(props) =>
    props.disabled ? "#cacaca" : props.outlined ? "#6A99CA" : "#ffffff"};
  appearance: none;
  cursor: pointer;
  height: 40px;
  min-width: 100px;
  left: 0px;
  top: 0px;
  border-radius: 5px;
  border: 2px solid #6a99ca;
  padding-left: 10px;
  padding-right: 10px;
  font-size: 14px;
  font-style: normal;
  font-weight: 800;
  line-height: 10px;
  letter-spacing: 0px;
  text-align: center;
`;

export default function Button({title, outlined, disabled, onClick, ...props}) {
  return (
    <StyledButton
      onClick={onClick}
      type="button"
      outlined={outlined}
      disabled={disabled}
      {...props}>
        {title}
    </StyledButton>
  );
}

Button.propTypes = {
  onClick: PropTypes.func,
  title: PropTypes.string,
  outlined: PropTypes.bool,
  disabled: PropTypes.bool,
};
