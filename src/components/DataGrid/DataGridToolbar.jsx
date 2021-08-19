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
import { Checklist } from "../CheckList";
import CheckboxProvider, {
  actions as checkboxActions,
  CheckboxContext,
} from "../CheckList/checklistContext";
import { actions, DataGridContext } from "./DataGridContext";

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
});

function DataGridToolbar({
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
    const filterColumnSettings = columns.filter(
      (col) => typeof col.filterRenderer === "function"
    );
    setFilterColumnSettings(filterColumnSettings);
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
    <>
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
              >
                <Checklist />
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
    </>
  );
}
export default withStyles(styles)(DataGridToolbar);
