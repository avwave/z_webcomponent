import React from "react";
import PropTypes from "prop-types";

export default function CheckBox({ onClick, id, active, ...props }) {
  return (
    <div>
      <input type="checkbox" id={id} onClick={onClick} active={active}></input>
    </div>
  );
}

CheckBox.propTypes = {
  onClick: PropTypes.func,
};
