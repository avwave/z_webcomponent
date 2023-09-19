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
import { ControlElements, QueryBuilderEditorField } from './QueryBuilderEditorFields';

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

const useStyles = makeStyles()(theme => ({
}));
const QueryBuilderEditor = ({
  columns,
  onCriteriaChange = () => { },
  hasDateRangeFilter = true,
  filters
}) => {
  const { classes } = useStyles()

  const fields = useMemo(
    () => {
      const filterFields = columns?.filter((column) => column.filter && column?.filter?.type !== 'chiptabs')
      const fieldDefs = filterFields?.map((column) => {
        switch (column?.filter?.type) {
          case 'autocomplete':
          case 'option':
            return {
              renderLabel: column?.filter?.renderLabel,
              multiple: column?.filter?.multiple,
              valueField: column?.filter?.valueField ?? 'value',
              labelField: column?.filter?.labelField ?? 'label',
              label: column.name,
              name: column.key,
              id: column.key,
              inputType: 'select',
              valueEditorType: column?.filter?.multiple ? 'multiselect' : 'select',
              values: column?.filter?.options,
              defaultValue: '',
              operators: [
                {
                  name: column?.filter?.multiple ? 'in' : '=',
                  label: column?.filter?.multiple ? 'contains' : 'is'
                },
              ],
            }
          case 'dateRange':
            return {
              label: column.name,
              name: column.key,
              id: column.key,
              inputType: 'daterange',
              operators: [
                { name: 'between', label: 'between' },
              ],
            }
          default:
            return {
              label: column.name,
              name: column.key,
              id: column.key,
              inputType: 'text',
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
      controlElements={ControlElements}
    >
      <QueryBuilder
        fields={fields}
        onQueryChange={q => handleFilterChange(q)}
      />
    </QueryBuilderMaterial>
  )
}

export { QueryBuilderEditor }