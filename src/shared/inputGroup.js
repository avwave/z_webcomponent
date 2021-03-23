import React from "react";

class InputGroups extends React.Component {
  render() {
    return (
      <div className="col">
        <div className="input-group">
          <span className="input-group-addon transparent">
            <span className="fa fa-envelope" />
          </span>
          <input className="form-control left-border-none" {...this.props} />
        </div>
      </div>
    );
  }
}
export default InputGroups;
