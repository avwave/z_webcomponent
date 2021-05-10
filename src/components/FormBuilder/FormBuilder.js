import DateFnsUtils from "@date-io/luxon";
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
  InputLabel,
  LinearProgress,
  makeStyles,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Backspace, CheckBox } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import {
  KeyboardDatePicker,
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { Field, Form, Formik } from "formik";

import { isEmpty } from "lodash";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import * as Yup from "yup";

const useStyles = makeStyles((theme) => ({
  controlContainer: {
    paddingBottom: theme.spacing(2),
  },
}));

const FormBuilder = ({
  form,
  formLayout = [],
  formFactor = "default",
  formLabel,
  submitLabel = "Submit",
  resetLabel = "Reset",
  columns = 1,
  onSubmit = () => {},
  readOnly,
}) => {
  const classes = useStyles();
  const validationSchema = useMemo(() => {
    const validatorMap = Object.fromEntries(
      Object.entries(form)
        .filter(([k, v]) => !!v.validator)
        .map(([k, v]) => {
          return [k, v.validator()];
        })
    );
    const validator = Yup.object().shape({
      ...validatorMap,
    });
    return validator;
  }, [form]);

  const initialValues = useMemo(() => {
    return Object.fromEntries(
      Object.entries(form).map(([k, v]) => {
        return [k, v.initialValues];
      })
    );
  }, [form]);

  const renderField = (formik, fieldName, fieldParams) => {
    const onChangeOverride = fieldParams.onChange
      ? (evt, value) => {
          console.log("📢[FormBuilder.js:81]:", evt, evt?.target?.value, value);
          fieldParams.onChange(fieldName, evt?.target?.value ?? evt);
          formik.setFieldValue(fieldName, evt?.target?.value ?? evt);
        }
      : (evt, value) => {
          console.log("📢[FormBuilder.js:86]:", evt, evt?.target?.value, value);
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
            label={fieldParams.label}
            value={formik.values[fieldName]}
            onChange={onChangeOverride}
            disabled={fieldParams.readOnly}
            error={
              formik.touched[fieldName] && Boolean(formik.errors[fieldName])
            }
            InputLabelProps={{
              shrink: true,
            }}
            {...fieldParams?.fieldProps}
          />
        );

      case "date":
        return (
          <KeyboardDatePicker
            disablePast={fieldParams.disablePast}
            disableFuture={fieldParams.disableFuture}
            label={fieldParams.label}
            name={fieldName}
            onChange={(evt, val) => {
              console.log("📢[FormBuilder.js:122]:", evt, val);
              if (fieldParams.onChange) {
                fieldParams.onChange(fieldName, val);
              }
              formik.setFieldValue(fieldName, val);
            }}
            value={formik.values[fieldName]}
            disabled={fieldParams.readOnly}
            autoOk
            format="MM/dd/yyyy"
            variant="inline"
            mask="__/__/____"
            {...fieldParams?.fieldProps}
          />
        );

      case "time":
        return (
          <KeyboardDateTimePicker
            disablePast={fieldParams.disablePast}
            disableFuture={fieldParams.disableFuture}
            label={fieldParams.label}
            name={fieldName}
            onChange={(evt, val) => {
              console.log("📢[FormBuilder.js:145]:", evt, val);
              if (fieldParams.onChange) {
                fieldParams.onChange(fieldName, val);
              }
              formik.setFieldValue(fieldName, val);
            }}
            value={formik.values[fieldName]}
            disabled={fieldParams.readOnly}
            autoOk
            variant="inline"
            format="MM/dd/yyyy hh:mm a"
            mask="__/__/____ __:__ _M"
            {...fieldParams?.fieldProps}
          />
        );

      case "select":
        return (
          <div style={{ display: "inline-block" }}>
            <InputLabel shrink>{fieldParams.label}</InputLabel>
            <Select
              name={fieldName}
              fullWidth
              label={fieldParams.label}
              value={formik.values[fieldName]}
              onChange={onChangeOverride}
              multiple={fieldParams.settings.multiple}
              disabled={fieldParams.readOnly}
              {...fieldParams?.fieldProps}
            >
              {fieldParams.options.map((item, idx) => {
                return (
                  <MenuItem
                    key={idx}
                    value={item[fieldParams.settings.valueField]}
                  >
                    {item[fieldParams.settings.labelField]}
                  </MenuItem>
                );
              })}
            </Select>
          </div>
        );

      case "switch":
      case "checkbox":
        return (
          <>
            <FormControlLabel
              name={fieldName}
              checked={formik.values[fieldName]}
              control={
                fieldParams.type === "switch" ? <Switch /> : <Checkbox />
              }
              onChange={(evt, val) => {
                console.log("📢[FormBuilder.js:190]:", evt, val);
                if (fieldParams.onChange) {
                  fieldParams.onChange(fieldName, val);
                }
                formik.setFieldValue(fieldName, val);
              }}
              label={fieldParams.label}
              disabled={fieldParams.readOnly}
              {...fieldParams?.fieldProps}
            />
          </>
        );

      case "radio":
        return (
          <>
            <FormLabel component="legend">{fieldParams.label}</FormLabel>
            <RadioGroup
              row={fieldParams.settings.inline}
              name={fieldName}
              value={formik.values[fieldName]}
              onChange={onChangeOverride}
              {...fieldParams?.fieldProps}
            >
              {fieldParams.options.map((item, idx) => (
                <FormControlLabel
                  disabled={fieldParams.readOnly}
                  key={idx}
                  value={item[fieldParams.settings.valueField]}
                  control={<Radio />}
                  label={item[fieldParams.settings.labelField]}
                  {...fieldParams?.fieldProps}
                />
              ))}
            </RadioGroup>
          </>
        );

      case "autocomplete":
        return (
          <Autocomplete
            style={{ verticalAlign: "bottom" }}
            size="small"
            disabled={fieldParams.readOnly}
            disableCloseOnSelect
            name={fieldName}
            label={fieldParams.label}
            value={formik.values[fieldName]}
            onChange={(evt, val) => {
              console.log("📢[FormBuilder.js:247]:", evt, val);
              if (fieldParams.onChange) {
                fieldParams.onChange(fieldName, val);
              }
              formik.setFieldValue(fieldName, val);
            }}
            multiple={fieldParams.settings.multiple}
            options={fieldParams.options}
            getOptionLabel={(option) => {
              return option[fieldParams.settings.labelField] ?? "";
            }}
            closeIcon={<Backspace fontSize="small" />}
            {...fieldParams?.fieldProps}
            renderInput={(iParams) => (
              <TextField
                {...iParams}
                label={fieldParams.label}
                placeholder="type to search"
                error={
                  formik.touched[fieldName] && Boolean(formik.errors[fieldName])
                }
                fullWidth
              />
            )}
          />
        );

      default:
        return <></>;
    }
  };

  const buildComponent = (formik, layout, formParams, colCount, index) => {
    if (Array.isArray(layout)) {
      return (
        <Grid key={`container-${index}`} container spacing={2}>
          {layout.map((subLayout, idx) =>
            buildComponent(
              formik,
              subLayout,
              formParams,
              layout.length,
              `${idx}-${index}`
            )
          )}
        </Grid>
      );
    } else {
      const field = formParams[layout];
      if (field) {
        return (
          <Grid key={layout.id} item xs={12} sm={12 > colCount}>
            <FormControl
              className={classes.controlContainer}
              fullWidth
              component="fieldset"
              error={formik.touched[layout] && Boolean(formik.errors[layout])}
            >
              {renderField(formik, layout, field)}
              <FormHelperText>
                {formik.touched[layout] && formik.errors[layout]}
              </FormHelperText>
            </FormControl>
          </Grid>
        );
      }
    }
  };

  const buildFields = (formik) => {
    const built = formLayout.map((layout, idx) =>
      buildComponent(formik, layout, form, columns, idx)
    );
    return built;
  };

  const buildFormFactor = (formik) => {
    const FormContainer = () => (
      <>
        {buildFields(formik)}
        {formik.isSubmitting && <LinearProgress />}
      </>
    );

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
      return (
        <ButtonGroup variant={variant}>
          <Button
            color="secondary"
            onClick={async () => {
              formik.handleReset();
            }}
          >
            {resetLabel}
          </Button>
          <Button
            color="primary"
            onClick={async () => {
              formik.submitForm();
            }}
          >
            {submitLabel}
          </Button>
        </ButtonGroup>
      );
    };

    switch (formFactor) {
      case "card":
        return (
          <Card>
            <CardHeader title={formLabel} />
            <CardContent>
              <FormContainer />
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
              <Typography variant="h6" style={{ flexGrow: 1 }}>
                {formLabel}
              </Typography>
              <ActionButtons />
            </Toolbar>
            <Container>
              <FormContainer />
            </Container>
          </Box>
        );
      default:
        return (
          <>
            <Typography variant="h6">{formLabel}</Typography>
            <FormContainer />
            <ActionButtons />
          </>
        );
    }
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            setSubmitting(false);
            onSubmit(values);
          }, 500);
        }}
      >
        {(formProp) => {
          return <Form>{buildFormFactor(formProp)}</Form>;
        }}
      </Formik>
    </MuiPickersUtilsProvider>
  );
};

export { FormBuilder };

FormBuilder.propTypes = {
  formLabel: PropTypes.string.isRequired,
  formFactor: PropTypes.string,
  submitLabel: PropTypes.string,
  resetLabel: PropTypes.string,
  columns: PropTypes.number,
  onSubmit: PropTypes.func.isRequired,
};
