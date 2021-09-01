import * as React from "react";
import {
  Plugin,
  Template,
  TemplateConnector,
  TemplatePlaceholder
} from "@devexpress/dx-react-core";
import Button from "@material-ui/core/Button";
import DataGridToolbar from "../DataGrid/DataGridToolbar";

const DGToolbar = (props) => {
  return (
    <Plugin
      name="ToolbarEditing"
      dependencies={[
        {
          name: "Toolbar"
        }
      ]}
    >
      <Template name="toolbarContent">
        <DataGridToolbar {...props}>
          <TemplatePlaceholder />
        </DataGridToolbar>
      </Template>
    </Plugin>
  );
};

export {DGToolbar}
