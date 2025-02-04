import {
  Avatar,
  Box,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  MenuList,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from 'tss-react/mui';
import { amber, red, teal, yellow } from "@mui/material/colors";
import { Backspace, Close, Error } from "@mui/icons-material";
import { Autocomplete } from '@mui/material';
import React, { Fragment, useEffect, useState } from "react";
import { DateTimeRangePicker } from "../DateTimeRangePicker";
import { LitePicker } from "../DateTimeRangePicker/wrapper";

const useStyles = makeStyles()((theme) => ({
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
  chipListRoot: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chipTabRoot: {
    padding: theme.spacing(0.5),
    borderRight: `1px solid ${theme.palette.action.focus}`,

  },
  chipTabIndicator: {
    display: 'flex',
    justifyContent: 'center',
  },
  chipTabSelected: {
    // border: `1px solid ${theme.palette.action.focus}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.action.selected,
  },
  chip: {

  },
  chipLabel: {
    display: 'flex'
  },
  chipRoot: {
    flexFlow: 'row-reverse',
    paddingRight: theme.spacing(1),
    backgroundColor: '#fff',
    border: 0,
    fontWeight: 'bolder',
    textTransform: 'uppercase'
  },
  chipAvatar: {
    width: 'auto !important',
    minWidth: '1em !important',
    borderRadius: '1em/50%',
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem',

  },
  label: {

  }
}));

function TextFilterRenderer({ onChange, onChangeDisplay, value, filter }) {
  const { classes } = useStyles();
  return (
    <FormControl variant="standard" fullWidth className={classes.formControl}>
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

function LegacyOptionFilterRenderer({ onChange, onChangeDisplay, value, filter }) {
  const { classes } = useStyles();
  return (
    <FormControl variant="standard" fullWidth className={classes.formControl}>
      <InputLabel>{filter?.label}</InputLabel>
      <Select
        variant="standard"
        fullWidth
        value={value ?? ""}
        onChange={(e) => {
          onChange(e.target.value)
          const item = filter.options.find(v => v.value === e.target.value)
          onChangeDisplay(item?.label)
        }}>
        <MenuItem value="">
          <em>Any</em>
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
function OptionFilterRenderer({ onChange, onChangeDisplay, value, filter }) {
  const { classes } = useStyles();
  const onLocalChange = (value) => {
    onChange(value)
    const item = filter.options.find(v => v.value === value)
    onChangeDisplay(item?.label)
  }
  return (
    <FormControl variant="standard" fullWidth className={classes.formControl}>
      <MenuList
        fullWidth
      >
        <MenuItem value=""
          onClick={() => onLocalChange(null)}
        >
          <em>Any</em>
        </MenuItem>
        {filter.options.map((option, idx) => (
          <MenuItem
            key={idx}
            value={option.value}
            selected={value === option.value}
            onClick={() => onLocalChange(option.value)}>
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </FormControl>
  );
}

function DateRangeFilterRenderer({ onChange, onChangeDisplay, value, filter }) {
  const { classes } = useStyles();
  return (
    <FormControl variant="standard" fullWidth className={classes.formControl}>
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

function ChipTabsFilterRenderer({ onChange, onChangeDisplay, value, filter, fullWidth = false }) {
  const { classes } = useStyles();
  return (
    <Tabs
      indicatorColor="primary"
      variant="scrollable"
      size="small"
      scrollButtons="auto"
      value={value}
      onChange={(e, val) => {
        onChange(val)
      }}
      classes={{ indicator: classes.chipTabIndicator }}
    >
      {filter?.options.map((option, idx) => {
        let icon
        switch (option?.type) {
          case "warning":
            icon = <Typography className={classes.chipLabel} variant="button"><Error style={{ color: amber[500] }} /> {option?.label}</Typography>
            break;
          case "error":
            icon = <Typography className={classes.chipLabel} variant="button"><Error style={{ color: red[500] }} /> {option?.label}</Typography>
            break;
          case "success":
            icon = <Typography className={classes.chipLabel} variant="button"><Error style={{ color: teal[500] }} /> {option?.label}</Typography>
            break;
          default:
            icon = <Typography className={classes.chipLabel} variant="button">{option?.label}</Typography>
            break;
        }
        return (
          <Tab key={idx} value={option?.v}
            disableFocusRipple
            disableRipple
            wrapped
            sx={!fullWidth ? {} :
              {
                minWidth: "fit-content",
                flex: 1
              }}
            classes={{ root: classes.chipTabRoot, selected: classes.chipTabSelected }}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ pl: 1, pr: 1 }}>
                  {icon}
                </Box>
                {
                  (option?.count || option?.count === 0) && (

                    <Chip sx={{ ml: .5, mr: .5 }}
                      label={option?.count}
                      size="small"
                    />
                  )
                }
              </Box>
              // <Chip
              //   size="small"
              //   variant="outlined"
              //   color={value === option?.v ? "primary" : "default"}
              //   label={icon}
              //   className={classes.chip}
              //   // onClick={() => onChange(option?.v)}
              //   avatar={<Avatar>{option?.count}</Avatar>}
              //   classes={{
              //     root: classes.chipRoot,
              //     avatar: classes.chipAvatar,
              //     label: classes.label,
              //   }}
              // />
            }
          />)
      })}
    </Tabs>
  )
}

function AuocompleteFilterRenderer({ onChange, onChangeDisplay, value, filter }) {
  const { classes, cx } = useStyles();
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
      isOptionEqualToValue={(option, t) => {
        return option[filter?.valueField] === t[filter?.valueField]
      }}
      renderOption={(props, option, { selected }) => {
        if (filter?.multiple) {
          return (
            <li {...props}>
              <div className={cx(classes.option, selected && classes.selected)}>
                <Checkbox color="primary" size="small" checked={selected} />
                {option[filter?.renderLabel] ?? option[filter?.labelField]}
              </div>
            </li>
          );
        }
        return (
          <li {...props}>
            <div className={cx(classes.option, selected && classes.selected)}>
              {option[filter?.renderLabel] ?? option[filter?.labelField]}
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
          label={filter?.label}
          placeholder={"type to search"} />
      )}
    />
  );
}

export { ChipTabsFilterRenderer, TextFilterRenderer, OptionFilterRenderer, AuocompleteFilterRenderer, DateRangeFilterRenderer };
