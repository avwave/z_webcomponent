import React, { Component } from "react";
import Chip from "@material-ui/core/Chip";
import getStatusColor from "../../shared/getStatusColor";

export default class TagCellRender extends Component {
  render() {
    return (
      <span>
        <a href="#" className="tagAnker">
          <Chip
            className="tag"
            label={this.props.value}
            color={getStatusColor(this.props.value)}
          />
        </a>
      </span>
    );
  }
}
