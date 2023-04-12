import { Backspace } from '@mui/icons-material';
import { Autocomplete, Checkbox, TextField } from '@mui/material';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(theme => ({
}));
const CriteriaAutocomplete = ({
  value,
  label,
  options = [],
  multiple = false,
  labelField,
  valueField,
  renderLabel,
  onChange: onChangeProp,
  ...otherProps
}) => {
  const { classes } = useStyles()
  const [internalValues, setInternalValues] = useState(null);

  useEffect(() => {
    let filtered
    if (multiple) {
      filtered = options?.filter(v => {
        return [...value]?.some(vv => {
          return vv === v?.[valueField]
        })
      });
    } else {
      filtered = options?.find(v => value === v?.[valueField]);
    }
    setInternalValues(filtered);
  }, [multiple, options, valueField, value]);

  return (
    <>

      <Autocomplete
        openOnFocus
        fullWidth
        value={internalValues ?? (multiple ? [] : '')}
        // inputValue={internalValues?.[labelField] ?? ""}
        onChange={(e, val) => {
          setInternalValues(val);
          if (multiple) {
            onChangeProp(val.map(v => v?.[valueField]))
          } else {
            onChangeProp(val?.[valueField])
          }
        }}
        multiple={multiple}
        options={options}
        getOptionLabel={(option) => {
          return option[labelField] ?? ""
        }}
        isOptionEqualToValue={(option, t) => {
          return option?.[valueField] === t?.[valueField]
        }}
        renderOption={(props, option, { selected }) => {
          if (multiple) {
            return (
              <li {...props} key={option[valueField]}>
                <div className={clsx(classes.option, selected && classes.selected)}>
                  <Checkbox color="primary" size="small" checked={selected} />
                  {option[renderLabel] ?? option[labelField]}
                </div>
              </li>
            );
          }
          return (
            <li {...props} key={option[valueField]}>
              <div className={clsx(classes.option, selected && classes.selected)}>
                {option[renderLabel] ?? option[labelField]}
              </div>
            </li>
          );
        }}
        clearIcon={<Backspace fontSize="small" />}
        renderInput={(iParams) => (
          <TextField
            variant="standard"
            {...iParams}
            InputLabelProps={{
              shrink: true,
            }}
            label={label}
            placeholder={"type to search"} />
        )}
      />
    </>
  );
}

export { CriteriaAutocomplete };
