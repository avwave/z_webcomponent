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
  FormControlLabel,
  FormHelperText,
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
  Toolbar,
  FormGroup,
  Typography,
} from "@material-ui/core";
import { Add, AddBox, ArrowBack, Backspace, Close, DeleteForever, PlusOne } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import {
  KeyboardDatePicker,
  KeyboardDateTimePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { FieldArray, Formik, getIn } from "formik";
import { get, isEmpty } from "lodash";
import PropTypes from "prop-types";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as Yup from "yup";
import { FormikPersist } from "./FormikPersist";

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
  subformHeaderTitle:{
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
  readOnly,
  setValues = {},
  additionalActions = () => {},
  children,
  variant = "standard",
  onTriggerReset = () => {},
  onTriggerSubmit = () => {},
  triggerReset,
  triggerSubmit,
  decouple,
  reverse = false,
  hasReset = true,
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

  const renderField = useCallback(
    (fieldName, fieldParams) => {
      const description = validationSchema.describe()
      let isRequired = !!getIn(validationSchema.describe().fields, fieldName)?.tests?.find(
        testName => {
          return testName.name === 'required'
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
      switch (fieldParams.type) {
        case "component":
          return <fieldParams.component />;
        case "text":
        case "email":
        case "number":
          return (
            <TextField
              name={fieldName}
              type={fieldParams.type}
              label={`${fieldParams.label} ${isRequired?'*':''}`}
              value={get(formik.values, fieldName)}
              onChange={onChangeOverride}
              disabled={fieldParams.readOnly}
              error={
                get(formik.touched, fieldName) &&
                Boolean(get(formik.errors, fieldName))
              }
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: fieldParams.icon ? (
                  <InputAdornment position="start">
                    {fieldParams.icon}
                  </InputAdornment>
                ) : undefined,
              }}
              variant={variant}
              {...fieldParams?.fieldProps}
            />
          );

        case "date":
          return (
            <KeyboardDatePicker
              disablePast={fieldParams.disablePast}
              disableFuture={fieldParams.disableFuture}
              label={`${fieldParams.label} ${isRequired?'*':''}`}
              name={fieldName}
              InputProps={{
                startAdornment: fieldParams.icon ? (
                  <InputAdornment position="start">
                    {fieldParams.icon}
                  </InputAdornment>
                ) : undefined,
              }}
              onChange={(evt, val) => {
                // console.log("📢[FormBuilder.js:152]:", evt);
                if (fieldParams.onChange) {
                  fieldParams.onChange(
                    fieldName,
                    fieldParams.useLocalTime ? evt.local(true) : evt.utc(true)
                  );
                }
                formik.setFieldValue(
                  fieldName,
                  fieldParams.useLocalTime ? evt.local(true) : evt.utc(true)
                );
              }}
              value={get(formik.values, fieldName)}
              disabled={fieldParams.readOnly}
              autoOk
              format="MM/DD/yyyy"
              variant="inline"
              inputVariant={variant}
              mask="__/__/____"
              {...fieldParams?.fieldProps}
            />
          );

        case "datetime":
          return (
            <KeyboardDateTimePicker
              disablePast={fieldParams.disablePast}
              disableFuture={fieldParams.disableFuture}
              label={`${fieldParams.label} ${isRequired?'*':''}`}
              name={fieldName}
              InputProps={{
                startAdornment: fieldParams.icon ? (
                  <InputAdornment position="start">
                    {fieldParams.icon}
                  </InputAdornment>
                ) : undefined,
              }}
              onChange={(evt, val) => {
                if (fieldParams.onChange) {
                  fieldParams.onChange(
                    fieldName,
                    fieldParams.useLocalTime ? evt.local(true) : evt.utc(true)
                  );
                }
                formik.setFieldValue(
                  fieldName,
                  fieldParams.useLocalTime ? evt.local(true) : evt.utc(true)
                );
              }}
              value={get(formik.values, fieldName)}
              disabled={fieldParams.readOnly}
              autoOk
              variant="inline"
              inputVariant={variant}
              format="MM/dd/yyyy hh:mm a"
              mask="__/__/____ __:__ _M"
              {...fieldParams?.fieldProps}
            />
          );
        case "time":
          return (
            <KeyboardTimePicker
              disablePast={fieldParams.disablePast}
              disableFuture={fieldParams.disableFuture}
              label={`${fieldParams.label} ${isRequired?'*':''}`}
              name={fieldName}
              InputProps={{
                startAdornment: fieldParams.icon ? (
                  <InputAdornment position="start">
                    {fieldParams.icon}
                  </InputAdornment>
                ) : undefined,
              }}
              onChange={(evt, val) => {
                // console.log("📢[FormBuilder.js:181]:", evt, val);
                if (fieldParams.onChange) {
                  fieldParams.onChange(
                    fieldName,
                    fieldParams.useLocalTime ? evt.local(true) : evt.utc(true)
                  );
                }
                formik.setFieldValue(
                  fieldName,
                  fieldParams.useLocalTime ? evt.local(true) : evt.utc(true)
                );
              }}
              value={get(formik.values, fieldName)}
              disabled={fieldParams.readOnly}
              autoOk
              variant="inline"
              inputVariant={variant}
              format="hh:mm a"
              mask="__/__/____ __:__ _M"
              {...fieldParams?.fieldProps}
            />
          );

        case "select":
          return (
            <>
              <TextField
                name={fieldName}
                variant={variant}
                fullWidth
                select
                label={`${fieldParams.label} ${isRequired?'*':''}`}
                value={get(formik.values, fieldName)}
                onChange={onChangeOverride}
                error={
                  get(formik.touched, fieldName) &&
                  Boolean(get(formik.errors, fieldName))
                }
                SelectProps={{
                  multiple: fieldParams.settings?.multiple,
                  renderValue: (selected, b) => {
                    if (fieldParams.settings?.multiple) {
                      return selected
                        .map((s) => {
                          const item = fieldParams.options.find(
                            (item) =>
                              item[fieldParams.settings?.valueField] === s
                          );
                          return item?item[fieldParams.settings.labelField]:"";
                        })
                        .join(", ");
                    }
                    const item = fieldParams.options.find(
                      (item) =>
                        item[fieldParams.settings?.valueField] === selected
                    );
                    return item?item[fieldParams.settings.labelField]:"";
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
                disabled={fieldParams.readOnly}
                {...fieldParams?.fieldProps}
              >
                {fieldParams.options.map((item, idx) => {
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
                label={`${fieldParams.label} ${isRequired?'*':''}`}
                disabled={fieldParams.readOnly}
                {...fieldParams?.fieldProps}
              />
            </>
          );

        case "radio":
          return (
            <>
              <FormLabel component="legend">{`${fieldParams.label} ${isRequired?'*':''}`}</FormLabel>
              <RadioGroup
                row={fieldParams.settings.inline}
                name={fieldName}
                value={get(formik.values, fieldName)}
                onChange={onChangeOverride}
                {...fieldParams?.fieldProps}
              >
                {fieldParams.options.map((item, idx) => (
                  <FormControlLabel
                    disabled={fieldParams.readOnly}
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
              <FormLabel component="legend">{`${fieldParams.label} ${isRequired?'*':''}`}</FormLabel>
              <FormGroup
                row={fieldParams.settings.inline}
                // name={fieldName}
                // value={get(formik.values, fieldName)}
                // onChange={onChangeOverride}
                {...fieldParams?.fieldProps}
              >
                {fieldParams.options.map((item, idx) => {
                  const checked = get(formik.values, fieldName, []).includes(item[fieldParams.settings?.valueField]);
                  return (
                    <FormControlLabel
                      disabled={fieldParams.readOnly}
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
              disabled={fieldParams.readOnly}
              disableCloseOnSelect
              name={fieldName}
              label={`${fieldParams.label} ${isRequired?'*':''}`}
              value={get(formik.values, fieldName)}
              onChange={(evt, val) => {
                if (fieldParams.onChange) {
                  fieldParams.onChange(fieldName, val);
                }
                formik.setFieldValue(fieldName, val);
              }}
              multiple={fieldParams.settings?.multiple}
              options={fieldParams.options}
              getOptionLabel={(option) => {
                return option[fieldParams.settings.labelField] ?? "";
              }}
              renderOption={(option, { selected }) => {
                if (fieldParams.settings?.multiple) {
                  return (
                    <React.Fragment>
                      <Checkbox checked={selected} />
                      {option[fieldParams.settings.labelField]}
                    </React.Fragment>
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
                  label={`${fieldParams.label} ${isRequired?'*':''}`}
                  placeholder={fieldParams.placeholder ?? "type to search"}
                  variant={variant}
                  error={
                    get(formik.touched, fieldName) &&
                    Boolean(get(formik.errors, fieldName))
                  }
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
                            <Box component={fieldParams.settings?.formInset?Card:'div'} key={`${fieldName}-${idx}`}
                              className={fieldParams.inline&&classes.subformInline}>
                                {!fieldParams.inline &&
                                <Box className={classes.subformHeader} >
                                  <Typography variant="body2" className={classes.subformHeaderTitle}>
                                    {`${fieldParams.label} ${isRequired?'*':''}`}
                                    </Typography>
                                  <IconButton
                                    aria-label=""
                                    onClick={() => {
                                      arrayHelpers.remove(idx);
                                    }}
                                  >
                                    <Close />
                                  </IconButton>
                                </Box>
                                }

                                <CardContent className={classes.subformContent}>
                                  {buildComponent(
                                    fieldParams.formLayout,
                                    fieldParams.formTemplate,
                                    fieldParams.formLayout.length,
                                    `${fieldName}-${idx}`,
                                    `${fieldName}[${idx}]`
                                  )}
                                </CardContent>
                                {fieldParams.inline &&
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
                      <div>
                      <Button
                        variant="contained"

                        onClick={() => {
                          arrayHelpers.push(fieldParams.formValueTemplate);
                        }}
                        startIcon={<Add/>}
                        color="primary"
                      >
                        Add {`${fieldParams.label}`}
                      </Button>
                      </div>
                    </>
                  );
                }
                return (
                  <div>
                  <Button
                  variant="contained"

                  onClick={() =>
                      arrayHelpers.push(fieldParams.formValueTemplate)
                    }
                  startIcon={<Add/>}
                  color="primary"
                  >
                    Add {`${fieldParams.label}`}
                  </Button>
                  </div>
                );
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
          return (
            <Grid
              className={field.hidden ? classes.hidden : ""}
              key={`${index}-layout-${layout.id}`}
              item
              xs={12}
              sm={12 > colCount}
            >
              <FormControl
                className={classes.controlContainer}
                fullWidth
                component="fieldset"
                variant={variant}
                error={
                  get(formik.touched, layout) &&
                  Boolean(get(formik.errors, layout))
                }
              >
                {renderField(layout, field)}
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
          variant={variant}
          onClick={async () => {
            formik.handleSubmit();
            onTriggerSubmit();
          }}
        >
          {submitLabel}
        </Button>,
      ];
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
  ]);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <form onSubmit={formik.handleSubmit}>{buildFormFactor}</form>
    </MuiPickersUtilsProvider>
  );
};

const FormContext = React.createContext();

const FormBuilder = (props) => {
  const {
    onSubmit = () => {},
    onReset = () => {},
    form,
    additionalValidation,
    additionalInitial,
    formProps,
    formId = "fid",
    usePersist = false,
    onPersistLoad = () => {},
    onChange = () => {},
  } = props;

  const validationSchema = useMemo(() => {
    const validatorSpread = Object.entries({ ...form })
      .filter(([k, v]) => !!v.validator)
      .map(([k, v]) => {
        return [k, v.validator()];
      });

    const validatorMap = Object.fromEntries(validatorSpread);
    const validator = Yup.object().shape({
      ...validatorMap,
      ...additionalValidation,
    });
    return validator;
  }, [additionalValidation, form]);

  const initialValues = useMemo(() => {
    const mapped = Object.fromEntries(
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
                clearData={() => {}}
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
