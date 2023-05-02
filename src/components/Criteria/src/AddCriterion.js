import React from 'react'
import PropTypes from 'prop-types'

import useI18nLabel from './hooks/useI18nLabel'
import useCriterionComponent from './hooks/useCriterionComponent'
import { Box, Button, Divider, FormControl, InputLabel, MenuItem, Select } from '@mui/material'

AddCriterion.propTypes = {
  onSubmit: PropTypes.func,
  criteria: PropTypes.object
}

function AddCriterion(props) {
  const {
    criteria = {},
    onSubmit: onSubmitProp
  } = props

  const [value, setValue] = React.useState('')
  const [selectedCriterionName, setSelectedCriterionName] = React.useState('')
  const selectedCriterion = criteria[selectedCriterionName]

  const i18nType = useI18nLabel('add-criterion.type')
  const i18nSubmit = useI18nLabel('add-criterion.submit')
  const i18nTypePlaceholder = useI18nLabel('add-criterion.type-placeholder')

  const onSubmit = React.useCallback(() => {
    if (typeof onSubmitProp !== 'function') return

    onSubmitProp({
      value: value,
      type: selectedCriterionName
    })
  }, [onSubmitProp, value, selectedCriterionName])

  const criteriaOptions = React.useMemo(() => {
    return [
      {
        value: '',
        label: i18nTypePlaceholder
      },
      ...Object.keys(criteria).reduce((options, key) => {
        const criterionInfo = criteria[key]

        if (criterionInfo.addable === false) return options

        options.push({
          value: key,
          label: criterionInfo.label
        })

        return options
      }, [])
    ]
  }, [criteria, i18nTypePlaceholder])

  const selectedCriterionDOM = useCriterionComponent({
    value,
    onChange: setValue,
    criterionInfo: selectedCriterion
  })

  const isFormSubmittable = React.useMemo(() => {
    if (selectedCriterion == null) return false

    if (typeof selectedCriterion.validate !== 'function') return true
    return selectedCriterion.validate(value) === true
  }, [value, selectedCriterion])

  return (
    <>
      <FormControl fullWidth sx={{
        pb: 2
      }}>
        <InputLabel>{i18nType}</InputLabel>
        <Select
          value={selectedCriterionName}
          label={i18nType}
          onChange={(evt) => {
            setSelectedCriterionName(evt.target.value)
          }}
        >
          {criteriaOptions.map(option => (
            <MenuItem component="div" key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedCriterionDOM}

      <Box sx={{ p: 2 }} />
      <Button
        size="small"
        variant="contained"
        color='primary'
        disabled={!isFormSubmittable}
        onClick={onSubmit}
      >
        {i18nSubmit}
      </Button>
    </>
  )
}

export default React.memo(AddCriterion)
