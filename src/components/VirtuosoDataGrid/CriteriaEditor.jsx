import { Button, Chip, useTheme } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactCriteria, {
  I18nContext,
  createTheme as createCriteriaTheme
} from '../Criteria/src';
import { makeStyles } from 'tss-react/mui';
import { CriteriaAutocomplete } from './Criteria/Fields/Autocomplete';
import { CriteriaSelect } from './Criteria/Fields/Select';
import { CriteriaTextField } from './Criteria/Fields/TextField';
import { CriteriaDateRange } from './Criteria/Fields/DateRange';
import moment from 'moment';
import ReactJson from 'react-json-view';
import isEmpty from 'lodash.isempty';

const useStyles = makeStyles()(theme => ({
}));
const CriteriaEditor = ({
  columns,
  onCriteriaChange = () => { },
}) => {
  const { classes } = useStyles()
  const [data, setData] = useState([]);

  const i18n = {
    'criteria.manage-criteria': amount => `Manage Filter (${amount})`,
    'criteria.add-criterion-add': 'Add Filter',
    'criteria.add-criterion-title': 'Create a new filter',
    'criteria.add-criterion-description': 'Create a new filter',
    'criteria.criterion-title': label => `Manage '${label}' filters`,
    'criteria.criterion-description': label => `Manage '${label}' filter`,
    'criteria.modal-close': 'Close',
    'criteria.modal-title': 'Manage filter',
    'criteria.modal-description': 'View and manage your filters',

    'add-criterion.submit': 'Add Filter',
    'add-criterion.type': 'Filter Type',
    'add-criterion.type-placeholder': 'Select filter type',

    'criterion.submit': 'Update',
    'criterion.cancel': 'Cancel',
    'criterion.remove': 'Remove',

    'popover.overlay-title': 'Close Filters'
  }

  const criteria = useMemo(() => {
    const gender = ["Male", "Female", "Other"];
    return {
      text: {
        label: "text",
        component: {
          component: CriteriaTextField,
          props: {
            placeholder: "Enter text",
          }
        }
      },
      autocomplete: {
        label: "autocomplete",
        value: (value) => {
          if (Array.isArray(value)) {
            return value?.join(", ")
          }
          return value
        },
        component: {
          component: CriteriaAutocomplete,
          props: {
            multiple: true,
            labelField: "label",
            valueField: "value",
            options: [
              {
                renderLabel: <Chip label="All" />,
                value: '',
                label: 'All'
              },

              {
                renderLabel: <Chip label="Pending Result" />,
                value: 'PENDING',
                label: 'Pending Result'
              },
              {
                renderLabel: <Chip label="With Missing Specimens" />,
                value: 'MISSING_SPECIMENS',
                label: 'With Missing Specimens'
              },
              {
                renderLabel: <Chip label="Incomplete" />,
                value: 'INCOMPLETE',
                label: 'Incomplete'
              },
              {
                renderLabel: <Chip label="None Encoded (Incomplete)" />,
                value: 'INCOMPLETE_NONE_ENCODED',
                label: 'None Encoded (Incomplete)"'
              },
              {
                renderLabel: <Chip label="Partially Encoded (Incomplete)" />,
                value: 'INCOMPLETE_PARTIALLY_ENCODED',
                label: 'Partially Encoded (Incomplete)"'
              },
              {
                renderLabel: <Chip label="Complete Result" />,
                value: 'COMPLETED',
                label: 'Complete Result'
              },
            ]
          }
        }
      },
      option: {
        label: "option",
        value: (value) => gender[value],
        component: {
          component: CriteriaSelect,
          props: {
            options: gender.map((name, index) => {
              return {
                value: index,
                label: name
              };
            })
          }
        }
      },
      date: {
        label: "date",
        value: (value) => {
          const ret = `${moment(value?.startDate).format("MM/DD/YYYY LT")} - ${moment(value?.endDate).format("MM/DD/YYYY LT")}`
          return ret
        },
        component: {
          component: CriteriaDateRange,
          props: {
            placeholder: "Enter date",
          }
        }
      },
    };
  }, [])

  const mapFilterToCriteria = useCallback(
    (col) => {
      const baseProps = {
        label: col.name,
      }
      let criteriaOptions = {}
      switch (col?.filter?.type) {
        case 'option': 
          criteriaOptions = {
            value: (value) => {
              if (Array.isArray(value)) {
                return value?.join(", ")
              }
              return value
            },
            component:{
              component: CriteriaSelect,
              props: {
                options: col?.filter?.options,
                multiple: col?.filter?.multiple,
                labelField: col?.filter?.labelField,
                valueField: col?.filter?.valueField,
                renderLabel: col?.filter?.renderLabel,
              }
            } 
          }
          break;
        case 'autocomplete': 
          criteriaOptions = {
            value: (value) => {
              if (Array.isArray(value)) {
                return value?.join(", ")
              }
              return value
            },
            component: {
              component: CriteriaAutocomplete,
              props: {
                options: col?.filter?.options,
                multiple: col?.filter?.multiple,
                labelField: col?.filter?.labelField,
                valueField: col?.filter?.valueField,
                renderLabel: col?.filter?.renderLabel,
              }
            }
          }
          break;
        case 'dateRange': 
          criteriaOptions = {
            value: (value) => {
              const ret = `${moment(value?.startDate).format("MM/DD/YYYY LT")} - ${moment(value?.endDate).format("MM/DD/YYYY LT")}`
              return ret
            },
            component: {
              component: CriteriaDateRange,
              props: {
              }
            }
          }
          break;
        case 'text': 
        default:
          criteriaOptions = {
            component: {
              component: CriteriaTextField,
              props: {
                placeholder: "Enter text",
              }
            }
          }
          break;
      }
      const props = {
        ...baseProps,
        ...criteriaOptions
      }
      return props
    },
    [],
  );
  const filterColumns = useMemo(
    () => {
      const colsWithFilters = columns?.filter(col => col.filter)
        ?.map(col => {
          const criteria = mapFilterToCriteria(col)
          return [col.key, criteria]
        })

      return Object.fromEntries(colsWithFilters)
    }, [columns, mapFilterToCriteria]
  );

  useEffect(
    () => {
      onCriteriaChange(data)
    }, [data]
  );

  return (
    <I18nContext.Provider value={i18n}>
      <ReactCriteria
        data={data}
        onChange={setData}
        criteria={filterColumns}
      >
        <Button
          size="small"
          variant="contained"
          color="secondary"
          disabled={isEmpty(data)}
          onClick={() => {
            setData([])
          }}
        >Clear</Button>
      </ReactCriteria>
    </I18nContext.Provider>
  )

}

export { CriteriaEditor };
