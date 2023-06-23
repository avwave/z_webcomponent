import { makeStyles } from 'tss-react/mui';
import React, { useEffect, useMemo, useState } from 'react';
import { Autocomplete, Card, CardContent, Checkbox, OutlinedInput, TextField } from '@mui/material';
import { MaterialValueEditor, MaterialValueSelector, materialControlElements } from '@react-querybuilder/material';
import { DateTimeRangePicker } from '../DateTimeRangePicker';
import { RuleGroup, RuleGroupBodyComponents, RuleGroupHeaderComponents } from 'react-querybuilder';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';

const useStyles = makeStyles()(theme => ({
}));


const OutlinedSelectorElement = props => {
  return <MaterialValueSelector {...props} autoFocus={false} variant="outlined" size="small" />
}

const NullOperatorSelector = props => {
  return <></>
}

const QueryBuilderEditorField = ({ inputType, title, handleOnChange, value, operator, fieldData, ...props }) => {

  const { classes } = useStyles()
  if (fieldData?.inputType === 'text') {
    return <OutlinedInput
      {...props}
      autoFocus
      onChange={(e) => handleOnChange(e.target.value)}
      size="small"
    />;
  }
  if (fieldData?.inputType === 'daterange') {
    return <DateTimeRangePicker
      inline={true}
      variant="outlined"
      size="small"
      onChange={(e) => handleOnChange(e)}
    />
  }
  if (fieldData?.inputType === 'select') {
    return <Autocomplete
      {...props}
      autoFocus
      onChange={(e, value) => {
        const mappedValue = fieldData?.multiple ? value?.map((item) => item?.[fieldData?.valueField]) : value?.[fieldData?.valueField]
        handleOnChange(mappedValue)
      }}
      size="small"
      multiple={fieldData?.multiple}
      options={fieldData?.values}
      getOptionLabel={(option) => option?.[fieldData?.labelField]}
      renderInput={(params) => <TextField {...params} variant="outlined" sx={{minWidth: 250}}/>}
      renderOption={(props, option, { selected }) => {
        const renderedLabel = option?.[fieldData?.renderLabel] || option?.[fieldData?.labelField]
        return (
          <li {...props}>
            {fieldData?.multiple && (
            <Checkbox
              icon={<CheckBoxOutlineBlank />}
              checkedIcon={<CheckBox />}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            )}
            {renderedLabel}
          </li>
        )
      }}
    />
  }

  return <MaterialValueEditor
    inputType={inputType}
    title={title}
    handleOnChange={handleOnChange}
    value={value}
    operator={operator}
    fieldData={fieldData}
    {...props}
    autoFocus
    variant="outlined"
    size="small"
  />;

}

const CardedRuleGroup = props => {
  return (
    <>
      <RuleGroupHeaderComponents {...props} />

      <Card>
        <CardContent>
          <RuleGroupBodyComponents {...props} />
        </CardContent>
      </Card>
    </>
  )
}
const ControlElements = {
  ...materialControlElements,
  valueEditor: QueryBuilderEditorField,
  valueSourceSelector: QueryBuilderEditorField,
  fieldSelector: OutlinedSelectorElement,
  combinatorSelector: NullOperatorSelector,
  operatorSelector: OutlinedSelectorElement,
  addGroupAction: NullOperatorSelector,
  // ruleGroup: CardedRuleGroup
}

export { ControlElements }
