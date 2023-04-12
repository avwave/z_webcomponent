import { Chip, useTheme } from '@mui/material';
import React, { useMemo, useState } from 'react';
import ReactCriteria, {
  I18nContext,
  ThemeProvider,
  createTheme as createCriteriaTheme
} from 'react-criteria';
import { makeStyles } from 'tss-react/mui';
import { CriteriaAutocomplete } from './Criteria/Fields/Autocomplete';
import { CriteriaSelect } from './Criteria/Fields/Select';
import { CriteriaTextField } from './Criteria/Fields/TextField';


const useStyles = makeStyles()(theme => ({
}));
const CriteriaEditor = ({
  onCriteriaChange = () => { },
}) => {
  const { classes } = useStyles()
  const [data, setData] = useState([]);

  const muiTheme = useTheme()
  const theme = createCriteriaTheme({
    palette: {
      primary: {
        primary: muiTheme.palette.primary.main,
        secondary: muiTheme.palette.secondary.main,
      },
    },
    button: {
      defaultColor: muiTheme.palette.primary.contrastText,
      primaryColor: muiTheme.palette.primary.contrastText,
      secondaryColor: muiTheme.palette.secondary.contrastText,
      defaultBackgroundColor: muiTheme.palette.primary.main,
    }
  })

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
      name: {
        label: "Name",
        component: {
          component: CriteriaTextField,
          props: {
            placeholder: "Enter name",
          }
        }
      },
      surname: {
        label: "Autocomplete",
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

            type: "autocomplete",
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
      gender: {
        label: "Gender",
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
      }
    };
  }, [])

  return (
    <I18nContext.Provider value={i18n}>
      <ThemeProvider theme={theme}>
        <ReactCriteria
          data={data}
          onChange={setData}
          criteria={criteria}
        />
      </ThemeProvider>
    </I18nContext.Provider>
  )

}

export { CriteriaEditor };
