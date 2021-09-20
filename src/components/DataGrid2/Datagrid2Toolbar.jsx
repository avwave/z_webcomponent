import {
  Breadcrumbs,
  Button,
  ButtonGroup,
  Chip,
  Container,
  debounce,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Input,
  InputAdornment, Popover, TextField, Toolbar,
  Typography,
  withStyles
} from "@material-ui/core";
import { Close, FilterList, Search, ViewColumn } from "@material-ui/icons";
import { stringify } from "javascript-stringify";
import { Table } from "ka-table";
import { hideColumn, showColumn } from "ka-table/actionCreators";
import CellEditorBoolean from 'ka-table/Components/CellEditorBoolean/CellEditorBoolean';
import { ActionType, DataType } from 'ka-table/enums';
import 'ka-table/style.scss';
import { isEmpty } from "lodash";
import moment from 'moment'
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import CheckboxProvider from '../CheckList/checklistContext';
import { actions, DataGridContext } from "../DataGrid/DataGridContext";
import { DateTimeRangePicker } from '../DateTimeRangePicker';
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
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  clearButton: {

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
            onChangeDisplay={(value) => {
              changeFilterDisplay(col.key, value);
            }}
          />
        </FormControl>
      );
    });
  },
    [changeFilter, changeFilterDisplay, classes.filterContainer, dataGridState.filterColumn, filterColumnSettings]);


  const stateFilters = useMemo(() => {
    return Object.entries(filterDisplay).filter(f => f[1] !== undefined)
  }, [filterDisplay]);

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
                  keepMounted
                  PaperProps={{
                    style: { minWidth: gridProps?.filterWidth ?? 400 },
                  }}
                >
                  <Container maxWidth="md">
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
                            setFilterDisplay({})
                          }}
                        >
                          Reset
                        </Button>
                      </ButtonGroup>
                      {renderFilters}
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
      <Toolbar variant="dense" className={classes.toolbar}>
        <Grid container spacing={2}>
          {filterable && (
            <>
              <Grid item xs>
                <Input
                  fullWidth
                  startAdornment={<InputAdornment position="start"><Search /></InputAdornment>}
                  placeholder="Search"
                  value={searchField}
                  onChange={event => {
                    setSearchField(event.target.value)
                    debounceSearch(event)
                  }}
                />
              </Grid>
              <Grid item >
                <DateTimeRangePicker inline variant="standard"
                  value={filterValues}
                  onChange={debounce((v) => {
                    setFilterValues({ ...filterValues, ...v });
                  }, 500)} />
              </Grid>
            </>
          )}
        </Grid>
      </Toolbar>
      {((totalCount && loadedCount) ||
        !isEmpty(stateFilters)) && (
          <Toolbar variant="dense" className={classes.toolbar}>
            {!isEmpty(stateFilters) ? (
              <>
                <div className={classes.chips} >
                  <Typography variant="overline" className={classes.filterLabel}>
                    Filtered by:{" "}
                  </Typography>
                  {stateFilters.map(
                    (filter, idx) => {
                      // if (!['search', 'endDate', 'startDate'].includes(filter[0])) {
                      const filterColumn = filterColumnSettings.find((i) => {
                        const ret = i.key === filter[0];
                        return ret;
                      });
                      let label = stringify(filter[1])
                      if (filter[1] instanceof Date) {
                        label = moment(filter[1]).format('L LT')
                      }
                      return (
                        <Chip
                          variant="outlined"
                          label={label}
                          key={idx}
                          icon={<Chip size="small" label={filterColumn?.name ?? filter[0]} />}
                        />
                      );
                      // }
                    }
                  )}
                </div>
                <Button className={classes.clearButton} variant="contained" color="secondary" onClick={() => {
                  setFilterValues({})
                  setFilterDisplay({})
                }}>Clear</Button>
              </>
            ) : <div />}
            <Typography
              className={classes.filterLabel}
              variant="overline"
            >
              {totalCount && loadedCount &&
                `${loadedCount} of ${totalCount}`

              }
            </Typography>


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
