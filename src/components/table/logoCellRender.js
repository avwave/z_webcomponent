import React, { Component } from "react";

export default class LogoCellRender extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const imageSource = "../../../public/boy.jpg";
    return (
      <span>
        <img src={imageSource} />
        {this.props.value}
      </span>
    );
  }
}
