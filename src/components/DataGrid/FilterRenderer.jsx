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
import React, { Fragment, useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(0),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
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
          const item =filter.options.find(v=> v.value === e.target.value)
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
function AuocompleteFilterRenderer({ onChange, onChangeDisplay, value, filter }) {
  const classes = useStyles();
  const [internalValues, setInternalValues] = useState(value);

  useEffect(() => {
    const filtered = filter?.options.filter(v => value?.some(vv => {
      return vv === v?.[filter?.valueField]
    }));
    setInternalValues(filtered);
  }, [filter?.options, filter?.valueField, value]);

  return (
    <FormControl fullWidth className={classes.formControl}>
      <Autocomplete
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
              <Fragment>
                <Checkbox checked={selected} />
                {option[filter?.labelField]}
              </Fragment>
            );
          }
          return option[filter?.labelField];
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
    </FormControl>
  )
}

export { TextFilterRenderer, OptionFilterRenderer, AuocompleteFilterRenderer };
