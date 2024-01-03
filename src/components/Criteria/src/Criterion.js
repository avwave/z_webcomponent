import React from 'react'
import PropTypes from 'prop-types'
import useI18nLabel from './hooks/useI18nLabel'
import useCriterionComponent from './hooks/useCriterionComponent'

import { makeStyles } from 'tss-react/mui';
import { Button, Divider } from '@mui/material'
import { Box } from "@mui/material";
const useStyles = makeStyles()(theme => ({
  actions: {
    display: 'flex'
  }
}));

Criterion.propTypes = {
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  onCancel: PropTypes.func,
  updatable: PropTypes.bool,
  deletable: PropTypes.bool,
  value: PropTypes.string.isRequired,
  criterionInfo: PropTypes.shape({
    value: PropTypes.func,
    label: PropTypes.string,
    validate: PropTypes.func,
    component: PropTypes.shape({
      props: PropTypes.object,
      component: PropTypes.elementType
    }).isRequired
  })
}

function Criterion(props) {
  const {
    criterionInfo,
    value: valueProp,
    updatable = true,
    deletable = true,
    onChange: onChangeProp,
    onDelete: onDeleteProp,
    onCancel: onCancelProp
  } = props

  const { classes } = useStyles()

  const [value, setValue] = React.useState(valueProp)

  const i18nSubmit = useI18nLabel('criterion.submit')
  const i18nCancel = useI18nLabel('criterion.cancel')
  const i18nRemove = useI18nLabel('criterion.remove')

  const onCancel = React.useCallback(() => {
    if (typeof onCancelProp !== 'function') return
    onCancelProp()
  }, [onCancelProp])

  const onDelete = React.useCallback(() => {
    if (typeof onDeleteProp !== 'function') return
    onDeleteProp()
  }, [onDeleteProp])

  const onChange = React.useCallback(() => {
    if (typeof onChangeProp !== 'function') return
    onChangeProp(value)
  }, [onChangeProp, value])

  const onValueChange = React.useCallback(newValue => {
    if (updatable === false) return
    setValue(newValue)
  }, [updatable])

  const selectedCriterionDOM = useCriterionComponent({
    value,
    criterionInfo,
    disabled: !updatable,
    onChange: onValueChange
  })

  const isFormSubmittable = React.useMemo(() => {
    if (value === valueProp) return false

    if (typeof criterionInfo.validate !== 'function') return true
    return criterionInfo.validate(value) === true
  }, [value, valueProp, criterionInfo])

  return (
    <Box sx={{
      maxHeight: '50vh',
      overflowY: 'auto',
    }}>
      {selectedCriterionDOM}

      <Divider />

      <div className={classes.actions}>
        {
          updatable !== false && (
            <Button
              size="small"
              variant='contained'
              color='primary'
              onClick={onChange}
              disabled={isFormSubmittable === false}
            >
              {i18nSubmit}
            </Button>
          )
        }

        <Button onClick={onCancel}>
          {i18nCancel}
        </Button>

        {
          deletable !== false && (
            <Button
              size="small"
              variant='contained'
              onClick={onDelete}>
              {i18nRemove}
            </Button>
          )
        }
      </div>
    </Box>
  )
}

export default React.memo(Criterion)
