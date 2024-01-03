import React, { useState } from 'react'
import PropTypes from 'prop-types'
import AddCriterion from './AddCriterion'
import useI18nLabel from './hooks/useI18nLabel'
import useCriterionAddableChecker from './hooks/useCriterionAddableChecker'
import { Button, Card, CardContent, CardHeader, Container, Popover, Popper, Typography, useTheme } from '@mui/material'
import { Box } from "@mui/material";
import { ClickAwayListener } from "@mui/material";
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

  const id = open ? 'ZWCfilter-popper' : undefined;

  const handleClose = (evt) => {
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
          aria-describedby={id}
        >
          {i18nAdd}
        </Button>
        {children}

        <Popper
          id={id}
          // disablePortal
          open={open}
          placement='auto-start'
          anchorEl={anchorEl}
          onClose={handleClose}
          modifiers={[
            {
              name: 'flip',
              enabled: true,
              options: {
                fallbackPlacements: ['top-start', 'bottom-start'],
                altBoundary: true,
                allowedAutoPlacements: ['top-start', 'bottom-start'],
              },
              flipVariations: true,

            }
          ]}
          sx={{
            zIndex: theme.zIndex.modal,
            width: theme.breakpoints.values.sm,

          }}
        >
          <ClickAwayListener
            mouseEvent="onMouseUp"
            onClickAway={handleClose}>
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
          </ClickAwayListener>

        </Popper>
      </div>
    )
  )
}

export default React.memo(AddCriterionDesktop)
