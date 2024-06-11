import { Backspace } from '@mui/icons-material';
import { Autocomplete, Checkbox, TextField } from '@mui/material';
import clsx from 'clsx';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { useStateRef } from '../../../hooks/useStateRef';


const useStyles = makeStyles()(theme => ({
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  selected: {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
  option: {
    minHeight: 'auto',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '&[aria-selected="true"]': {
      backgroundColor: 'transparent',
    },
    '&[data-focus="true"]': {
      backgroundColor: theme.palette.action.hover,
    },
  }
}));

const APIAutoComplete = ({
  value,
  label,
  apiCallback = async(params)=>{},
  apiOptions = {},
  multiple = false,
  labelField,
  valueField,
  renderLabel,
  onChange: onChangeProp,
  ...otherProps
}) => {
  const { classes } = useStyles()
  const [_internalValues, setInternalValues, internalValues ] = useStateRef([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const [options, setOptions] = useState([]);

  useEffect(
    () => {
      setInternalValues(value);
    }, [value]
  );

  useEffect(() => {
    let filtered;

    if (multiple) {
      filtered = options?.filter(v => {
        if (Array.isArray(value)) {
          return [...value]?.some(vv => {
            return vv === v?.[valueField]
          })
        }
        return false
      });
    } else {
      filtered = options?.find(v => value === v?.[valueField]);
    }
    const arr = Array.from(new Set([...internalValues.current, ...filtered]));
    setInternalValues(arr);
  }, [multiple, options, valueField, value]);



  const fetchOptions = useCallback(
    debounce(async (_inputValue) => {
      setLoading(true);
      console.log("dbce", _inputValue)
      try {
        // Make your API request here to fetch the options based on the inputValue
        const params = {
          [apiOptions.parameterName]: _inputValue,
        }
        const response = await apiCallback(params);

        const arr = Array.from(new Set([...internalValues.current, ...response]));
        setOptions(arr);
      } catch (error) {
        console.error('Error fetching options:', error);
      } finally {
        setLoading(false);
      }    
    }, 500),
    
    [apiCallback, apiOptions.parameterName, internalValues]
  )  

  
  return (
    <>
      <Autocomplete
        selectOnFocus
        loading={loading}
        freeSolo
        fullWidth
        value={internalValues.current ?? (multiple ? [] : '')}
        inputValue={inputValue}
        onInputChange={(e, input) => {
          setInputValue(input);
          fetchOptions(input);
        }}
        onChange={(e, val) => {
          setInternalValues(val);
          onChangeProp(val);
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
        renderInput={(iParams) => {
          return (
            <TextField
              variant="outlined"
              fullWidth
              {...iParams}
              InputLabelProps={{
                shrink: true,
              }}
              label={label}
              placeholder={"type to search"} />
          )
        }}
      />
    </>
  );
}

export { APIAutoComplete };
