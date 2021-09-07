import 'ka-table/style.scss'
import { kaReducer, Table } from "ka-table";
import { ActionType, DataType, SortingMode, SortDirection } from "ka-table/enums";
import { Button, makeStyles, Paper, Typography } from '@material-ui/core';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { hideLoading, showLoading, updateData } from "ka-table/actionCreators";
import { actions as dataGridActions,  DataGridContext } from '../DataGrid/DataGridContext';
import Datagrid2Toolbar from './Datagrid2Toolbar';
import { OptionFilterRenderer, TextFilterRenderer } from '../DataGrid/FilterRenderer';

const useStyles = makeStyles((theme) => {
  return {}
})

const LOAD_MORE_DATA = "LOAD_MORE_DATA";

const PAGE_SIZE = 20

const tablePropsInit = {
  columns: [],
  rowKeyField: 'id',
  virtualScrolling: {
    enabled: true
  },
  columnReordering: true,
  columnResizing: true,
  singleAction: {
    type: LOAD_MORE_DATA
  },
  sortingMode: SortingMode.SingleTripleState
}

const DataGrid2 = ({
  draggable,
  showSelector,
  filterable,
  style,
  containerStyle,
  gridProps,
  contextMenu,
  leftAccessory,
  rightAccessory,
  centerAccessory,
  onLoadMore=()=>{},
  totalCount,
  resetScroll,
  onSort=()=>{},
}) => {
  const classes = useStyles()

  const [tableProps, setTableProps] = useState(tablePropsInit);
  const [pageOffset, setPageOffset] = useState(0);
  const [filters, setFilters] = useState({});
  const [dataGridState, dataGridDispatch] = useContext(DataGridContext);

  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("");


  useEffect(() => {
    onSort(sortColumn, sortDirection);
  }, [sortColumn, sortDirection]);

  useEffect(() => {
    function getFilterRenderer(c) {
      switch (c.filter?.type) {
        case "text":
          return (args) => {
            return <TextFilterRenderer {...args} filter={c?.filter} />;
          };
        case "option":
          return (args) => (
            <OptionFilterRenderer {...args} filter={c?.filter} />
          );
        default:
          return c?.filterRenderer
      }
    }
    const cols = dataGridState.columns.map(col => {
      return {
        ...col,
        key: col.key,
        title: col.name,
        dataType: DataType.Object,
        visible: !col.hidden,
        filterRenderer: getFilterRenderer(col),
      }
    })
    
    setTableProps({ ...tablePropsInit,
      columns: cols,
      data: dataGridState.rows,
      sort: ({ column }) => {
        const sort = column.sortDirection==='ascend'?'ASC':column.sortDirection==='descend'?'DESC':'NONE'
        setSortColumn(column.key);
        setSortDirection(sort);
        return (a,b) => 0
      }
    })
  }, [dataGridState.columns]);

  const kaDispatch = useCallback(
    async action => {
      switch (action.type) {
        case LOAD_MORE_DATA:
          await onLoadMore({
            page_offset: pageOffset,
            page_size: PAGE_SIZE
          })
          break
        default:
          break;
      }
      setTableProps(prevState => {
        const red = kaReducer(prevState, {...prevState, ...action})
        return red
      })
    },
    [onLoadMore, pageOffset],
  );

  useEffect(() => {
    kaDispatch(updateData([...dataGridState.rows]))
  }, [dataGridState.rows, kaDispatch]);

  // useEffect(() => {
  //   dataGridState.loading ? kaDispatch(showLoading()) : kaDispatch(hideLoading())
  // }, [dataGridState.loading, kaDispatch]);

  const fetchRenderer = useCallback(
    (cellProps) => {
      const customCellRenderer = tableProps.columns.find(col => col.key === cellProps.column.key)?.cellRenderer
      return customCellRenderer?customCellRenderer({...cellProps, row:cellProps.rowData}) : cellProps.value
    },
    [tableProps.columns],
  );

  useEffect(() => {
    dataGridDispatch({
      type: dataGridActions.FILTER_COLUMN,
      payload: {
        filterColumn: filters,
      },
    });
  }, [dataGridDispatch, filters]);


  return (
    <Paper>
      <div style={{display:'none'}}>{sortColumn}{sortDirection}</div>
      <Datagrid2Toolbar
        tableProps={tableProps}
        dispatch={kaDispatch}
        columns={tableProps.columns}
        showSelector={showSelector}
        filterable={filterable}
        onFilterChange={setFilters}
        rightAccessory={rightAccessory}
        leftAccessory={leftAccessory}
        centerAccessory={centerAccessory}
        totalCount={totalCount}
        loadedCount={dataGridState.rows.length}
      />
      <Table
        {...tableProps}
        dispatch={kaDispatch}
        childComponents={{
          headCell: {
            elementAttributes: ({ column }) => {
              return column.key === 'id' && {
                style: {
                  ...column.style,
                  position: 'sticky',
                  left: 0,
                  zIndex: 10,
                }
              }
            }
          },
          cell: {
            elementAttributes: ({ column }) => {
              return column.key === 'id' ? {
                style: {
                  ...column.style,
                  position: 'sticky',
                  left: 0,
                  zIndex: 10,
                  backgroundColor: "#fff",
                  overflow: 'hidden'
                }
              } : {
                style: {
                  ...column.style,
                  backgroundColor: "#fff",
                  overflow: 'hidden'
                }
              }
            }
          },
          cellText: {
            content: props => {
              const component = fetchRenderer(props)
              return component
            }
          },
          tableWrapper: {
            elementAttributes: () => ({
              onScroll: (event, { baseFunc }) => {
                baseFunc(event);
                const element = event.currentTarget;
                if (
                  element.offsetHeight + element.scrollTop >=
                  element.scrollHeight
                ) {
                  kaDispatch({ type: LOAD_MORE_DATA });
                }
              },
              style: { maxHeight: 600 }
            })
          }
        }}
      />
    </Paper>
  );
}

export { DataGrid2 }