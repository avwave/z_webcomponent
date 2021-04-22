import { makeStyles, Typography } from "@material-ui/core";
import { Sort } from "@material-ui/icons";
import React, { useCallback } from "react";
import { SortableHeaderCell } from "react-data-grid";
import { useDrag, useDrop } from "react-dnd";

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

const useStyles = makeStyles((theme) => ({
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
  const classes = useStyles();
  const [{ isDragging }, drag] = useDrag({
    item: { key: column.key, type: "COLUMN_DRAG" },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "COLUMN_DRAG",
    drop({ key, type }) {
      if (type === "COLUMN_DRAG") {
        onColumnsReorder(key, column.key);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={useCombinedRefs(drag, drop)}
      style={{
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isOver ? "#ececec" : "inherit",
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
