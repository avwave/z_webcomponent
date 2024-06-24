import { Button, Divider, IconButton, Menu, MenuItem, MenuList, TextField, useTheme } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { ColumnListRow } from './ColumnListRow';
import { ClearAll, Close, ViewColumn } from '@mui/icons-material';
import isEmpty from 'lodash.isempty';

const useStyles = makeStyles()(theme => ({
  header: {
    position: "sticky",
    top: 0,
    backgroundColor: "white",
    zIndex: theme.zIndex.appBar,
  },
  footer: {
    position: "sticky",
    bottom: 0,
    zIndex: theme.zIndex.appBar + 1
  },
  nopadding: {
    padding: 0,
    paddingTop: 0,
    paddingBottom: 0,
  }
}));
const ColumnListFilterMenu = ({ table, columns }) => {
  const { classes } = useStyles()
  const [toggleListOpen, setToggleListOpen] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };


  const {
    getAllColumns,
    getAllLeafColumns,
    getCenterLeafColumns,
    getIsAllColumnsVisible,
    getIsSomeColumnsPinned,
    getIsSomeColumnsVisible,
    getLeftLeafColumns,
    getRightLeafColumns,
    getState,
    toggleAllColumnsVisible,
    options: {
      enableColumnOrdering,
      enableHiding,
      enablePinning,
      localization,
    },
  } = table;

  let allStateColumns = getAllColumns();
  const { density, columnOrder, ...tableState } = getState();

  const [searchText, setSearchText] = useState('');

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;
  const theme = useTheme()

  const hideAllColumns = () => {
    getAllLeafColumns()
      .filter((col) => col.columnDef.enableHiding !== false)
      .forEach((col) => col.toggleVisibility(false));
  };

  const [visibleColumns, setVisibleColumns] = useState(new Set());
  const [activeEnabledColumns, setActiveEnabledColumns] = useState([]);

  useEffect(
    () => {
      setVisibleColumns(new Set(getAllLeafColumns().filter((col) => col.getIsVisible())))
    }, [getAllLeafColumns]
  );
  const allColumns = useMemo(() => {
    let returnColumns = allStateColumns;
    if (
      columnOrder.length > 0 &&
      !returnColumns.some((col) => col.columnDef.columnDefType === 'group')
    ) {
      returnColumns = [
        ...getLeftLeafColumns(),
        ...Array.from(new Set(columnOrder)).map((colId) =>
          getCenterLeafColumns().find((col) => col?.id === colId),
        ),
        ...getRightLeafColumns(),
      ].filter(Boolean);
    }

    if (!isEmpty(searchText)) {
      returnColumns = returnColumns.filter((col) => col.columnDef.header.toLowerCase().includes(searchText.toLowerCase()))
    }
    return returnColumns;

  }, [allStateColumns, columnOrder, getCenterLeafColumns, getLeftLeafColumns, getRightLeafColumns, searchText, tableState])

  const applyFilteredColumns = useCallback(
    () => {
      const arrCols = Array.from(visibleColumns)
      const filteredLeaves = getAllLeafColumns()
        .filter((col) => col.columnDef.enableHiding !== false)
        filteredLeaves.forEach((col) => {
          const hasCol = !!arrCols.find(c => c.id === col.id)
          col.toggleVisibility(hasCol)
        });
    },
    [getAllLeafColumns, visibleColumns]
  );

  const [hoveredColumn, setHoveredColumn] = useState(null);

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small" color="inherit" aria-label="open drawer">
        <ViewColumn />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          dense: density === 'compact',
        }}
        classes={{
          list: classes.nopadding,
        }}
        slotProps={{
          
          paper: {
            sx: {
              maxHeight: '50vh',
              width: '300px',
            }
          },

        }}
      >
        <MenuItem
          onKeyDown={(e) => e.stopPropagation()}
          className={classes.header} 
          disableRipple
          disableTouchRipple
        >
          <TextField
            placeholder='Find columns by name'
            label={localization.searchPlaceholder}
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            fullWidth
            margin="dense"
            variant="outlined"
            size="small"
            autoFocus
            InputProps={{
              endAdornment: !isEmpty(searchText) && <IconButton onClick={() => setSearchText('')} size="small" color="inherit" aria-label="open drawer">
                <Close />
              </IconButton>,
            }}
          />
        </MenuItem>
        
        {allColumns.map((column, index) => (
          <ColumnListRow
            column={column}
            key={`${index}-${column.id}`}
            table={table}
            onChange={({ col, isVisible }) => {
              if (isVisible) {
                setVisibleColumns(new Set([...visibleColumns, col]))
              } else {
                const arr = Array.from(visibleColumns)
                const filtered = arr.filter(c => c.columnDef.id !== col.columnDef.id)
                setVisibleColumns(new Set([...filtered]))
              }
            }}
          />
        ))}
        <div className={classes.footer}>
          <Button
            variant="contained"
            color='secondary'
            fullWidth
            onClick={() => applyFilteredColumns()}
          >
            Display Columns
          </Button>
        </div>
      </Menu>
    </>
  )
}

export { ColumnListFilterMenu };
