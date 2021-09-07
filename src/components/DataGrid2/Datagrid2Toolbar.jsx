import 'ka-table/style.scss'
import { kaReducer, Table } from "ka-table";
import { ActionType, DataType, EditingMode, SortingMode } from 'ka-table/enums';
import { hideColumn, showColumn } from "ka-table/actionCreators";
import CellEditorBoolean from 'ka-table/Components/CellEditorBoolean/CellEditorBoolean';
import {
  Breadcrumbs,
  Button,
  ButtonGroup,
  Chip,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  Popover,
  Toolbar,
  Typography,
  withStyles,
} from "@material-ui/core";
import { FilterList, ViewColumn } from "@material-ui/icons";
import { stringify } from "javascript-stringify";
import { isEmpty } from "lodash";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { actions, DataGridContext } from "../DataGrid/DataGridContext";
import CheckboxProvider from '../CheckList/checklistContext';

const POPUP_MODE = {
  FILTER: "FILTER",
  COLUMN: "COLUMN",
};

const styles = (theme) => ({
  filterContainer: {
    paddingBottom: theme.spacing(2),
  },
  filterPopup: {
    flexDirection: "column",
    display: "flex",
    padding: theme.spacing(2),
  },
  filterLabel: {
    paddingLeft: theme.spacing(1),
    fontWeight: "bold",
  },
  toolbar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  root: {
    width: "100%",
  }
});

const ColumnSettings = tableProps => {
  const columnsSettingsProps = {
    data: tableProps.columns.map(c => ({ ...c, visible: c.visible !== false })),
    rowKeyField: 'key',
    columns: [
      {
        key: 'title',
        isEditable: false,
        title: 'Field',
        dataType: DataType.String
      },
      {
        key: 'visible',
        title: 'Visible',
        isEditable: false,
        style: { textAlign: 'center' },
        width: 80,
        dataType: DataType.Boolean
      }
    ],
  };
  const dispatchSettings = action => {
    if (action.type === ActionType.UpdateCellValue) {
      tableProps.dispatch(
        action.value
          ? showColumn(action.rowKeyValue)
          : hideColumn(action.rowKeyValue)
      );
    }
  };
  return (
    <Table
      {...columnsSettingsProps}
      childComponents={{
        rootDiv: {
          elementAttributes: () => ({ style: { maxHeight: 350, width: 400, marginBottom: 20 } })
        },
        cell: {
          content: props => {
            switch (props.column.key) {
              case 'visible':
                return <CellEditorBoolean {...props} />;
              default:
                break
            }
          }
        }
      }}
      dispatch={dispatchSettings}
    />
  );
};

