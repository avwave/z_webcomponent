import DateFnsUtils from "@date-io/moment";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel, FormGroup, FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  ListItemText,
  makeStyles,
  MenuItem,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Toolbar, Typography,
  CircularProgress,
  InputLabel
} from "@material-ui/core";
import { Add, Backspace, Close, DateRange, Schedule } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input/input";
import { LocalizationProvider } from "@material-ui/pickers/LocalizationProvider";
import DateFnsAdapter from '@material-ui/pickers/adapter/date-fns';
import { FieldArray, Formik, getIn } from "formik";
import { get, isEmpty } from "lodash";
import PropTypes from "prop-types";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import * as Yup from "yup";
import { FormikPersist } from "./FormikPersist";
import moment from "moment";
import { Fragment } from "react";
import { createContext } from "react";
import { DateTimeRangePicker } from "../DateTimeRangePicker";
import { fromEntries } from "../utils/fromEntries.polyfill";

const useStyles = makeStyles((theme) => ({
  controlContainer: {
    paddingBottom: theme.spacing(2),
  },
  actionBar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  hidden: {
    display: "none",
  },
  subformInline: {
    display: 'flex',
    flexDirection: 'row',
  },
  subformContent: {
    flexGrow: 1,
  },
  subformHeaderTitle: {
    fontWeight: 'bold',
    paddingLeft: theme.spacing(2)
  },
  subformHeader: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.palette.grey[100]
  },
  inlineDelete: {
    alignSelf: "start"
  }
}));

