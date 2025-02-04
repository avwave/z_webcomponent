import React from 'react'
import PropTypes from 'prop-types'

import CriterionDesktop from './CriterionDesktop'
import AddCriterionDesktop from './AddCriterionDesktop'

import { makeStyles } from 'tss-react/mui';
const useStyles = makeStyles()(theme => ({
  root: {
    display: 'flex',
    backgroundColor: theme.palette.background.paper,
  },
  add:{
    display: 'flex',
    flexDirection: 'row',
    flexGrow:0,
    flexShrink:0,
    paddingRight: 10,
    minWidth: '100px',
  },
  criterias: {
    display: 'flex',
    
    paddingBottom: '8px',
    
  
    '&::-webkit-scrollbar': {
      height: '7px',
      backgroundColor: 'transparent'
    },
  
    '&::-webkit-scrollbar-corner': {
      display: 'none'
    },
  
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent'
    },
  
    '&::-webkit-scrollbar-thumb': {
      borderRadius: '2px',
      backgroundColor: 'rgba(0, 0, 0, .2)'
    }
  }
}));

CriteriaDesktop.propTypes = {
  criteria: PropTypes.object,
  onNewCriterion: PropTypes.func,
  onUpdateCriterion: PropTypes.func,
  onDeleteCriterion: PropTypes.func,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      updatable: PropTypes.bool,
      deletable: PropTypes.bool,
      type: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  )
}

function CriteriaDesktop (props) {
  const {
    data,
    criteria,
    onNewCriterion: onNewCriterionProp,
    onUpdateCriterion: onUpdateCriterionProp,
    onDeleteCriterion: onDeleteCriterionProp,
    children
  } = props

  const { classes } = useStyles()
  const [activeItem, setActiveItem] = React.useState(null)

  React.useEffect(() => {
    const listener = ev => {
      // Key: ESC
      if (ev.keyCode === 27) setActiveItem(null)
    }

    window.addEventListener('keydown', listener)

    return () => window.removeEventListener('keydown', listener)
  }, [])

  const onNewCriterion = React.useCallback(newCriterion => {
    if (typeof onNewCriterionProp !== 'function') return
    onNewCriterionProp(newCriterion)
  }, [onNewCriterionProp])

  const onUpdateCriterion = React.useCallback((index, newValue) => {
    if (typeof onUpdateCriterionProp !== 'function') return
    onUpdateCriterionProp(index, newValue)
  }, [onUpdateCriterionProp])

  const onDeleteCriterion = React.useCallback(index => {
    if (typeof onDeleteCriterionProp !== 'function') return
    onDeleteCriterionProp(index)
  }, [onDeleteCriterionProp])

  const onActiveItemChange = React.useCallback((itemID, state) => {
    setActiveItem(state === false ? null : itemID)
  }, [])

  const criterionDOM = React.useMemo(() => {
    return data.map((criterion, index) => {
      const criterionInfo = criteria[criterion.type]

      const id = `criterion-${index}`
      const active = activeItem === id
      const disabled = activeItem != null && active === false

      return (
        <CriterionDesktop
          key={index}
          active={active}
          disabled={disabled}
          value={criterion.value}
          criterionInfo={criterionInfo}
          updatable={criterion.updatable}
          deletable={criterion.deletable}
          onDelete={() => onDeleteCriterion(index)}
          onActiveChange={state => onActiveItemChange(id, state)}
          onChange={
            updatedCriterion => onUpdateCriterion(index, updatedCriterion)
          }
        />
      )
    })
  }, [
    data,
    criteria,
    activeItem,
    onUpdateCriterion,
    onDeleteCriterion,
    onActiveItemChange
  ])

  const addCriterionDOM = React.useMemo(() => {
    const id = 'action-add'
    const active = activeItem === id
    const disabled = activeItem != null && active === false

    const unselectedCriteria = Object.fromEntries(Object.entries(criteria).filter(([cKey, criterion]) => {
      const ob = data.find(c=> c.type === cKey)
      return !ob
    }))

    return (
      <AddCriterionDesktop
        active={active}
        disabled={disabled}
        criteria={unselectedCriteria}
        onAdd={onNewCriterion}
        onActiveChange={state => onActiveItemChange(id, state)}
      >{children}
      </AddCriterionDesktop>
    )
  }, [data, activeItem, criteria, onActiveItemChange, onNewCriterion, children])

  return (
    <div className={classes.root}>
      <div className={classes.add}>
        {addCriterionDOM}
      </div>
      {
        criterionDOM.length > 0 && (
          <div className={classes.criterias}>
            {criterionDOM}
          </div>
        )
      }
      
    </div>
  )
}

export default React.memo(CriteriaDesktop)
