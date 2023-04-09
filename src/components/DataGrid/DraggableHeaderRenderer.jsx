import { Typography } from "@mui/material";
import { makeStyles } from 'tss-react/mui';
import { Sort } from "@mui/icons-material";
import React, { useCallback } from "react";
import { SortableHeaderCell } from "react-data-grid";


function useCombinedRefs(...refs) {
  return useCallback((handle) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(handle);
      } else if (ref !== null) {
        ref.current = handle;
      }
    }
  }, refs);
}

const useStyles = makeStyles()((theme) => ({
  headerCell: {
    textTransform: "uppercase",
    display: "inline-flex",
    justifyContent:'center',
    alignItems:'center',
    whiteSpace: "pre-line",
    overflowWrap: "anywhere",
    verticalAlign: "middle",
    width: "100%",
    ...theme.typography.caption
  },
}));

export function DraggableHeaderRenderer({
  component: Component,
  onColumnsReorder,
  column,
  sortColumn,
  sortDirection,
  onSort,
}) {
  const { classes } = useStyles();
  
  return (
    <div
    
      style={{
        cursor: "move",
        display:'inline-block'
      }}
    >
      {column.sortable ? (
        <>
          <SortableHeaderCell
            column={column}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={onSort}
          >
            {Component ? (
              <Component className={classes.headerCell}/>
            ) : (
              <Typography variant="caption" className={classes.headerCell}>
                {column.name}
              </Typography>
            )}
          </SortableHeaderCell>
        </>
      ) : Component ? (
        <Component className={classes.headerCell}/>
      ) : (
        <Typography variant="caption" className={classes.headerCell}>
          {column.name}
        </Typography>
      )}
    </div>
  );
}
