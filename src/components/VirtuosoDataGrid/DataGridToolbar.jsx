import {
  AppBar,
  Button,
  debounce,
  InputAdornment,
  TextField,
  Toolbar,
  Tooltip
} from "@mui/material";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { makeStyles } from "tss-react/mui";
import { DataGridContext } from "../DataGrid/DataGridContext";
import { FilterDropdown } from "../DataGrid2/FilterDropdown";
import { useUrlState } from "../hooks/useUrlState";
import { isDeeplyEmpty } from "../utils/isDeepEmpty";
import clsx from "clsx";
import { DateTimeRangePicker } from "../DateTimeRangePicker";
import { Search } from "@mui/icons-material";
import { AuocompleteFilterRenderer, ChipTabsFilterRenderer, DateRangeFilterRenderer, OptionFilterRenderer, TextFilterRenderer } from "../DataGrid2/FilterRenderer";
import { CriteriaEditor } from "./CriteriaEditor";

const POPUP_MODE = {
  FILTER: "FILTER",
  COLUMN: "COLUMN",
};

const useStyles = makeStyles()(theme => ({
  actionBar: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  toolbarLeft: {
    flexGrow: 1,
    flexBasis: 0,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  toolbarRight: {
    flexGrow: 1,
    flexBasis: 0,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  filterContainer: {
    paddingBottom: theme.spacing(2),
  },
  heightMax: {
    height: '2.3rem'
  },
  filterBar: {
    width: "100%",
    "& > div": {
      width: "100%",
      overflowX: 'overlay',
    },
    display: "flex",
    [theme.breakpoints.up('md')]: {
      flexWrap: "nowrap",
    },
    [theme.breakpoints.down('md')]: {
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
    [theme.breakpoints.down('md')]: {

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

}))

const DataGridToolbar = ({
  columns,
  showSelector,
  filterable,
  onFilterChange,
  defaultFilters = {},
  rightAccessory,
  leftAccessory,
  centerAccessory,
  totalCount,
  loadedCount,
  children,
  onClearFilters = () => { },
  hasSearchFilter = true,
  searchPlaceholder = 'Search',
  hasDateRangeFilter = true,
  useUrlAsState = false,
  gridId,
  customColumnDisplay: CustomColumnDisplay,
}) => {
  const { classes } = useStyles()

  const [dataGridState, dataGridDispatch] = useContext(DataGridContext);

  const [filterValues, setFilterValues] = useUrlState({ queryKey: `${gridId}-filters`, disable: !useUrlAsState });
  const [filterDisplay, setFilterDisplay] = useState({});

  const [searchField, setSearchField] = useState("");

  useEffect(() => {
    setSearchField(filterValues?.search);
  }, [filterValues?.search]);


  const changeFilter = useCallback(
    debounce((filterKey, filterValue) => {
      const filterV = { ...filterValues, [filterKey]: filterValue }
      setFilterValues(filterV);
      // setSearchField(filterV?.search ?? "")
      onFilterChange(filterV)
    }, 500),
    [filterValues],
  );

  const renderAccessories = useMemo(
    () => {
      const accessoryBar = (
        <Toolbar variant="dense">
          <div className={classes.toolbarLeft}>
            {leftAccessory ? leftAccessory() : <></>}
          </div>
          {centerAccessory ? centerAccessory() : <></>}
          <div className={classes.toolbarRight}>
            {children}
            {rightAccessory ? rightAccessory() : <></>}
          </div>
        </Toolbar>
      )
      if (leftAccessory || centerAccessory || rightAccessory || children) return accessoryBar;
      return <></>

    }, [centerAccessory, children, classes.toolbarLeft, classes.toolbarRight, leftAccessory, rightAccessory]
  );

  const mapCriteriaToFilter = useCallback(
    debounce(values => {
      const mappedValueEntries = values?.map(({ type, value }) => {
        return [type, value]
      })
      const mappedFilters = Object.fromEntries(mappedValueEntries)
      setFilterValues(mappedFilters)
      onFilterChange(mappedFilters)


    }, 500),
    [onFilterChange, setFilterValues],
  );
  return (
    <div className={classes.actionBar}>
      {renderAccessories}
      {filterable && (
        <Toolbar variant="dense" className={classes.toolbar}>
          <div className={classes.filterBar}>
            <CriteriaEditor
              columns={columns}
              onCriteriaChange={(values) => {
                mapCriteriaToFilter(values)
              }}
            />
          </div>
        </Toolbar>
      )}

    </div>

  );
}

export { DataGridToolbar };

