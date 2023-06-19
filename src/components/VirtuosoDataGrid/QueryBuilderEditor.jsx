import { makeStyles } from 'tss-react/mui';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MaterialValueEditor, MaterialValueSelector, QueryBuilderMaterial, materialControlElements } from '@react-querybuilder/material';
import { QueryBuilder, RuleGroup, formatQuery } from 'react-querybuilder';
import { DragIndicator } from '@mui/icons-material';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Input,
  ListSubheader,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextField,
  TextareaAutosize,
} from '@mui/material';
import "./QueryBuildeEditor.scss"
import { isEmpty } from 'lodash';

const muiComponents = {
  Button,
  Checkbox,
  DragIndicator,
  FormControl,
  FormControlLabel,
  Input,
  ListSubheader,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextareaAutosize,
};

const CustomValueEditor = (props) => {
  if (props.type === 'text') {
    return <OutlinedInput
      {...props}
      onChange={(e) => props.handleOnChange(e.target.value)}
      size="small"
    />;
  }
  return <MaterialValueEditor {...props}
    variant="outlined"
    size="small"
  />;
};
const OutlinedSelectorElement = props => {
  return <MaterialValueSelector {...props} variant="outlined" size="small" />
}

const NullOperatorSelector = props => {
  return <></>
}
const controlElements = {
  ...materialControlElements,
  valueEditor: CustomValueEditor,
  valueSourceSelector: CustomValueEditor,
  fieldSelector: OutlinedSelectorElement,
  combinatorSelector: NullOperatorSelector,
  operatorSelector: OutlinedSelectorElement,
  addGroupAction: NullOperatorSelector,
}

const useStyles = makeStyles()(theme => ({
}));
const QueryBuilderEditor = ({
  columns,
  onCriteriaChange = () => { },
  hasDateRangeFilter = true,
  filters
}) => {
  const { classes } = useStyles()
  const xfields = [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      operators: [
        { name: '=', label: 'contains' },
      ]
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text'
    },
  ];

  const fields = useMemo(
    () => {
      const filterFields = columns?.filter((column) => column.filter && column?.filter?.type !== 'chiptabs')
      const fieldDefs = filterFields?.map((column) => {
        switch (column?.filter?.type) {
          case 'autocomplete':
          case 'option':
            return {
              label: column.name,
              name: column.key,
              id: column.key,
              valueEditorType: column?.filter?.multiple ? 'multiselect' : 'select',
              values: column?.filter?.options?.map((option) => {
                  return {
                    name: option?.[column?.filter?.valueField ?? 'value'],
                    label: option?.[column?.filter?.labelField ?? 'label'],
                  }
                }),
              
              defaultValue: '',
              operators: [
                {
                  name: column?.filter?.multiple ? 'in' : '=',
                  label: column?.filter?.multiple ? 'contains' : 'is'
                },
              ],
            }

          default:
            return {
              label: column.name,
              name: column.key,
              id: column.key,
              operators: [
                { name: '=', label: 'is' },
              ],
            }

        }
      })
      return fieldDefs

    }, [columns]
  );

  const handleFilterChange = useCallback(
    (query) => {
      const jsonQuery = query.rules.map((rule) => {
        const valueSource = rule?.valueSource
        return {
          type: rule.field,
          value: rule?.[valueSource]
        }
      })

      const validateAllFields = query.rules.every((rule) => {
        const valueSource = rule?.valueSource
        return !isEmpty(rule?.[valueSource])
      })
      if (validateAllFields) {
        onCriteriaChange(jsonQuery)
      }


    },
    [onCriteriaChange],
  );
  return (
    <QueryBuilderMaterial
      muiComponents={muiComponents}
      controlElements={controlElements}
    >
      <QueryBuilder
        fields={fields}
        onQueryChange={q => handleFilterChange(q)}
      />
    </QueryBuilderMaterial>
  )
}

export { QueryBuilderEditor }