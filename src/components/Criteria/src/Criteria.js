import React from 'react'
import PropTypes from 'prop-types'

import CriteriaMobile from './CriteriaMobile'
import CriteriaDesktop from './CriteriaDesktop'
import useViewportBreakpoint from './hooks/useViewportBreakpoint'

import { makeStyles } from 'tss-react/mui';
const useStyles = makeStyles()(theme => ({
  root:{
    color: theme.palette.text.primary,
    '& *': {
      boxSizing: 'border-box'
    }
  }
}));

Criteria.propTypes = {
  onChange: PropTypes.func,
  criteria: PropTypes.object,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      updatable: PropTypes.bool,
      deletable: PropTypes.bool,
      type: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  )
}

function Criteria (props) {
  const {
    criteria = {},
    data: dataProp = [],
    onChange: onChangeProp,
    children
  } = props

  const { classes } = useStyles()

  const isMobileViewport = useViewportBreakpoint()

  const data = React.useMemo(() => {
    return dataProp.filter(criterion => {
      return criteria[criterion.type] != null
    })
  }, [dataProp, criteria])

  const onChange = React.useCallback(newData => {
    if (typeof onChangeProp !== 'function') return
    onChangeProp(newData)
  }, [onChangeProp])

  const onNewCriterion = React.useCallback(newCriterion => {
    const newData = [...data]
    newData.push(newCriterion)
    onChange(newData)
  }, [data, onChange])

  const onUpdateCriterion = React.useCallback((index, newValue) => {
    const newData = [...data]
    const { type } = newData[index]
    newData.splice(index, 1, { type, value: newValue })
    onChange(newData)
  }, [data, onChange])

  const onDeleteCriterion = React.useCallback(index => {
    const newData = [...data]
    newData.splice(index, 1)
    onChange(newData)
  }, [data, onChange])

  const criteriaProps = {
    data: data,
    criteria: criteria,
    onNewCriterion: onNewCriterion,
    onUpdateCriterion: onUpdateCriterion,
    onDeleteCriterion: onDeleteCriterion,
    children: children
  }

  return (
    <div className={classes.root}>
      {
        isMobileViewport === true ? (
          <CriteriaMobile {...criteriaProps} />
        ) : (
          <CriteriaDesktop {...criteriaProps} />
        )
      }
    </div>
  )
}

export default React.memo(Criteria)
