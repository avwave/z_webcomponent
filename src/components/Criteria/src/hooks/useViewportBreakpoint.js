import React from 'react'
import useWindowWidth from './useWindowWidth'

export default function useViewportBreakpoint (isMobile = true, size = 769) {
  const windowWidth = useWindowWidth()

  return React.useMemo(() => {
    return isMobile === true ? windowWidth < size : windowWidth > size
  }, [isMobile, size, windowWidth])
}