const FormFieldSet = ({
  form,
  formLayout = [],
  formFactor = "default",
  formLabel,
  formSubtitle,
  submitLabel = "Submit",
  resetLabel = "Reset",
  columns = 1,
  formReadOnly,
  setValues = {},
  additionalActions = () => { },
  children,
  variant = "standard",
  onTriggerReset = () => { },
  onTriggerSubmit = () => { },
  triggerReset,
  triggerSubmit,
  decouple,
  reverse = false,
  hasReset = true,
  loading = false,
  onChange,
}) => {
  const classes = useStyles();
  const formcontext = useContext(FormContext);
  const { formik, validationSchema, initialValues } = formcontext

  useEffect(() => {
    onChange(formik.values);
  }, [formik.values, onChange]);

  useEffect(() => {
    if (!isEmpty(setValues)) {
      // NOTE: form freaks out with empty/null values
      formik.setValues({ ...formik.values, ...setValues });
    }
  }, [setValues]);

  useEffect(() => {
    if (!!triggerReset) {
      formik.handleReset();
      onTriggerReset();
    }
  }, [formik, onTriggerReset, triggerReset]);

  useEffect(() => {
    if (!!triggerSubmit) {
      formik.handleSubmit();
      onTriggerSubmit();
    }
  }, [formik, onTriggerSubmit, triggerSubmit]);

  const mergeTime = useCallback(
    (_src, _dest) => {
      const src = moment(_src);
      const dest = moment(_dest);
      const newTime = dest.set({ 'hour': src.get('hour'), 'minute': src.get('minute'), 'second': src.get('second') });
      return newTime.toDate()
    },
    [],
  );
  const renderField = useCallback(
    (fieldName, fieldParams, fieldSource) => {
      let isRequired = !!getIn(validationSchema?.fields, fieldName)?.tests?.find(
        testName => {
          return testName?.OPTIONS?.name === 'required'
        }
      )

      const onChangeOverride = fieldParams.onChange
        ? (evt, value) => {
          fieldParams.onChange(fieldName, evt?.target?.value ?? evt);
          formik.setFieldValue(fieldName, evt?.target?.value ?? evt);
        }
        : (evt, value) => {
          formik.setFieldValue(fieldName, evt?.target?.value ?? evt);
        };
      let formValue = get(formik.values, fieldName)
      let options = fieldParams.options
      const isTouched = Boolean(get(formik.touched, fieldName) || get(formik.touched, fieldSource))
      const isError = Boolean(get(formik.errors, fieldName))
      const hasError = Boolean(isTouched && isError)

      
      if (fieldParams.relatedSource) {
        options = get(formik.values, `${fieldSource}.${fieldParams.relatedSource}`, fieldParams.options)
      }
      switch (fieldParams.type) {
        case "component":
          return <fieldParams.component />;
        case "datetime-local":
        case "date":
        case "time":
        case "text":
        case "email":
        case "number":
          if (fieldParams.type === 'date') formValue = moment(formValue).format("YYYY-MM-DD");
          if (fieldParams.type === 'time') formValue = moment(formValue).format("HH:mm");
          if (fieldParams.type === 'datetime-local') formValue = moment(formValue).format('YYYY-MM-DDTHH:mm:ss');
          return (
            <TextField
              name={fieldName}
              type={fieldParams.type}
              label={`${fieldParams.label} ${isRequired ? '*' : ''}`}
              value={formValue}
              onChange={(evt, value) => {
                let val = evt?.target?.value
                switch (fieldParams.type) {
                  case "datetime-local":
                    val = fieldParams.useLocalTime ? moment(evt?.target?.value).toDate() : moment.utc(evt?.target?.value).toDate()
                    val = isEmpty(evt?.target?.value) ? null : val;
                    break
                  case "date":
                    val = fieldParams.useLocalTime ? moment(evt?.target?.value).startOf('d').toDate() : moment.utc(evt?.target?.value).startOf('d').toDate()
                    val = isEmpty(evt?.target?.value) ? null : val;
                    break
                  case "time":
                    val = moment(evt?.target?.value, ['hh:mm a', 'HH:mm'])
                    val = mergeTime(val, get(formik.values, fieldName))
                    val = fieldParams.useLocalTime ? moment(val).toDate() : moment.utc(val).toDate()
                    val = isEmpty(evt?.target?.value) ? null : val;
                    break
                  default:
                    break;
                }
                onChangeOverride(val, value)
              }}
              disabled={fieldParams.readOnly || formReadOnly}
              error={hasError}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: fieldParams.icon ? (
                  <InputAdornment position="start">
                    {fieldParams.icon}
                  </InputAdornment>
                ) : undefined,
                inputProps: {
                  ...fieldParams.inputProps ?? {}
                }
              }}
              variant={variant}
              {...fieldParams?.fieldProps}
            />
          );
        case "phone":
          return (
            <TextField
              name={fieldName}
              type="tel"
              label={`${fieldParams.label} ${isRequired ? '*' : ''}`}
              value={formValue}
              onChange={(evt, value) => {
                onChangeOverride(evt)
              }}
              disabled={fieldParams.readOnly || formReadOnly}
              error={hasError}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: fieldParams.icon ? (
                  <InputAdornment position="start">
                    {fieldParams.icon}
                  </InputAdornment>
                ) : undefined,
                inputComponent: PhoneInput,
                inputProps: {
                  country: "PH",
                  international: true,
                  withCountryCallingCode: true,
                  ...fieldParams.inputProps ?? {}
                }
              }}
              variant={variant}
              {...fieldParams?.fieldProps}
            />
          );
        case "dateRange":
          return (
            <>
              <InputLabel shrink htmlFor="component-simple">Name</InputLabel>
              <DateTimeRangePicker
                inline={fieldParams.inline}
                form
                name={fieldName}
                variant={variant}
                label={`${fieldParams.label} ${isRequired ? '*' : ''}`}
                value={get(formik.values, fieldName)}
                onChange={onChangeOverride}
                error={hasError}
                disabled={fieldParams.readOnly || formReadOnly}
                {...fieldParams?.fieldProps}
              />
            </>
          )
        case "select":
          return (
            <>
              <TextField
                name={fieldName}
                variant={variant}
                fullWidth
                select
                label={`${fieldParams.label} ${isRequired ? '*' : ''}`}
                value={get(formik.values, fieldName)}
                onChange={onChangeOverride}
                error={hasError}
                SelectProps={{
                  multiple: fieldParams.settings?.multiple,
                  renderValue: (selected, b) => {
                    if (fieldParams.settings?.multiple) {
                      return selected
                        .map((s) => {
                          const item = options.find(
                            (item) =>
                              item[fieldParams.settings?.valueField] === s
                          );
                          return item ? item[fieldParams.settings.labelField] : "";
                        })
                        .join(", ");
                    }
                    const item = options.find(
                      (item) =>
                        item[fieldParams.settings?.valueField] === selected
                    );
                    return item ? item[fieldParams.settings.labelField] : "";
                  },
                }}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: fieldParams.icon ? (
                    <InputAdornment position="start">
                      {fieldParams.icon}
                    </InputAdornment>
                  ) : undefined,
                }}
                disabled={fieldParams.readOnly || formReadOnly}
                {...fieldParams?.fieldProps}
              >
                {options.map((item, idx) => {
                  return (
                    <MenuItem
                      key={idx}
                      value={item[fieldParams.settings?.valueField]}
                    >
                      {fieldParams.settings?.multiple && (
                        <Checkbox
                          checked={get(formik.values, fieldName, []).includes(
                            item[fieldParams.settings?.valueField]
                          )}
                        />
                      )}
                      <ListItemText
                        primary={item[fieldParams.settings.labelField]}
                      />
                    </MenuItem>
                  );
                })}
              </TextField>
            </>
          );
        case "switch":
        case "checkbox":
          return (
            <>
              <FormControlLabel
                name={fieldName}
                checked={get(formik.values, fieldName)}
                control={
                  fieldParams.type === "switch" ? <Switch /> : <Checkbox />
                }
                labelPlacement={fieldParams.settings.labelPlacement ?? 'end'}
                onChange={(evt, val) => {
                  if (fieldParams.onChange) {
                    fieldParams.onChange(fieldName, val);
                  }
                  formik.setFieldValue(fieldName, val);
                }}
                label={`${fieldParams.label} ${isRequired ? '*' : ''}`}
                disabled={fieldParams.readOnly || formReadOnly}
                {...fieldParams?.fieldProps}
              />
            </>
          );

        case "radio":
          return (
            <>
              <FormLabel component="legend">{`${fieldParams.label} ${isRequired ? '*' : ''}`}</FormLabel>
              <RadioGroup
                row={fieldParams.settings.inline}
                name={fieldName}
                value={get(formik.values, fieldName)}
                onChange={onChangeOverride}
                {...fieldParams?.fieldProps}
              >
                {options.map((item, idx) => (
                  <FormControlLabel
                    disabled={fieldParams.readOnly || formReadOnly}
                    key={idx}
                    value={item[fieldParams.settings?.valueField]}
                    labelPlacement={fieldParams.settings.labelPlacement ?? 'end'}
                    control={<Radio />}
                    label={item[fieldParams.settings.labelField]}
                    {...fieldParams?.fieldProps}
                  />
                ))}
              </RadioGroup>
            </>
          );
        case "checkboxes":
          return (
            <>
              <FormLabel component="legend">{`${fieldParams.label} ${isRequired ? '*' : ''}`}</FormLabel>
              <FormGroup
                row={fieldParams.settings.inline}
                // name={fieldName}
                // value={get(formik.values, fieldName)}
                // onChange={onChangeOverride}
                {...fieldParams?.fieldProps}
              >
                {options.map((item, idx) => {
                  const checked = get(formik.values, fieldName, []).includes(item[fieldParams.settings?.valueField]);
                  return (
                    <FormControlLabel
                      disabled={fieldParams.readOnly || formReadOnly}
                      key={idx}
                      name={fieldName}
                      control={<Checkbox checked={checked} />}
                      label={item[fieldParams.settings.labelField]}
                      labelPlacement={fieldParams.settings.labelPlacement ?? 'end'}
                      onChange={(evt, value) => {
                        const valueSet = new Set(get(formik.values, fieldName));
                        value
                          ? valueSet.add(item.id)
                          : valueSet.delete(item.id);
                        formik.setFieldValue(fieldName, Array.from(valueSet));
                      }}
                      {...fieldParams?.fieldProps}
                    />
                  );
                })}
              </FormGroup>
            </>
          );

        case "autocomplete":
          return (
            <Autocomplete
              style={{ verticalAlign: "bottom" }}
              disabled={fieldParams.readOnly || formReadOnly}
              disableCloseOnSelect
              name={fieldName}
              label={`${fieldParams.label} ${isRequired ? '*' : ''}`}
              value={get(formik.values, fieldName)}
              onChange={(evt, val) => {
                if (fieldParams.onChange) {
                  fieldParams.onChange(fieldName, val);
                }
                formik.setFieldValue(fieldName, val);
              }}
              multiple={fieldParams.settings?.multiple}
              options={options}
              getOptionLabel={(option) => {
                return option[fieldParams.settings.labelField] ?? "";
              }}
              getOptionSelected={(option, t) => {
                return option[fieldParams.settings.valueField] === t[fieldParams.settings.valueField];
              }}
              renderOption={(option, { selected }) => {
                if (fieldParams.settings?.multiple) {
                  return (
                    <Fragment>
                      <Checkbox checked={selected} />
                      {option[fieldParams.settings.labelField]}
                    </Fragment>
                  );
                }
                return option[fieldParams.settings.labelField];
              }}
              closeIcon={<Backspace fontSize="small" />}
              renderInput={(iParams) => (
                <TextField
                  {...iParams}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  // {...(fieldParams.icon
                  //   ? {
                  //       InputProps: {
                  //         ...iParams.InputProps,
                  //         startAdornment: fieldParams.icon ? (
                  //           <InputAdornment position="start">
                  //             {fieldParams.icon}
                  //           </InputAdornment>
                  //         ) : undefined,
                  //       },
                  //     }
                  //   : {})}
                  label={`${fieldParams.label} ${isRequired ? '*' : ''}`}
                  placeholder={fieldParams.placeholder ?? "type to search"}
                  variant={variant}
                  error={hasError}
                />
              )}
              {...fieldParams?.fieldProps}
            />
          );
        case "fieldarray":
          return (
            <FieldArray
              name={fieldName}
              render={(arrayHelpers) => {
                if (Array.isArray(get(arrayHelpers.form.values, fieldName))) {
                  return (
                    <>
                      {get(arrayHelpers.form.values, fieldName).map(
                        (subform, idx) => {
                          return (
                            <Box component={fieldParams.settings?.formInset ? Card : 'div'} key={`${fieldName}-${idx}`}
                              className={fieldParams.inline && classes.subformInline}>
                              {!fieldParams.inline &&
                                <Box className={classes.subformHeader} >
                                  <Typography variant="body2" className={classes.subformHeaderTitle}>
                                    {`${fieldParams.label} ${isRequired ? '*' : ''}`}
                                  </Typography>
                                  {
                                    formReadOnly ? null :
                                      <IconButton
                                        aria-label=""
                                        onClick={() => {
                                          arrayHelpers.remove(idx);
                                        }}
                                      >
                                        <Close />
                                      </IconButton>
                                  }
                                </Box>
                              }

                              <Box component={fieldParams.inline ? 'div' : CardContent} className={classes.subformContent}>
                                {buildComponent(
                                  fieldParams.formLayout,
                                  fieldParams.formTemplate,
                                  fieldParams.formLayout.length,
                                  `${fieldName}-${idx}`,
                                  `${fieldName}[${idx}]`
                                )}
                              </Box>
                              {fieldParams.inline &&

                                formReadOnly ? null :
                                <IconButton
                                  className={classes.inlineDelete}
                                  aria-label=""
                                  onClick={() => {
                                    arrayHelpers.remove(idx);
                                  }}
                                >
                                  <Close />
                                </IconButton>
                              }
                            </Box>
                          );
                        }
                      )}
                      {!formReadOnly &&
                        <div>
                          <Button
                            variant="contained"

                            onClick={() => {
                              arrayHelpers.push(fieldParams.formValueTemplate);
                            }}
                            startIcon={<Add />}
                            color="primary"
                          >
                            Add {`${fieldParams.label}`}
                          </Button>
                        </div>
                      }
                    </>
                  );
                }
                if (formReadOnly) return <></>
                return (
                  <div>
                    <Button
                      variant="contained"

                      onClick={() =>
                        arrayHelpers.push(fieldParams.formValueTemplate)
                      }
                      startIcon={<Add />}
                      color="primary"
                    >
                      Add {`${fieldParams.label}`}
                    </Button>
                  </div>
                )
              }}
            />
          );

        default:
          return <></>;
      }
    },
    [formik, variant]
  );

  const buildComponent = useCallback(
    (layout, formParams, colCount, index, fieldName) => {
      if (Array.isArray(layout)) {
        return (
          <Grid key={`container-${index}`} container spacing={2}>
            {layout.map((subLayout, idx) =>
              buildComponent(
                subLayout,
                formParams,
                layout.length,
                `${idx}-${index}`,
                fieldName
              )
            )}
          </Grid>
        );
      } else {
        let field = formParams[layout];
        if (fieldName) {
          layout = `${fieldName}.${layout}`;
        }
        if (field) {
          const err = get(formik.touched, layout) && get(formik.errors, layout);
          const growFactor = ((field.forceColumnWidth ?? 0) === 0) ? {} : { sm: field.forceColumnWidth }
          return (
            <Grid
              className={field.hidden ? classes.hidden : ""}
              key={`${index}-layout-${layout.id}`}
              item
              xs
              {...growFactor}
            >
              <FormControl
                className={classes.controlContainer}
                fullWidth
                component="fieldset"
                variant={variant}
                error={Boolean(err)}
              >
                {renderField(layout, field, fieldName)}
                <FormHelperText>
                  {!Array.isArray(err) ? err : ""}
                </FormHelperText>
              </FormControl>
            </Grid>
          );
        }
      }
    },
    [
      classes.hidden,
      classes.controlContainer,
      formik.errors,
      formik.touched,
      renderField,
      variant,
    ]
  );

  const buildFields = useCallback(() => {
    return formLayout.map((layout, idx) =>
      buildComponent(layout, form, columns, idx)
    );
  }, [buildComponent, columns, form, formLayout]);

  const buildFormFactor = useMemo(() => {
    const ActionButtons = () => {
      let variant = "";
      switch (formFactor) {
        case "card":
        case "toolbar":
          variant = "text";
          break;
        default:
          variant = "contained";
          break;
      }
      if (decouple) return <></>;
      const buttonArray = [
        ...(hasReset
          ? [
            <Button
              key="reset"
              color="secondary"
              variant={variant}
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
              onClick={async () => {
                formik.handleReset();
                onTriggerReset();
              }}
            >
              {resetLabel}
            </Button>,
          ]
          : []),
        <Button
          key="submit"
          color="primary"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
          variant={variant}
          onClick={async () => {
            formik.handleSubmit();
            onTriggerSubmit();
          }}
        >
          {submitLabel}
        </Button>,
      ];
      if (formReadOnly) return <></>
      return <ButtonGroup>{buttonArray}</ButtonGroup>;
    };

    switch (formFactor) {
      case "card":
        return (
          <Card>
            <CardHeader
              title={formLabel}
              subheader={formSubtitle}
              action={additionalActions()}
            />
            <CardContent>
              {buildFields()}
              {children}
              {formik.isSubmitting && <LinearProgress />}
            </CardContent>
            <CardActions>
              <ActionButtons />
            </CardActions>
          </Card>
        );
      case "toolbar":
        return (
          <Box>
            <Toolbar>
              <ListItemText primary={formLabel} secondary={formSubtitle} />
              <ActionButtons />
              {additionalActions()}
            </Toolbar>
            <Container>
              {buildFields()}
              {children}
              {formik.isSubmitting && <LinearProgress />}
            </Container>
          </Box>
        );
      default:
        return (
          <>
            <ListItemText primary={formLabel} secondary={formSubtitle} />
            {buildFields()}
            {children}
            {formik.isSubmitting && <LinearProgress />}
            <div className={classes.actionBar}>
              {reverse ? (
                <>
                  <ActionButtons />
                  <div />
                  {additionalActions()}
                </>
              ) : (
                <>
                  {additionalActions()}
                  <div />
                  <ActionButtons />
                </>
              )}
            </div>
          </>
        );
    }
  }, [
    formFactor,
    decouple,
    resetLabel,
    submitLabel,
    formik,
    onTriggerReset,
    onTriggerSubmit,
    formLabel,
    formSubtitle,
    additionalActions,
    buildFields,
    children,
    reverse,
    classes.actionBar,
    formReadOnly,
    loading,
    hasReset
  ]);

  return (
    // <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <LocalizationProvider dateAdapter={DateFnsAdapter}>
      <form onSubmit={formik.handleSubmit}>{buildFormFactor}</form>
    </LocalizationProvider>
    // </MuiPickersUtilsProvider>
  );
};

