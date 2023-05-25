import {
  AppBar,
  Box,
  debounce,
  LinearProgress,
  Toolbar
} from "@mui/material";
import { MRT_FullScreenToggleButton, MRT_GlobalFilterTextField, MRT_ShowHideColumnsButton, MRT_ToggleDensePaddingButton, MRT_ToggleFiltersButton } from "material-react-table";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { makeStyles } from "tss-react/mui";
import { DataGridContext } from "../DataGrid/DataGridContext";
import { ChipTabsFilterRenderer } from "../DataGrid2/FilterRenderer";
import { useUrlState } from "../hooks/useUrlState";
import { CriteriaEditor } from "./CriteriaEditor";

const POPUP_MODE = {
  FILTER: "FILTER",
  COLUMN: "COLUMN",
};

const useStyles = makeStyles()(theme => ({
  actionBar: {
    flex: 0,
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
    flex: 1,
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
    width: '100%'
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
  tableInstanceRef
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

  const renderChipFilters = useMemo(() => {
    return columns.filter(f => {
      return f?.filter?.type === 'chiptabs'
    }).map((col, idx) => {
      return <ChipTabsFilterRenderer
        filter={col?.filter}
        value={dataGridState.filterColumn[col.key]}
        onChange={(v) => {
          changeFilter(col.key, v);
        }}
      />
    })
  }, [changeFilter, dataGridState.filterColumn, columns]);


  const hasChipFilter = useMemo(() => {
    const result = columns.some(f => f?.filter?.type === 'chiptabs')
    return result
  }, [columns]);

  const mapCriteriaToFilter = useCallback(
    debounce(values => {
      const mappedValueEntries = values?.filter(f => f?.type !== 'ZWC_defaultdaterange')?.map(({ type, value }) => {
        return [type, value]
      })
      const defaultdaterangefilter = values?.filter(f => f?.type === 'ZWC_defaultdaterange')?.reduce((acc, { value }) => {
        return { ...acc, ...value }
      }, {})

      const mappedFilters = { ...Object.fromEntries(mappedValueEntries), ...defaultdaterangefilter }
      setFilterValues(mappedFilters)
      onFilterChange(mappedFilters)


    }, 500),
    [onFilterChange, setFilterValues],
  );
  const loadingBar = useMemo(
    () => {
      return <LinearProgress
        variant={dataGridState?.loading ? 'query' : 'determinate'}
        value={0}
        color={dataGridState?.loading ? 'primary' : 'inherit'}
      />
    }, [dataGridState?.loading]
  );

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar disableGutters
      sx={{
        alignItems: 'flex-start',
      }} >
        <Box
          sx={{ flexGrow: 1, alignSelf: 'flex-start', overflow: 'auto' }}
        >
          {filterable && (
            <CriteriaEditor
              hasDateRangeFilter={hasDateRangeFilter}
              columns={columns}
              onCriteriaChange={(values) => {
                mapCriteriaToFilter(values)
              }}
              filters={filterValues}
            />
          )}
        </Box>
        {tableInstanceRef.current && (
          <Box sx={{ paddingLeft: 2, minWidth: '250px', width: '250px', display: 'flex', flexDirection: 'row', justifyContent:'flex-end' }}>
            <MRT_GlobalFilterTextField table={tableInstanceRef.current} />
            {/* <MRT_ToggleFiltersButton table={tableInstanceRef.current} /> */}
            <MRT_ShowHideColumnsButton table={tableInstanceRef.current} />
            {/* <MRT_FullScreenToggleButton table={tableInstanceRef.current} /> */}
          </Box>
        )}
      </Toolbar>
      {hasChipFilter && (
        <Toolbar disableGutters variant="dense" className={classes.toolbar}>{renderChipFilters}</Toolbar>
      )}
      {loadingBar}

    </AppBar>

  );
}

export { DataGridToolbar };

