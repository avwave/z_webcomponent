import { Field, Form, Formik, useFormik } from "formik";
import React, { useMemo } from "react";
import * as Yup from "yup";

import {
  Button,
  Grid,
  LinearProgress,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormHelperText,
  Card,
  CardActions,
  CardContent,
  Toolbar,
  Typography,
  Avatar,
  CardHeader,
  IconButton,
  Container,
  ButtonGroup,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { isEmpty } from "lodash";
import {
  DatePicker,
  KeyboardDatePicker,
  KeyboardDateTimePicker,
} from "formik-material-ui-pickers";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/luxon";
import { Backspace, MoreVert as MoreVertIcon } from "@material-ui/icons";

const FormBuilder = ({
  form,
  formFactor,
  formLabel,
  submitLabel,
  resetLabel,
  columns,
  onSubmit = () => {},
}) => {
  const validationSchema = useMemo(() => {
    const validatorMap = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v.validator])
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
              autoOk
              variant="inline"
              format="MM/dd/yyyy hh:mm a"
              mask="__/__/____ __:__ _M"
            />
          );
          break;
        case "select":
          Component = () => (
            <>
              <InputLabel>{fieldParams.label}</InputLabel>
              <Select
                name={fieldName}
                label={fieldParams.label}
                value={formik.values[fieldName]}
                onChange={formik.handleChange}
                multiple={fieldParams.settings.multiple}
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
            </>
          );
          break;
        case "autocomplete":
          Component = () => (
            <Autocomplete
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
      let variant = ''
      switch (formFactor) {
        case 'card':
          variant='text'
          break;
        case 'toolbar':
          variant='inherit'
          break;
        default:
          variant='contained'
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
