import React, { Component } from "react";
import Chip from "@mui/material/Chip";
import getStatusColor from "../../shared/getStatusColor";

export default class TagCellRender extends Component {
  render() {
    return (
      <span>
        <a href="#" className="ag-tagAnker">
          <Chip
            className="ag-tag"
            label={this.props.value}
            color={getStatusColor(this.props.value)}
          />
        </a>
      </span>
    );
  }
}
