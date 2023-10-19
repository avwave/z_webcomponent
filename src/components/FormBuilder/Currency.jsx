import CurrencyTextField from '@lupus-ai/mui-currency-textfield/dist/CurrencyTextField';
import React, { memo } from 'react';

const Currency = memo(function Currency({
  fieldName,
  formValue,
  onChangeOverride,
  fieldParams,
  formReadOnly,
  formInline,
  isRequired,
  hasError,
  variant
}) {

  const currencySymbol = new Intl.NumberFormat(fieldParams?.locale ?? 'en-PH', {
    style: 'currency',
    currency: fieldParams?.currency ?? 'PHP',
  }).formatToParts(1)
    .find(part => part.type === 'currency').value


  return (
    <CurrencyTextField
      currencySymbol={currencySymbol}
      outputFormat={fieldParams?.formatted ? 'string' : 'number'}
      name={fieldName}
      label={formInline ? "" : `${fieldParams.label} ${isRequired ? '*' : ''}`}
      value={formValue}
      onChange={(evt, value) => {
        onChangeOverride(evt)
      }}
      disabled={fieldParams.readOnly || formReadOnly}
      error={hasError}
      InputLabelProps={{
        shrink: true,
      }}
      variant={variant}
      selectOnFocus
      {...fieldParams?.fieldProps}
    />
  )
})

export { Currency };
