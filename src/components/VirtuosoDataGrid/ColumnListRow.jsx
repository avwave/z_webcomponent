import { makeStyles } from 'tss-react/mui';
import React, { useEffect, useMemo, useState } from 'react';
import { Checkbox, ListItemAvatar, MenuItem } from '@mui/material';

const useStyles = makeStyles()(theme => ({
}));
const ColumnListRow = ({ column, table, onChange = ({ col, isVisible }) => { } }) => {
  const { classes } = useStyles()

  const [isVisible, setIsVisible] = useState(column.getIsVisible());
  return (
    <MenuItem onKeyDown={(e) => e.stopPropagation()}>
      <ListItemAvatar>
        <Checkbox checked={isVisible} onChange={e => {
          onChange({ col: column, isVisible: e.target.checked })
          setIsVisible(e.target.checked)
        }} />
      </ListItemAvatar>
      {column.columnDef.header}
    </MenuItem>
  )
}

export { ColumnListRow }