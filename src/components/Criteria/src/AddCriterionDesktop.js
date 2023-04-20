import React, { useState } from 'react'
import PropTypes from 'prop-types'
import AddCriterion from './AddCriterion'
import useI18nLabel from './hooks/useI18nLabel'
import useCriterionAddableChecker from './hooks/useCriterionAddableChecker'
import { Button, Card, CardContent, CardHeader, Container, Popover, Typography, useTheme } from '@mui/material'

AddCriterionDesktop.propTypes = {
  onAdd: PropTypes.func,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  criteria: PropTypes.object,
  onActiveChange: PropTypes.func
}

function AddCriterionDesktop(props) {
  const {
    criteria = {},
    active = false,
    disabled = false,
    onAdd: onAddProp,
    onActiveChange: onActiveChangeProp,
    children
  } = props

  const rootElementRef = React.useRef(null)
  const isCriterionAddable = useCriterionAddableChecker(criteria)

  const i18nAdd = useI18nLabel('criteria.add-criterion-add')
  const i18nAddPopoverTitle = useI18nLabel('criteria.add-criterion-title')
  const i18nAddPopoverDesc = useI18nLabel('criteria.add-criterion-description')

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };


  const onActiveChange = React.useCallback(newState => {
    if (typeof onActiveChangeProp !== 'function') return
    onActiveChangeProp(newState)
  }, [onActiveChangeProp])


  const onAdd = React.useCallback(newCriterion => {
    if (typeof onAddProp === 'function') onAddProp(newCriterion)
    onActiveChange(false)
    handleClose()
  }, [onAddProp, onActiveChange])

  function getOffset() {
    if (rootElementRef.current == null) return null

    const info = rootElementRef.current.getBoundingClientRect()

    return {
      x: info.right,
      y: info.top + 60
    }
  }


  const theme = useTheme()
  return (
    isCriterionAddable === true && (
      <div ref={rootElementRef}>
        <Button
          size="small"
          variant="contained"
          color="primary"
          disabled={disabled}
          aria-expanded={active}
          onClick={handleClick}
        >
          {i18nAdd}
        </Button>
        {children}

        <Popover
          // disablePortal
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          PaperProps={{
            sx: {
              width: theme.breakpoints.values.sm,
              
            }
          }}
        >
          <Card>
            <CardHeader
              subheader={i18nAddPopoverDesc}
            />
            <CardContent>
              <AddCriterion
                criteria={criteria}
                onSubmit={onAdd}
              />

            </CardContent>
          </Card>
        </Popover>
      </div>
    )
  )
}

export default React.memo(AddCriterionDesktop)
