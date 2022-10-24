import { Link, makeStyles, Typography } from '@material-ui/core';
import { id } from 'date-fns/locale';
import PropTypes from "prop-types";
import React, { useCallback, useMemo, useState } from 'react';
import ReactJson from 'react-json-view';

const useStyles = makeStyles((theme) => {
  return {}
})

function generatePath(path, params) {
  return path
    .replace(/:(\w+)/g, (_, key) => {
      return params[key]
    })
    .replace(/(\/?)\*/, (_, prefix, __, str) => {
      const star = "*"

      if (params[star] == null) {
        // If no splat was provided, trim the trailing slash _unless_ it's
        // the entire path
        return str === "/*" ? "/" : "";
      }

      // Apply the splat
      return `${prefix}${params[star]}`;
    });
}

const Logger = ({
  routeMap = [],
  linkComponent: CLink,
  linkProps = {},
  log
}) => {
  const classes = useStyles()

  const parseOpsLogFormat = useCallback((log) => {
    let routeMatches = []
    routeMap.forEach(route => {
      const regex = new RegExp('{' + route?.resourceName + ' ([0-9]*) \\| (.*?)}', 'g')
      const match = regex.exec(log)
      if (match) {
        routeMatches.push(match)
      }
    });

    let prefix = null
    const parseElements = routeMatches?.map((match, idx1) => {
      return match?.matches?.map((element, idx2) => {
        if (!prefix) {
          prefix = element?.input?.slice(0, element.index)
        }
        const suffix = element?.input?.slice(element.index + element[0].length)
        let infix = element[2]
        infix = (
          <Link
            target="_blank"
            to={`${generatePath(match?.route?.pattern, { id: element[1] })}`}
            component={CLink}
            {...linkProps}
          >{element[2]}
          </Link>
        )
        if (idx2 <= 0) {
          return [prefix, infix, suffix]
        } else {
          return [infix, suffix]
        }
      })

    })

    if (parseElements.length <= 0) {
      return [log]
    }

    return parseElements?.flat()

  }, [CLink, linkProps, routeMap])

  const [compiledLog, setCompiledLog] = useState();

  const recurseOpsLog = useCallback(
    (log, prefix='', infix='', suffix='') => {

      let routeMatches = []
      routeMap.forEach(route => {
        const regex = new RegExp('{' + route?.resourceName + ' ([0-9]*) \\| (.*?)}', 'g')
        const match = regex.exec(log)
        if (match) {
          routeMatches.push({match, route})
        }
      });

      if (routeMatches.length <= 0) {
        return [prefix, log, infix, suffix]
      }

      const parseElements = routeMatches?.map(({match, route}, idx1) => {
        const prefix = match?.input?.slice(0, match?.index)
        const suffix = match?.input?.slice(match.index + match[0].length)
        let infix = match[2]
        const lProps = CLink? {
          to:`${generatePath(route?.pattern, { id: match[1] })}`
        }:{
          href:`${generatePath(route?.pattern, { id: match[1] })}`
        }
        infix = (
          <Link
            target="_blank"
            component={CLink}
            {...lProps}
            {...linkProps}
          >{match[2]}
          </Link>
        )
        const newPrefix = recurseOpsLog(prefix)
        const newSuffix = recurseOpsLog(suffix)

        return [newPrefix, infix, newSuffix]

      })

      return parseElements
    },
    [CLink, linkProps, routeMap],
  );


  const parseSubLog = useCallback(
    (logMessage) => {
      const {
        log_message,
        id,
        log_type,
        change_sets,
        date_created,
        resource_type,
        resource_id,
        ...props
      } = { ...log }

      const mappableRoutes = routeMap.filter((route) => {
        return (route?.resourceName in props)
      }).map(route => {
        return {
          ...route,
          identifier: props[route?.resourceName]
        }
      })

      const returnMap = mappableRoutes
        .filter(route => {
          return logMessage.match(`${route.identifier}`)
        })
        .map(route => {
          let findIdentifier = logMessage.match(`${route.identifier}`)
          let prefix = ''
          let suffix = ''
          let linkComponent = <></>
          prefix = recurseOpsLog(logMessage.slice(0, findIdentifier.index))
          suffix = recurseOpsLog(logMessage.slice(findIdentifier.index + `${route.identifier}`.length))
          const lProps = CLink? {
            to:`${generatePath(route?.pattern, { id: findIdentifier[0] })}`
          }:{
            href:`${generatePath(route?.pattern, { id: findIdentifier[0] })}`
          }
          linkComponent = (
            <Link
              target="_blank"
              component={CLink}
              {...lProps}
              {...linkProps}
            >{findIdentifier[0]}
            </Link>
          )
          return [...prefix, linkComponent, ...suffix]

        })

      if (returnMap.length > 0) {
        return returnMap
      }
      return recurseOpsLog(logMessage)
    },
    [CLink, linkProps, log, routeMap],
  );
  const parseBookingRequest = useMemo(
    () => {
      const logstr = log?.log_message ?? ''
      let regex = /(?:(request \([a-zA-Z0-9]{24,}\) \||request: [a-zA-Z0-9]{24,}|booking \([a-zA-Z0-9]{24,}\)))/i
      let matches = logstr.match(regex)

      let bk = matches?.[0]
      if (bk) {
        const split = bk.split(/: | \(/)
        const id = split[1].substring(0, 24)
        const insertIndex = matches?.["index"]
        let splitBookingSuffix = logstr.slice(insertIndex + matches?.[0]?.length)
        let splitBookingPrefix = logstr.slice(0, insertIndex) + split[0]

        const rSplitClient = /(?:(\[customer-\1))(.*)(?=\])/
        matches = splitBookingPrefix.match(rSplitClient)

        let insertClientLink = <></>
        let bkcustomercomponents = []
        if (matches?.[2]) {
          const customer = (matches?.[2] ?? '').split(': ')
          const customerId = customer?.[0]
          const customerName = customer?.[1]

          const genLink = routeMap.find(f => f?.resourceName === 'wlpCustomer')?.pattern ?? null
          const genPattern = genLink ? generatePath(genLink, { id: customerId.trim() }) : ''

          const lProps = CLink? {
            to:genPattern
          }:{
            href:genPattern
          }
          insertClientLink = (
            <Link
              target="_blank"
              component={CLink}
              {...lProps}
              {...linkProps}
            >{customerName}
            </Link>
          )

          const index = matches?.['index']
          const suffix = splitBookingPrefix.slice(index + matches?.[0].length + 1)
          splitBookingPrefix = <>{logstr.slice(0, index)}&nbsp;{insertClientLink}&nbsp;{suffix}</>

          bkcustomercomponents = [
            logstr.slice(0, index),
            insertClientLink,
            suffix
          ]
        }

        const genLink = routeMap.find(f => f?.resourceName === 'booking')?.pattern ?? null
        const genPattern = genLink ? generatePath(genLink, { id: id.trim() }) : ''

        const lProps = CLink? {
          to:genPattern
        }:{
          href:genPattern
        }
        const bookingcomponent = (
          <Link
            target="_blank"
            component={CLink}
            {...lProps}
            {...linkProps}
          >{id.trim()}
          </Link>
        )
        const components = [
          splitBookingPrefix,
          ...bkcustomercomponents,
          bookingcomponent,
          splitBookingSuffix
        ]

        const mappedComponents = components.map((c) => {
          if (typeof c === 'string') {
            return parseSubLog(c)
          }
          return c
        })
        return mappedComponents

      } else {
        return [parseSubLog(logstr)]
      }
    },
    [CLink, linkProps, log?.log_message, parseSubLog, routeMap],
  );


  return (
    <>
      {parseBookingRequest}
      {/* <ReactJson src={{parseBookingRequest}}/> */}
    </>

  )
}


Logger.propTypes = {
  log: PropTypes.object,
  routeMap: PropTypes.arrayOf(PropTypes.shape({
    resourceName: PropTypes.string.isRequired,
    pattern: PropTypes.string.isRequired,
  })),
  linkComponent: PropTypes.elementType,
  linkProps: PropTypes.object,
};


export { Logger };
