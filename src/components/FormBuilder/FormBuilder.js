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
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Field, Form, Formik } from "formik";
import {
  KeyboardDatePicker,
  KeyboardDateTimePicker,
} from "formik-material-ui-pickers";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import * as Yup from "yup";

const FormBuilder = ({
  form,
  formFactor = "default",
  formLabel,
  submitLabel = "Submit",
  resetLabel = "Reset",
  columns = 1,
  onSubmit = () => {},
  readOnly,
}) => {
  const validationSchema = useMemo(() => {
    const validatorMap = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v.validator()])
    );
    const validator = Yup.object().shape({
      ...validatorMap,
    });
    return validator;
  }, [form]);

  const initialValues = useMemo(() => {
    return Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v.initialValues])
    );
  }, [form]);

  const buildFields = (formik) => {
    const formParams = Object.entries(form).map(([fieldName, fieldParams]) => {
      let Component = <></>;

      switch (fieldParams.type) {
        case "text":
        case "email":
        case "number":
          Component = () => (
            <TextField
              name={fieldName}
              type={fieldParams.type}
              label={fieldParams.label}
              value={formik.values[fieldName]}
              onChange={formik.handleChange}
              disabled={fieldParams.readOnly}
              error={
                formik.touched[fieldName] && Boolean(formik.errors[fieldName])
              }
            />
          );

          break;
        case "date":
          Component = () => (
            <Field
              disablePast={fieldParams.disablePast}
              disableFuture={fieldParams.disableFuture}
              component={KeyboardDatePicker}
              label={fieldParams.label}
              name={fieldName}
              disabled={fieldParams.readOnly}
              autoOk
              format="MM/dd/yyyy"
              variant="inline"
              mask="__/__/____"
            />
          );
          break;
        case "time":
          Component = () => (
            <Field
              disablePast={fieldParams.disablePast}
              disableFuture={fieldParams.disableFuture}
              component={KeyboardDateTimePicker}
              label={fieldParams.label}
              name={fieldName}
              disabled={fieldParams.readOnly}
              autoOk
              variant="inline"
              format="MM/dd/yyyy hh:mm a"
              mask="__/__/____ __:__ _M"
            />
          );
          break;
        case "select":
          Component = () => (
            <div style={{ display: "inline-block" }}>
              <InputLabel>{fieldParams.label}</InputLabel>
              <Select
                name={fieldName}
                fullWidth
                label={fieldParams.label}
                value={formik.values[fieldName]}
                onChange={formik.handleChange}
                multiple={fieldParams.settings.multiple}
                disabled={fieldParams.readOnly}
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
          break;
        case "switch":
        case "checkbox":
          Component = () => (
            <>
              <FormControlLabel
                name={fieldName}
                checked={formik.values[fieldName]}
                control={
                  fieldParams.type === "switch" ? <Switch /> : <Checkbox />
                }
                onChange={formik.handleChange}
                label={fieldParams.label}
                disabled={fieldParams.readOnly}
              />
            </>
          );
          break;
        case "radio":
          Component = () => (
            <>
              <FormLabel component="legend">{fieldParams.label}</FormLabel>
              <RadioGroup
                name={fieldName}
                value={formik.values[fieldName]}
                onChange={formik.handleChange}
              >
                {fieldParams.options.map((item, idx) => (
                  <FormControlLabel
                    disabled={fieldParams.readOnly}
                    key={idx}
                    value={item[fieldParams.settings.valueField]}
                    control={<Radio />}
                    label={item[fieldParams.settings.labelField]}
                  />
                ))}
              </RadioGroup>
            </>
          );
          break;
        case "autocomplete":
          Component = () => (
            <Autocomplete
              style={{ verticalAlign: "bottom" }}
              size="small"
              disabled={fieldParams.readOnly}
              disableCloseOnSelect
              name={fieldName}
              label={fieldParams.label}
              value={formik.values[fieldName]}
              onChange={(evt, val) => {
                formik.setFieldValue(fieldName, val);
              }}
              multiple={fieldParams.settings.multiple}
              options={fieldParams.options}
              getOptionLabel={(option) => {
                return option[fieldParams.settings.labelField] ?? "";
              }}
              closeIcon={<Backspace fontSize="small" />}
              renderInput={(iParams) => (
                <TextField
                  {...iParams}
                  label={fieldParams.label}
                  error={
                    formik.touched[fieldName] &&
                    Boolean(formik.errors[fieldName])
                  }
                  fullWidth
                />
              )}
            />
          );
          break;
        default:
          Component = () => <></>;
      }

      return () => (
        <FormControl
          fullWidth
          component="fieldset"
          error={formik.touched[fieldName] && Boolean(formik.errors[fieldName])}
        >
          <Component />
          <FormHelperText>
            {formik.touched[fieldName] && formik.errors[fieldName]}
          </FormHelperText>
        </FormControl>
      );
    });

    return formParams.map((Formlet, idx) => {
      return (
        <Grid key={idx} item xs={12} sm={12 / columns}>
          <Formlet />
        </Grid>
      );
    });
  };

  const buildFormFactor = (formik) => {
    const FormContainer = () => (
      <Grid spacing={2} container>
        {buildFields(formik)}
        {formik.isSubmitting && <LinearProgress />}
      </Grid>
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
