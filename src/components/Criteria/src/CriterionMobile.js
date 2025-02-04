import React from 'react'
import PropTypes from 'prop-types'
import Criterion from './Criterion'
import useCriterionSummaryValue from './hooks/useCriterionSummaryValue'

import { makeStyles } from 'tss-react/mui';
const useStyles = makeStyles()(theme => ({
  root: {
    display: 'flex',
    padding: '0 16px',
    alignItems: 'center',
    transitionDuration: '.2s',
    justifyContent: 'space-between',
    transitionProperty: 'background-color',
  
    '&:not(:last-of-type)': {
      borderBottom: `solid 1px ${theme.palette.grey[400]}`
    },
  
    '&:focus, &:hover': {
      // backgroundColor: theme.button.defaultHoverBackgroundColor
    }
  },
  
  rootActive: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
  
    '&:focus, &:hover': {
      backgroundColor: theme.palette.primary.light
    }
  },
  
  chevron: {
    width: '15px',
    height: '15px',
    display: 'block',
    borderRadius: '4px',
    borderTop: `solid 4px ${theme.palette.grey[400]}`,
    borderRight: `solid 4px ${theme.palette.grey[400]}`,
    transform: 'translate(0px, -3px) rotate(135deg)'
  },
  
  chevronOpen: {
    borderColor: theme.palette.primary.contrastText,
    transform: 'translate(0px, 5px) rotate(-45deg)'
  },
  
  label: {
    opacity: '.8',
    fontSize: '.7em',
    paddingTop: '14px',
    textTransform: 'uppercase'
  },
  
  value: {
    padding: '6px 0 16px'
  },
  
  form: {
    padding: '16px',
    borderBottom: `solid 1px ${theme.palette.grey[400]}`
  }
}));


CriterionMobile.propTypes = {
  active: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  updatable: PropTypes.bool,
  deletable: PropTypes.bool,
  onActiveChange: PropTypes.func,
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

function CriterionMobile (props) {
  const {
    value,
    active,
    updatable,
    deletable,
    criterionInfo,
    onDelete: onDeleteProp,
    onChange: onChangeProp,
    onActiveChange: onActiveChangeProp
  } = props

  const { classes } = useStyles()
  const summaryValue = useCriterionSummaryValue(criterionInfo.value, value)

  const onActiveChange = React.useCallback(newActiveState => {
    if (typeof onActiveChangeProp !== 'function') return
    onActiveChangeProp(newActiveState)
  }, [onActiveChangeProp])

  const toggleActiveState = React.useCallback(() => {
    onActiveChange(!active)
  }, [active, onActiveChange])

  const onDelete = React.useCallback(() => {
    if (typeof onDeleteProp === 'function') onDeleteProp()
    onActiveChange(false)
  }, [onDeleteProp, onActiveChange])

  const onChange = React.useCallback(updatedCriterion => {
    if (typeof onChangeProp === 'function') onChangeProp(updatedCriterion)
    onActiveChange(false)
  }, [onChangeProp, onActiveChange])

  const onCancel = React.useCallback(() => {
    onActiveChange(false)
  }, [onActiveChange])

  const onKeyDown = React.useCallback(ev => {
    // Key: ENTER
    if (ev.keyCode === 13) toggleActiveState()
  }, [toggleActiveState])

  const rootElementClassName = React.useMemo(() => {
    const className = [classes.root]
    if (active === true) className.push(classes.rootActive)
    return className.join(' ')
  }, [classes, active])

  const chevronClassName = React.useMemo(() => {
    const className = [classes.chevron]
    if (active === true) className.push(classes.chevronOpen)
    return className.join(' ')
  }, [classes, active])

  return (
    <>
      <div
        tabIndex={0}
        role='button'
        aria-expanded={active}
        className={rootElementClassName}
        onKeyDown={onKeyDown}
        onClick={toggleActiveState}
      >
        <div className={classes.details}>
          <div className={classes.label}>{criterionInfo.label}</div>
          <div className={classes.value}>{summaryValue}</div>
        </div>

        <span className={chevronClassName} />
      </div>

      {
        active === true && (
          <div className={classes.form}>
            <Criterion
              value={value}
              updatable={updatable}
              deletable={deletable}
              criterionInfo={criterionInfo}
              onChange={onChange}
              onDelete={onDelete}
              onCancel={onCancel}
            />
          </div>
        )
      }
    </>
  )
}

export default React.memo(CriterionMobile)
