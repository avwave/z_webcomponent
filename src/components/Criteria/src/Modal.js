import React from 'react'
import PropTypes from 'prop-types'

import useID from './hooks/useID'

import { makeStyles } from 'tss-react/mui';
const useStyles = makeStyles()(theme => ({
  root: {
    top: 0,
    left: 0,
    width: '100vw',
    display: 'flex',
    height: '100vh',
    position: 'fixed',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.paper,
    zIndex: theme.zIndex.modal,
  },
  
  header: {
    fontSize: '20px',
    padding: '20px 24px 10px',
    borderBottom: `solid 1px ${theme.palette.grey[400]}`
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
  
  content: {
    flex: '1',
    padding: '4px',
    overflowY: 'scroll'
  },
  
  actions: {
    display: 'flex'
  }
}));

Modal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.element,
  description: PropTypes.string,
  actions: PropTypes.arrayOf(PropTypes.object)
}

function Modal (props) {
  const {
    title,
    actions,
    description
  } = props

  const titleID = useID()
  const descriptionID = useID()
  const { classes } = useStyles()

  return (
    <div
      role='dialog'
      className={classes.root}
      aria-labelledby={titleID}
      aria-describedby={descriptionID}
    >
      <div id={titleID} className={classes.header}>{title}</div>

      <div id={descriptionID} className={classes.srOnly}>
        {description}
      </div>

      <div className={classes.content}>
        {props.children}
      </div>

      <div className={classes.actions}>
        {actions}
      </div>
    </div>
  )
}

export default React.memo(Modal)
