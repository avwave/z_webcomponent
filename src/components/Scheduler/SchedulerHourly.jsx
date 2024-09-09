import { makeStyles } from 'tss-react/mui';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Box, MenuItem, Popover, Select, Typography } from '@mui/material';

const useStyles = makeStyles()(theme => ({
}));

function getOrdinal(str) {
  let n = parseInt(str);
  let suffix = "th";
  if (n % 100 < 11 || n % 100 > 13) {
    switch (n % 10) {
      case 1: suffix = "st"; break;
      case 2: suffix = "nd"; break;
      case 3: suffix = "rd"; break;
      default: suffix = "th"; break;
    }
  }
  return suffix;
}

const ColumnSelector = ({
  value,
  rangeEnd = 60,
  batch=10,
  startAtOne = false,
  onChange = () => { },
  showSuffix = false,
  suffix = "",

  ...props
}) => {
  const [selectedValue, setSelectedValue] = useState(`${value}`);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (value) => {
    setSelectedValue(value);
    onChange(value);
    handleClose();
  };


  const options = Array.from({ length: rangeEnd }, (_, i) => i).map((i) => ({
    id: startAtOne ? i + 1 : i,
    name: (startAtOne ? i + 1 : i).toString(),
  }));

  const open = Boolean(anchorEl);

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      gap={1}
    >
      <Select
        value={selectedValue}
        onClick={handleOpen}
        open={false}
        sx={{
          minWidth: 100,
          textAlign: showSuffix ? 'end' : 'start',
        }}
        IconComponent={() => null}
        inputProps={
          showSuffix ? { sx: { paddingRight: '1em !important' } } : {}
        }
        {...props}
      >
        <MenuItem value={selectedValue}>{selectedValue || 'Select an option'}</MenuItem>
      </Select>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${batch}, 1fr)`,
            gap: 1,
            p: 1,
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.id} onClick={() => handleChange(option.name)}>
              {option.name}
            </MenuItem>
          ))}
        </Box>
      </Popover>
      {showSuffix && <Typography >{"  "}{getOrdinal(selectedValue)} {suffix}</Typography>}
    </Box>
  );
};

const SchedulerHourly = ({
  onChange = (v) => { },
  value = { minute: 0 },
  hidePrefix = false,
  ...props
}) => {
  const { classes } = useStyles()
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      gap={1}
    >
      {!hidePrefix && <Typography>Every</Typography>}
      <ColumnSelector
        value={value.minute}
        onChange={(minute) => onChange({ minute })}
        showSuffix
        suffix="minute"
        rangeEnd={60}
        {...props}
      />
    </Box>
  )
}

export { SchedulerHourly, ColumnSelector }