const FormContext = createContext({});

const FormBuilder = (props) => {
  const {
    onSubmit = () => { },
    onReset = () => { },
    form,
    additionalValidation,
    additionalInitial,
    formProps,
    formId = "fid",
    usePersist = false,
    onPersistLoad = () => { },
    onChange = () => { },
  } = props;

  const validationSchema = useMemo(() => {
    const validatorSpread = Object.entries({ ...form })
      .filter(([k, v]) => !!v.validator)
      .map(([k, v]) => {
        return [k, v.validator()];
      });

    const validatorMap = fromEntries(validatorSpread);
    const validator = Yup.object().shape({
      ...validatorMap,
      ...additionalValidation,
    });
    return validator;
  }, [additionalValidation, form]);

  const initialValues = useMemo(() => {
    const mapped = fromEntries(
      Object.entries({ ...form }).map(([k, v]) => {
        return [k, v.initialValues];
      })
    );
    return { ...mapped, ...additionalInitial };
  }, [additionalInitial, form]);

  const [reset, setReset] = useState(false);
  return (
    <Formik
      // enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          onSubmit(values);
          setSubmitting(false);
        }, 400);
      }}
      onReset={async (values) => {
        setReset(true);
        onReset(values);
      }}
      {...formProps}
    >
      {(formik) => {
        return (
          <FormContext.Provider
            value={{ validationSchema, initialValues, formik }}
          >
            <FormFieldSet
              {...props}
              onChange={(values) => onChange(values)}
              isSubForm={false}
            />
            {usePersist ? (
              <FormikPersist
                name={formId}
                clearOnOnmount={false}
                clearData={() => { }}
                reset={reset}
                resetCallback={() => setReset(false)}
                onLoaded={(values) => onPersistLoad(values)}
              />
            ) : (
              <></>
            )}
          </FormContext.Provider>
        );
      }}
    </Formik>
  );
};
export { FormBuilder };

FormBuilder.propTypes = {
  formId: PropTypes.string.isRequired,
  formLabel: PropTypes.string.isRequired,
  formFactor: PropTypes.string,
  submitLabel: PropTypes.string,
  resetLabel: PropTypes.string,
  columns: PropTypes.number,
  onSubmit: PropTypes.func.isRequired,
  usePersist: PropTypes.bool,
};
