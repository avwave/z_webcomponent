import React from 'react'
import PropTypes from 'prop-types'

import useID from './hooks/useID'
import useI18nLabel from './hooks/useI18nLabel'
import useWindowWidth from './hooks/useWindowWidth'

import { makeStyles } from 'tss-react/mui';
const useStyles = makeStyles()(theme => ({
  root: {
    width: '344px',
    position: 'fixed',
    backgroundColor: theme.palette.background.paper,
    padding: '16px 16px 16px 16px',
    boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, .2)'
  },
  
  srOnly: {
    border: '0',
    padding: '0',
    width: '1px',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    position: 'absolute',
    clipPath: 'inset(50%)',
    wordWrap: 'normal !important',
    clip: 'rect(1px, 1px, 1px, 1px)'
  },
  
  overlay: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh'
  }
}));

Popover.propTypes = {
  top: PropTypes.number,
  left: PropTypes.number,
  right: PropTypes.number,
  title: PropTypes.string,
  onClose: PropTypes.func,
  children: PropTypes.element,
  description: PropTypes.string
}

function Popover (props) {
  const {
    top,
    title,
    description,
    onClose: onCloseProp
  } = props

  const titleID = useID()
  const descriptionID = useID()
  const windowWidth = useWindowWidth()
  const { classes } = useStyles()
  const rootElementRef = React.useRef(null)

  const i18nOverlayTitle = useI18nLabel('popover.overlay-title')

  const [rootElementInfo, setRootElementInfo] = React.useState(null)

  const onClose = React.useCallback(() => {
    if (typeof onCloseProp !== 'function') return
    onCloseProp()
  }, [onCloseProp])

  React.useLayoutEffect(() => {
    setRootElementInfo(
      rootElementRef == null
        ? null
        : rootElementRef.current.getBoundingClientRect()
    )
  }, [])

  React.useEffect(() => {
    return () => onClose()
  }, [windowWidth, onClose])

  const left = React.useMemo(() => {
    if (rootElementInfo == null) return 0

    if (props.left != null) {
      return props.left + rootElementInfo.width < window.innerWidth
        ? props.left
        : props.left - ((props.left + rootElementInfo.width) - window.innerWidth)
    }

    if (props.right != null) {
      const right = props.right - rootElementInfo.width

      return right > 0
        ? right
        : 0
    }
  }, [rootElementInfo, props.left, props.right])

  return (
    <>
      <div
        aria-hidden={true}
        title={i18nOverlayTitle}
        className={classes.overlay}
        onClick={onClose}
      />

      <div
        role='dialog'
        ref={rootElementRef}
        style={{ top, left }}
        className={classes.root}
        aria-labelledby={titleID}
        aria-describedby={descriptionID}
      >
        <div
          id={titleID}
          className={classes.srOnly}
        >
          {title}
        </div>

        <div
          id={descriptionID}
          className={classes.srOnly}
        >
          {description}
        </div>

        {props.children}
      </div>
    </>
  )
}

export default React.memo(Popover)
