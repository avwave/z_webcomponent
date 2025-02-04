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
import { APIAutoComplete } from './Criteria/Fields/APIAutoComplete';

const useStyles = makeStyles()(theme => ({
}));
const CriteriaEditor = ({
  columns,
  onCriteriaChange = () => { },
  hasDateRangeFilter = true,
  filters
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

  // useEffect(
  //   () => {
  //     onCriteriaChange(data)
  //   }, [data]
  // );

  const mapFilterToCriteria = useCallback(
    (col) => {
      const baseProps = {
        label: col.name,
      }
      let criteriaOptions = {}
      switch (col?.filter?.type) {
        case 'apiAutocomplete':
          criteriaOptions = {
            value: (value) => {
              if (Array.isArray(value)) {
                return value?.map(opt => opt?.[col?.filter?.labelField])?.join(',')
              }
              return value?.[col?.filter?.labelField]
            },
            component: {
              component: APIAutoComplete,
              props: {
                apiCallback: col?.filter?.apiCallback,
                apiOptions: col?.filter?.apiOptions,
                multiple: col?.filter?.multiple,
                labelField: col?.filter?.labelField,
                valueField: col?.filter?.valueField,
                renderLabel: col?.filter?.renderLabel,
              }
            }
          }
          break;
        case 'option':
          criteriaOptions = {
            value: (value) => {
              console.log('CriteriaEditor.jsx (55) # value', value);
              if (Array.isArray(value)) {
                return value?.join(", ")
              }
              return value
            },
            component: {
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
                return col?.filter?.options?.filter(opt => {
                  return value.includes(opt?.[col?.filter?.valueField])
                })?.map(opt => opt?.[col?.filter?.labelField])
                  ?.join(',')
              }
              return col?.filter?.options?.find(opt => opt?.[col?.filter?.valueField] === value)?.[col?.filter?.labelField]
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
      const colsWithFilters = columns?.filter(col => col.filter && col?.filter?.type !== 'chiptabs')
        ?.map(col => {
          const criteria = mapFilterToCriteria(col)
          return [col.key, criteria]
        })
      const defaultDataRangeCriteria = mapFilterToCriteria({
        filter: {
          type: 'dateRange'
        },
        name: 'Date Range',

      })
      if (hasDateRangeFilter) {
        return Object.fromEntries([['ZWC_defaultdaterange', defaultDataRangeCriteria], ...colsWithFilters])
      } else {
        return Object.fromEntries(colsWithFilters)
      }
    }, [columns, hasDateRangeFilter, mapFilterToCriteria]
  );
  const [initialData, setInitialData] = useState([]);

  useEffect(
    () => {
      const { endDate, startDate, ...baseFilters } = { ...filters }
      const filterEntries = Object.entries(baseFilters)
      const filterObjects = filterEntries?.map(([key, value]) => {
        return {
          type: key,
          value
        }
      })
      const dateRangeFilter = (startDate && endDate) ? ([{
        type: 'ZWC_defaultdaterange',
        value: {
          startDate,
          endDate
        }
      }]) : []

      const mappedFilters = [
        ...filterObjects,
        ...dateRangeFilter
      ]
      setData(mappedFilters)

    }, [filters]
  );
  return (
    <I18nContext.Provider value={i18n}>
      <ReactCriteria
        data={data || initialData}
        onChange={v => {
          onCriteriaChange(v)
          setData(v)
        }}
        criteria={filterColumns}
      >
        <Button
          size="small"
          variant="contained"
          color="secondary"
          disabled={isEmpty(data)}
          onClick={() => {
            onCriteriaChange([])
            setData([])
          }}
        >Clear</Button>
      </ReactCriteria>
    </I18nContext.Provider>
  )

}

export { CriteriaEditor };
