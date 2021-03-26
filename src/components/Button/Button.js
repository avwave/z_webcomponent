import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Secondary } from "../../stories/Button.stories";

export const variants = {
  primary: "primary",
  secondary: "secondary",
  success: "success",
  danger: "danger",
  warning: "warning",
  info: "info",
};
const StyledButton = styled.button`
  appearance: none;
  cursor: pointer;
  height: 40px;
  min-width: 100px;
  left: 0px;
  top: 0px;
  border-radius: 5px;
  padding-left: 10px;
  padding-right: 10px;
  font-size: 14px;
  font-style: normal;
  font-weight: 800;
  line-height: 10px;
  letter-spacing: 0px;
  text-align: center;
  transition: 0.25s all ease-out;
`;

const ButtonPrimary = styled(StyledButton)`
  background: #6a99ca;
  color: ${(props) => (props.disabled ? "#cacaca" : "#ffffff")};
  border: 2px solid #6a99ca;
  &:hover {
    border: 2px solid #355991;
    background-color: #355991;
  };
`;
const ButtonSecondary = styled(StyledButton)`
  background: transparent;
  color: ${(props) => (props.disabled ? "#cacaca" : "#6A99CA")};
  border: 2px solid #6a99ca;
  &:hover {
    border: 2px solid #355991;
    background-color: #cacaca;
  }
`;
const ButtonSuccess = styled(ButtonPrimary)`
  background: #99c423;
  border: 2px solid #99c423;
  &:hover {
    border: 2px solid #658d11;
    background-color: #658d11;
  }
`;
const ButtonDanger = styled(ButtonPrimary)`
  background: #ff4d35;
  border: 2px solid #ff4d35;
  &:hover {
    border: 2px solid #b71a21;
    background-color: #b71a21;
  }
`;
const ButtonWarning = styled(ButtonPrimary)`
  background: #f4b813;
  border: 2px solid #f4b813;
  &:hover {
    border: 2px solid #af7a09;
    background-color: #af7a09;
  }
`;
const ButtonInfo = styled(ButtonPrimary)`
  background: #0a88ff;
  border: 2px solid #0a88ff;
  &:hover {
    border: 2px solid #054eb7;
    background-color: #054eb7;
  }
`;

export default function Button({
  variant,
  title,
  outlined,
  disabled,
  onClick,
  ...props
}) {
  let VariantButton = null;
  switch (variant) {
    case variants.secondary:
      VariantButton = ButtonSecondary
      break
    case variants.success:
      VariantButton = ButtonSuccess
      break
    case variants.danger:
      VariantButton = ButtonDanger
      break
    case variants.warning:
      VariantButton = ButtonWarning
      break
    case variants.info:
      VariantButton = ButtonInfo
      break
    default:
      VariantButton = ButtonPrimary
      break;
  }
  return (
    <VariantButton
      onClick={onClick}
      type="button"
      disabled={disabled}
      {...props}
    >
      {title}
    </VariantButton>
  );
}

Button.propTypes = {
  onClick: PropTypes.func,
  title: PropTypes.string,
  outlined: PropTypes.bool,
  disabled: PropTypes.bool,
  variant: PropTypes.string,
};
