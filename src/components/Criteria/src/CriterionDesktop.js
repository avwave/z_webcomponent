import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Criterion from './Criterion'
import useI18nLabel from './hooks/useI18nLabel'
import useCriterionSummaryValue from './hooks/useCriterionSummaryValue'


import { makeStyles } from 'tss-react/mui';
import { Button, ButtonGroup, Card, CardContent, Divider, Popover, Popper } from '@mui/material'
import { ClickAwayListener } from "@mui/material";
import { useTheme } from '@mui/material'

const useStyles = makeStyles()(theme => ({
  root: {
    display: 'flex',
    flexShrink: '0',
    outline: 'none',
    minWidth: '64px',
    cursor: 'pointer',
    userSelect: 'none',
    padding: '7px 8px',
    borderRadius: '2px',
    transitionDuration: '.2s',
    backgroundColor: 'transparent',
    border: `solid 1px ${theme.palette.text.secondary}`,
    transitionProperty: 'background-color, border, borderColor',

    '&:not(:first-child)': {
      marginLeft: '10px'
    },

    '&:focus, &:hover': {
      borderColor: theme.palette.grey[400],
      backgroundColor: theme.palette.grey[200]
    }
  },

  rootDisabled: {
    borderColor: 'transparent',
    color: theme.palette.action.disabled,
    backgroundColor: theme.palette.action.disabledBackground
  },

  rootActive: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    border: `solid 1px ${theme.palette.primary.main}`,

    '&:focus, &:hover': {
      backgroundColor: theme.palette.primary.main
    }
  },

  label: {
    padding: '2px 8px',
    borderRight: `solid 1px ${theme.palette.text.secondary}`
  },

  value: {
    fontWeight: 'bold',
    padding: '2px 8px'
  }
}));

CriterionDesktop.propTypes = {
  active: PropTypes.bool,
  value: PropTypes.string,
  disabled: PropTypes.bool,
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

function CriterionDesktop(props) {
  const {
    value,
    updatable,
    deletable,
    criterionInfo,
    active = false,
    disabled = false,
    onChange: onChangeProp,
    onDelete: onDeleteProp,
    onActiveChange: onActiveChangeProp
  } = props

  const { classes } = useStyles()
  const rootElementRef = React.useRef(null)
  const summaryValue = useCriterionSummaryValue(criterionInfo.value, value)

  const i18nPopoverTitle = useI18nLabel(
    'criteria.criterion-title',
    criterionInfo.label
  )

  const i18nPopoverDesc = useI18nLabel(
    'criteria.criterion-description',
    criterionInfo.label
  )

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
    handleClose()
  }, [onDeleteProp, onActiveChange])

  const onChange = React.useCallback(updatedCriterion => {
    if (typeof onChangeProp === 'function') onChangeProp(updatedCriterion)
    onActiveChange(false)
    handleClose()
  }, [onChangeProp, onActiveChange])

  const onPopoverClose = React.useCallback(() => {
    onActiveChange(false)
    handleClose()
  }, [onActiveChange])

  const onKeyDown = React.useCallback(ev => {
    // Key: ENTER
    if (ev.keyCode === 13) toggleActiveState()
  }, [toggleActiveState])

  const rootElementClassName = React.useMemo(() => {
    const classNames = [classes.root]

    if (disabled === true) {
      classNames.push(classes.rootDisabled)
    } else if (active === true) {
      classNames.push(classes.rootActive)
    }

    return classNames.join(' ')
  }, [classes, disabled, active])


  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const id = open ? 'ZWCfilter-popper-select' : undefined;
  const theme = useTheme()

  return (
    <>
      <ButtonGroup sx={{ pr: 2, minWidth: 'max-content' }}>
        <Button
          size="small"
          variant="contained"
          onClick={handleClick}
        >
          {criterionInfo.label}
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={handleClick}
          sx={{ textTransform: 'initial' }}
        >
          {summaryValue}
        </Button>
      </ButtonGroup>

      <Popper
        id={id}
        disablePortal
        open={open}

        anchorEl={anchorEl}
        onClose={handleClose}
        popperOptions={
          {
            placement: 'bottom-start',
            strategy: 'absolute',
            modifiers: [
              {
                name: 'flip',
                enabled: true,
                options: {
                  altBoundary: true,
                  rootBoundary: 'viewport',
                  padding: 8,
                },
              },

            ]
          }
        }
        sx={{
          zIndex: theme.zIndex.modal,
          width: theme.breakpoints.values.sm,

        }}
      >
        <ClickAwayListener
          mouseEvent="onMouseUp"
          onClickAway={handleClose}>
          <Card>
            <CardContent>
              <Criterion
                value={value}
                updatable={updatable}
                deletable={deletable}
                criterionInfo={criterionInfo}
                onChange={onChange}
                onDelete={onDelete}
                onCancel={onPopoverClose}
              />
            </CardContent>
          </Card>
        </ClickAwayListener>

      </Popper>
    </>
  )
}

export default React.memo(CriterionDesktop)
