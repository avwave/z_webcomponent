import React, { useState } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import LogoCellRender from "./logoCellRender";
import TagCellRender from "./tagCellRender";
// import "ag-grid-community/dist/styles/ag-grid.css";
// import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import "./table.css";

export const Table = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const frameworkComponents = {
    logoCellRender: LogoCellRender,
    tagCellRender: TagCellRender,
  };

  const [columnDefs, setcolumnDefs] = useState([
    {
      headerName: "ID",
      field: "id",
    },
    {
      headerName: "Name",
      field: "name",
      cellRenderer: "logoCellRender",
    },
    {
      headerName: "Gender",
      field: "gender",
    },
    {
      headerName: "Age",
      field: "age",
    },
    {
      headerName: "Role",
      field: "role",
    },
    {
      headerName: "Department",
      field: "department",
    },
    {
      headerName: "Vaccination Status",
      field: "Status",
      cellRenderer: "tagCellRender",
      cellEditorParams: {
        values: ["Not Vaccinated", "Vaccinated"],
        cellRenderer: "genderCellRenderer",
      },
    },
  ]);
  const [rowData, setRowData] = useState([
    {
      id: "1",
      name: "Toyot.M.R",
      gender: "Male",
      age: 35,
      role: "Product Manager",
      department: "Developement",
      Status: "Not Vaccinated",
    },
    {
      id: "2",
      name: "Ford",
      gender: "Female",
      age: 32,
      role: "Product Manager",
      department: "Web Development",
      Status: "Not Vaccinated",
    },
    {
      id: "3",
      name: "Pors",
      gender: "Female",
      age: 72,
      role: "Product Manager",
      department: "Android Dvelopment",
      Status: "Not Vaccinated",
    },
    {
      id: "4",
      name: "Porce",
      gender: "Male",
      age: 72,
      role: "Product Manager",
      department: "Android Dvelopment",
      Status: "Not Vaccinated",
    },
    {
      id: "5",
      name: "Lex",
      gender: "Female",
      age: 72,
      role: "Product Manager",
      department: "Android Dvelopment",
      Status: "Not Vaccinated",
    },
  ]);

  // const onGridReady = (params) => {
  //   setGridApi(params.api);
  //   setGridColumnApi(params.columnApi);
  // };
  function onCellValueChanged (event) {
    console.log("data after changes is: ", event.data);
  };

  return (
    <div
      className="ag-theme-alpine"
      style={{ height: "24rem", margin: "auto" }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        frameworkComponents={frameworkComponents}
        pagination={true}
        onCellValueChanged={onCellValueChanged.bind(this)}
        defaultColDef={{
          lockPosition: true,
          filter: true,
          sortable: true,
          floatingFilter: true,
          maxWidth: 180,
          editable: true,
        }}
      >
        <AgGridColumn sortable={true} filter={true}></AgGridColumn>
      </AgGridReact>
    </div>
  );
};
