import { Box, Button, Card, CardContent, IconButton, makeStyles, MobileStepper, Typography, useTheme } from '@material-ui/core';
import { Close, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { FieldArray } from 'formik';
import { get } from "lodash";
import { useCallback, useMemo, useState } from 'react';
import ReactJson from 'react-json-view';
import {isEmpty} from 'lodash'
import { Stepper } from '../Stepper';
const useStyles = makeStyles((theme) => {
  return {}
})
const WizardFieldArray = ({
  fieldName,
  fieldParams,
  formInline,
  isRequired,
  formReadOnly,
  stepVariant="dots",
  buildComponent = () => { },
  stepperProps,
  wizardProps
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const handleForward = useCallback(
    () => {
      setCurrentStep(currentStep + 1)
    },
    [currentStep],
  );
  const handleBack = useCallback(
    () => {
      setCurrentStep(currentStep - 1)
    },
    [currentStep],
  );
  const renderBuildComponent = useCallback(
    (layout, template, length, fid, guid) => {
      const fieldArrayComponent = buildComponent(layout, template, length, fid, guid)
      return fieldArrayComponent?.props?.children?.map((fc, idx) => {
        return idx === currentStep ? <div key={idx}>{fc}</div> : <></>
      })
    },
    [buildComponent, currentStep],
  );
  
  return (
    <FieldArray
      name={fieldName}
      validateOnChange
      render={(arrayHelpers) => {
        if (Array.isArray(get(arrayHelpers.form.values, fieldName))) {
          const stepCount = Object.keys(get(arrayHelpers.form.values, fieldName)?.[0]).length
          setTotalSteps(stepCount)
          const steps = Object.keys(get(arrayHelpers.form.values, fieldName)?.[0])
          const currentStepInvalid = () => {
            const fields = get(arrayHelpers.form.values, fieldName)?.[0]
            const errors = get(arrayHelpers.form.errors, fieldName)?.[0]
            if (isEmpty(get(fields, steps[currentStep]))) {
              return true
            }
            if (!isEmpty(get(errors, steps[currentStep]))) {
              return true
            }
            return currentStep === totalSteps - 1
          }
          return (
            <>
              {/* <ReactJson src={{
                fieldParams,
                fieldName,
                stepCount,
                steps,
                arh: arrayHelpers.form
              }}
                collapsed={1}
              /> */}
              {get(arrayHelpers.form.values, fieldName).map(
                (subform, idx) => {
                  return (
                    <Box
                      component={fieldParams.settings?.formInset ? Card : 'div'} key={`${fieldName}-${idx}`}
                      className={fieldParams.inline && classes.subformInline}>
                      {!fieldParams.inline &&
                        <Box className={classes.subformHeader}>
                          <Typography variant="body2" className={classes.subformHeaderTitle}>
                            {formInline ? "" : `${fieldParams.label} ${isRequired ? '*' : ''}`}
                          </Typography>
                        </Box>
                      }
                      <Box component={fieldParams.inline ? 'div' : CardContent} className={classes.subformContent}>
                        {renderBuildComponent(
                          fieldParams.formLayout,
                          fieldParams.formTemplate,
                          fieldParams.formLayout.length,
                          `${fieldName}-${idx}`,
                          `${fieldName}[${idx}]`
                        )}
                      </Box>
                    </Box>
                  );
                }
              )}
              <Stepper
                stepperProps={stepperProps}
                variant={stepVariant}
                steps={stepCount}
                position="static"
                activeStep={currentStep}
                nextButton={
                  <Button
                    size="small"
                    onClick={() => handleForward()}
                    disabled={currentStepInvalid(arrayHelpers.form)}>
                    Next
                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                  </Button>
                }
                backButton={
                  <Button size="small" onClick={() => handleBack()} disabled={currentStep === 0}>
                    {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                    Back
                  </Button>
                }
              />
            </>
          );
        }
        return <></>;

      }} />
  )
}

export { WizardFieldArray };
