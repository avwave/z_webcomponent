import {
  Button,
  ButtonGroup,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  Popover,
  Toolbar,
  withStyles,
} from "@material-ui/core";
import { FilterList, ViewColumn } from "@material-ui/icons";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
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
});

function DataGridToolbar({ classes, columns, showSelector, onFilterChange }) {
  const [columnAnchor, setColumnAnchor] = useState();
  const [filterAnchor, setFilterAnchor] = useState();
  const isCheckListOpen = Boolean(columnAnchor);
  const isFilterListOpen = Boolean(filterAnchor);

  const columnPopoverId = isCheckListOpen ? "column-popover" : undefined;
  const filterPopoverId = isFilterListOpen ? "filter-popover" : undefined;

  const [dataGridState, dataGridDispatch] = React.useContext(DataGridContext);

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

  return (
    <Toolbar className={classes.toolbar}>
      <div style={{ flex: 1 }} />
      {showSelector ? (
        <>
          <IconButton variant="default" onClick={handleOpenFilterList}>
            <FilterList />
          </IconButton>
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
    </Toolbar>
  );
}
export default withStyles(styles)(DataGridToolbar);