function DataGrid2Toolbar({
  classes,
  columns,
  showSelector,
  filterable,
  onFilterChange,
  rightAccessory,
  leftAccessory,
  centerAccessory,
  totalCount,
  loadedCount,
  children,
  tableProps,
  dispatch
}) {
  const [columnAnchor, setColumnAnchor] = useState();
  const [filterAnchor, setFilterAnchor] = useState();
  const isCheckListOpen = Boolean(columnAnchor);
  const isFilterListOpen = Boolean(filterAnchor);

  const columnPopoverId = isCheckListOpen ? "column-popover" : undefined;
  const filterPopoverId = isFilterListOpen ? "filter-popover" : undefined;

  const [dataGridState, dataGridDispatch] = useContext(DataGridContext);

  const [filterColumnSettings, setFilterColumnSettings] = useState(columns);

  const [filterValues, setFilterValues] = useState({});

  useEffect(() => {
    setFilterColumnSettings(
      columns.filter(
        (col) => typeof col.filterRenderer === "function"
      )
    );
  }, [columns]);

  const handleOpenCheckList = (event) => {
    setColumnAnchor(event.currentTarget);
  };
  const handleChecklistClose = () => {
    setColumnAnchor(null);
  };

  const handleOpenFilterList = (event) => {
    setFilterAnchor(event.currentTarget);
  };
  const handleFilterListClose = () => {
    setFilterAnchor(null);
  };

  function changeFilter(filterKey, filterValue) {
    setFilterValues({ ...filterValues, [filterKey]: filterValue });
  }

  useEffect(() => {
    onFilterChange(filterValues);
  }, [filterValues]);

  const renderFilters = () => {
    return filterColumnSettings.map((col, idx) => {
      return (
        <FormControl
          key={`filter-${col.id}-${idx}`}
          className={classes.filterContainer}
        >
          <FormHelperText>{col.name}</FormHelperText>
          <col.filterRenderer
            value={dataGridState.filterColumn[col.key]}
            onChange={(value) => {
              changeFilter(col.key, value);
            }}
          />
        </FormControl>
      );
    });
  };

  const stateFilters = useMemo(() => {
    return Object.entries(dataGridState.filterColumn).filter(f=>f[1]!==undefined)
  }, [dataGridState.filterColumn]);

  return (
    <div className={classes.root}>
      {(showSelector ||
        leftAccessory ||
        centerAccessory ||
        rightAccessory ||
        filterable) && (
        <Toolbar variant="dense" className={classes.toolbar} disableGutters>
          {leftAccessory ? leftAccessory() : <></>}
          <div style={{ flex: 1 }} />
          {centerAccessory ? centerAccessory() : <></>}
          <div style={{ flex: 1 }} />
          {showSelector ? (
            <>
              <IconButton variant="default" onClick={handleOpenCheckList}>
                <ViewColumn />
              </IconButton>

              <Popover
                id={columnPopoverId}
                open={isCheckListOpen}
                anchorEl={columnAnchor}
                onClose={handleChecklistClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
              >
                <ColumnSettings {...tableProps} dispatch={dispatch} />
              </Popover>
            </>
          ) : (
            <></>
          )}
          {filterable ? (
            <>
              <IconButton variant="default" onClick={handleOpenFilterList}>
                <FilterList />
              </IconButton>
              <Popover
                id={filterPopoverId}
                open={isFilterListOpen}
                anchorEl={filterAnchor}
                onClose={handleFilterListClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <Container maxWidth="xs">
                  <form
                    noValidate
                    autoComplete="off"
                    className={classes.filterPopup}
                  >
                    <ButtonGroup
                      fullWidth
                      disableElevation
                      variant="text"
                      color="primary"
                    >
                      <Button disabled>Filters</Button>
                      <Button
                        onClick={() => {
                          dataGridDispatch({
                            type: actions.CLEAR_FILTER_COLUMN,
                          });
                        }}
                      >
                        Reset
                      </Button>
                    </ButtonGroup>
                    {renderFilters()}
                  </form>
                </Container>
              </Popover>
            </>
          ) : (
            <></>
          )}
          {children}
          {rightAccessory ? rightAccessory() : <></>}
        </Toolbar>
      )}
      {((totalCount && loadedCount) ||
        !isEmpty(stateFilters)) && (
        <Toolbar variant="dense" className={classes.toolbar} disableGutters>
          <Breadcrumbs>
            {totalCount && loadedCount && (
              <div>
              <Typography
                className={classes.filterLabel}
                variant="overline"
              >
                {loadedCount} of {totalCount}
              </Typography>
              </div>
            )}
            {!isEmpty(stateFilters) && (
              <div>
                <Typography variant="overline" className={classes.filterLabel}>
                  Filtered by:{" "}
                </Typography>
                {stateFilters.map(
                  (filter, idx) => {
                    const filterColumn = filterColumnSettings.find((i) => {
                      const ret = i.key === filter[0];
                      return ret;
                    });
                    return (
                      <Chip
                        variant="outlined"
                        label={stringify(filter[1])}
                        key={idx}
                        icon={<Chip size="small" label={filterColumn.name} />}
                      />
                    );
                  }
                )}
              </div>
            )}
          </Breadcrumbs>
        </Toolbar>
      )}
    </div>
  );
}

function DGWrapper(props) {
  return (
    <CheckboxProvider>
      <DataGrid2Toolbar {...props} />
    </CheckboxProvider>
  );
}
export default withStyles(styles)(DGWrapper);
