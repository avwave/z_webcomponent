import {
  Button, debounce, IconButton, InputAdornment, Popover, TextField, Toolbar,
  Typography,
  withStyles
} from "@material-ui/core";
import { Search, ViewColumn } from "@material-ui/icons";
import clsx from "clsx";
import { Table } from "ka-table";
import { hideColumn, showColumn } from "ka-table/actionCreators";
import CellEditorBoolean from 'ka-table/Components/CellEditorBoolean/CellEditorBoolean';
import { ActionType, DataType } from 'ka-table/enums';
import 'ka-table/style.scss';
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import CheckboxProvider from '../CheckList/checklistContext';
import { DataGridContext } from "../DataGrid/DataGridContext";
import { DateTimeRangePicker } from '../DateTimeRangePicker';
import { isDeeplyEmpty } from "../utils/isDeepEmpty";
import { FilterDropdown } from "./FilterDropdown";
const POPUP_MODE = {
  FILTER: "FILTER",
  COLUMN: "COLUMN",
};

const styles = (theme) => ({
  filterContainer: {
    paddingBottom: theme.spacing(2),
  },
  heightMax: {
    height: '2.3rem'
  },
  filterBar: {
    width: "100%",
    display: "flex",
    [theme.breakpoints.up('md')]: {
      flexWrap: "nowrap",
    },
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap'
    },
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  filterSection: {
    display: 'flex',
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    '& > *': {
      marginRight: theme.spacing(1),
    },
  },
  filterSectionSearch: {
    [theme.breakpoints.up('md')]: {
      minWidth: 215
    },
    [theme.breakpoints.down('sm')]: {

    },
  },
  paddedBottom: {
    paddingBottom: theme.spacing(1),
  },
  filterPopup: {
    flexDirection: "column",
    display: "flex",
    padding: theme.spacing(2),
  },
  filterLabel: {
    fontWeight: "bold",
    justifySelf: 'end',
    minWidth: 100,
    textAlign: 'right'
  },
  toolbar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  root: {
    width: "100%",
  },
  chips: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    alignContent: "space-around",
    justifyContent: "space-between",
    alignItems: "center",
  },
  clearButton: {
    flexBasis: 0
  },
  dateTimeRangePicker: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    flex: 'auto'
  }
});

const UNMColumnSettings = ({ columns, dispatch }) => {
  const columnsSettingsProps = {
    data: columns.map(c => ({ ...c, visible: c.visible !== false })),
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
      dispatch={dispatch}
    />
  );
};

const ColumnSettings = React.memo(UNMColumnSettings)

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
  gridProps,
  onClearFilters=()=>{},
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
  const [filterDisplay, setFilterDisplay] = useState({});

  const [searchField, setSearchField] = useState("");

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


  const changeFilter = useCallback(
    (filterKey, filterValue) => {
      setFilterValues({ ...filterValues, [filterKey]: filterValue });
    },
    [filterValues],
  );

  const changeFilterDisplay = useCallback(
    (filterKey, filterValue) => {
      setFilterDisplay({ ...filterValues, [filterKey]: filterValue });
    },
    [filterValues],
  );

  useEffect(() => {
    onFilterChange(filterValues);
    setSearchField(filterValues?.search ?? "")
  }, [filterValues]);

  const renderFilters = useMemo(() => {
    return filterColumnSettings.map((col, idx) => (
      <FilterDropdown
        key={`filter-${col.id}-${idx}`}
        value={dataGridState.filterColumn[col.key]}
        name={col?.filter?.label ?? col.name}
        colKey={col.key}
        filterRenderer={col.filterRenderer}
        onChangeFilter={value => changeFilter(col.key, value)}
        onChangeFilterDisplay={value => changeFilterDisplay(col.key, value)}
      />
    ));
  },
    [changeFilter, changeFilterDisplay, dataGridState.filterColumn, filterColumnSettings]);


  const stateFilters = useMemo(() => {
    return Object.entries(filterValues).filter(f => f[1] !== undefined)
  }, [filterValues]);

  const debounceSearch = debounce((event) => {
    setFilterValues({ ...filterValues, search: event.target.value })
  }, 500)

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
            {children}
            {rightAccessory ? rightAccessory() : <></>}
          </Toolbar>
        )}
      <Toolbar variant="dense" className={classes.toolbar}>
        <div className={classes.filterBar}>
          {filterable && (
            <>
              <div className={clsx(classes.chips, classes.filterSection)}>
                {renderFilters}
                <DateTimeRangePicker
                  containerProps={{
                    className: classes.dateTimeRangePicker
                  }}
                  label="Date range"
                  inline

                  variant="standard"
                  value={filterValues}
                  onChange={debounce((v) => {
                    setFilterValues({ ...filterValues, ...v });
                  }, 500)} />
              </div>
              <div className={clsx(classes.filterSection, classes.paddedBottom, classes.filterSectionSearch)}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  InputProps={{
                    endAdornment: <InputAdornment position="end"><Search /></InputAdornment>,
                    className: classes.heightMax
                  }}
                  InputLabelProps={{
                    shrink: true
                  }}
                  placeholder="Search"
                  value={searchField}
                  onChange={event => {
                    setSearchField(event.target.value)
                    debounceSearch(event)
                  }}
                />
              </div>
              <div className={clsx(classes.filterSection, classes.paddedBottom)}>
                {!isDeeplyEmpty(filterValues) && (
                  <Button variant="contained" color="secondary" onClick={() => {
                    setFilterValues({})
                    setFilterDisplay({})
                    onClearFilters()
                  }}>Clear</Button>
                )}

                {(totalCount && loadedCount) && (
                  <Typography
                    className={classes.filterLabel}
                    variant="overline"
                  >
                    {totalCount && loadedCount &&
                      `${loadedCount} of ${totalCount}`

                    }
                  </Typography>
                )}
                {showSelector ? (
                  <>
                    <IconButton size="small" variant="default" onClick={handleOpenCheckList}>
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
                      <ColumnSettings {...tableProps} dispatch={action => {
                        if (action.type === ActionType.UpdateCellValue) {
                          dispatch(
                            action.value
                              ? showColumn(action.rowKeyValue)
                              : hideColumn(action.rowKeyValue)
                          );
                        }
                      }} />
                    </Popover>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </>
          )}
        </div>
      </Toolbar>
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
