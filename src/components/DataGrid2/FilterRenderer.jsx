import {
  Checkbox,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { Backspace, Close } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import clsx from "clsx";
import React, { Fragment, useEffect, useState } from "react";
import { DateTimeRangePicker } from "../DateTimeRangePicker";
import { LitePicker } from "../DateTimeRangePicker/wrapper";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(0),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  selected: {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
  paper: {
    boxShadow: 'none',
    margin: 0,
    color: '#586069',
  },
  option: {
    minHeight: 'auto',
    width: '100%',
    alignItems: 'flex-start',
    '&[aria-selected="true"]': {
      backgroundColor: 'transparent',
    },
    '&[data-focus="true"]': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  popperDisablePortal: {
    position: 'relative',
    width: '100% !important'
  },
}));

function TextFilterRenderer({ onChange, onChangeDisplay, value, filter }) {
  const classes = useStyles();
  return (
    <FormControl fullWidth className={classes.formControl}>
      <InputLabel>{filter?.label}</InputLabel>
      <Input
        onChange={(e) => {
          onChange(e.target.value)
          onChangeDisplay(e.target.value)
        }}
        fullWidth
        value={value ?? ""}
        endAdornment={
          value ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="close"
                size="small"
                onClick={() => {
                  onChange("")
                  onChangeDisplay("")
                }}
              >
                <Close />
              </IconButton>
            </InputAdornment>
          ) : null
        }
      />
    </FormControl>
  );
}

function OptionFilterRenderer({ onChange, onChangeDisplay, value, filter }) {
  const classes = useStyles();
  return (
    <FormControl fullWidth className={classes.formControl}>
      <InputLabel>{filter?.label}</InputLabel>
      <Select
        fullWidth
        value={value ?? ""}
        onChange={(e) => {
          onChange(e.target.value)
          const item = filter.options.find(v => v.value === e.target.value)
          onChangeDisplay(item?.label)
        }}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {filter.options.map((option, idx) => (
          <MenuItem key={idx} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function DateRangeFilterRenderer({ onChange, onChangeDisplay, value, filter }) {
  const classes = useStyles();
  return (
    <FormControl fullWidth className={classes.formControl}>
      <InputLabel>{filter?.label}</InputLabel>
      <LitePicker label="Date range"
        inline
        variant="standard"
        value={value}
        onCancel={() => onChange(null)}
        onValueChange={(val) => {
          onChange(val)
        }} />
    </FormControl>
  );
}

function AuocompleteFilterRenderer({ onChange, onChangeDisplay, value, filter }) {
  const classes = useStyles();
  const [internalValues, setInternalValues] = useState(value);

  useEffect(() => {
    let filtered
    if (filter?.multiple) {
      filtered = filter?.options.filter(v => value?.some(vv => {
        return vv === v?.[filter?.valueField]
      }));
    } else {
      filtered = filter?.options.find(v => value === v?.[filter?.valueField]);
    }
    setInternalValues(filtered);
  }, [filter?.multiple, filter?.options, filter?.valueField, value]);

  return (
    <Autocomplete
      open
      disablePortal
      fullWidth
      classes={{
        paper: classes.paper,
        option: classes.option,
        popperDisablePortal: classes.popperDisablePortal,
      }}
      value={internalValues ?? (filter?.multiple ? [] : '')}
      onChange={(e, val) => {
        setInternalValues(val);
        if (filter?.multiple) {
          onChange(val.map(v => v?.[filter.valueField]))
          onChangeDisplay(val.map(v => v?.[filter.labelField]))
        } else {
          onChange(val?.[filter.valueField])
          onChangeDisplay(val?.[filter.labelField])
        }
      }}
      multiple={filter?.multiple}
      options={filter?.options}
      getOptionLabel={(option) => {
        return option[filter?.labelField] ?? ""
      }}
      getOptionSelected={(option, t) => {
        return option[filter?.valueField] === t[filter?.valueField]
      }}
      renderOption={(option, { selected }) => {
        if (filter?.multiple) {
          return (
            <div className={clsx(classes.option, selected && classes.selected)}>
              <Checkbox color="primary" size="small" checked={selected} />
              {option[filter?.renderLabel] ?? option[filter?.labelField]}
            </div>
          );
        }
        return <div className={clsx(classes.option, selected && classes.selected)}>
          {option[filter?.renderLabel] ?? option[filter?.labelField]}
        </div>
      }}
      closeIcon={<Backspace fontSize="small" />}
      renderInput={(iParams) => (
        <TextField
          {...iParams}
          InputLabelProps={{
            shrink: true,
          }}
          label={filter?.label}
          placeholder={"type to search"}
        />
      )}
    />

  )
}

export { TextFilterRenderer, OptionFilterRenderer, AuocompleteFilterRenderer, DateRangeFilterRenderer};
