import { Box, Divider, Link, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { id } from 'date-fns/locale';
import PropTypes from "prop-types";
import React, { useCallback, useMemo, useState } from 'react';
import ReactJson from 'react-json-view';
import TruncateMarkup from 'react-truncate-markup';

const useStyles = makeStyles()((theme) => {
  return {}
});

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

function splitString(str) {
  let result = [];
  let currentLine = '';
  let braceCount = 0;
  let bracketCount = 0;
  let parenthesesCount = 0;
  let singleQuoteCount = 0;
  let doubleQuoteCount = 0;
  let chevronCount = 0;
  let firstPipeIgnored = false;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === '{') {
      braceCount++;
    } else if (str[i] === '}') {
      braceCount--;
    } else if (str[i] === '[') {
      bracketCount++;
    } else if (str[i] === ']') {
      bracketCount--;
    } else if (str[i] === '(') {
      parenthesesCount++;
    } else if (str[i] === ')') {
      parenthesesCount--;
    } else if (str[i] === "'" && str[i - 1] !== '\\') {
      singleQuoteCount = 1 - singleQuoteCount;
    } else if (str[i] === '"' && str[i - 1] !== '\\') {
      doubleQuoteCount = 1 - doubleQuoteCount;
    } else if (str[i] === '<') {
      chevronCount++;
      if (
        braceCount === 0 &&
        bracketCount === 0 &&
        parenthesesCount === 0 &&
        singleQuoteCount === 0 &&
        doubleQuoteCount === 0 &&
        chevronCount === 1
      ) {
        result.push(currentLine.trim());
        currentLine = '';
      }
    } else if (str[i] === '>') {
      chevronCount--;
    }

    if (
      ((str[i] === '|' && firstPipeIgnored) ||
        (str[i] === '>' &&
          str[i - 1] === ' ' &&
          str[i - 2] !== ',' &&
          !(str[i - 2] === ' ' && str[i - 3] === ','))) &&
      braceCount === 0 &&
      bracketCount === 0 &&
      parenthesesCount === 0 &&
      singleQuoteCount === 0 &&
      doubleQuoteCount === 0 &&
      chevronCount === 0
    ) {
      result.push(currentLine.trim());
      currentLine = '';
    } else {
      currentLine += str[i];
      if (str[i] === '|' && !firstPipeIgnored) {
        firstPipeIgnored = true;
      }
    }
  }

  if (currentLine.trim() !== '') {
    result.push(currentLine.trim());
  }

  return result.filter((line) => line !== ',');
}


const Logger = ({
  routeMap = [],
  linkComponent: CLink,
  linkProps = {},
  log
}) => {
  const { classes } = useStyles()

  const recurseOpsLog = useCallback(
    (log, prefix = '', infix = '', suffix = '') => {

      if (typeof log === 'string' && log.length <= 0) {
        return [log]
      }

      const regex = new RegExp('{(' + routeMap?.map(route => route.resourceName).join('|') + ') ([0-9]*) \\| (.*?)}', 'g')
      const splitRegex = new RegExp('({(?:' + routeMap?.map(route => route.resourceName).join('|') + ') [0-9]* \\| .*?})', 'g')
      const split = log.split(splitRegex)
      const matches = [...log?.matchAll(regex)]
      const routeMatches = matches?.map(match => {
        const route = routeMap?.find(route => route.resourceName === match[1])
        return {
          match,
          route
        }
      })

      if (routeMatches.length <= 0) {
        return split
      }


      const parseElements = split?.map((element, idx) => {
        const findMatch = routeMatches?.find(match => match?.match?.[0] === element)
        if (findMatch) {
          const lProps = CLink ? {
            to: `${generatePath(findMatch?.route?.pattern, { id: findMatch?.match[2] })}`
          } : {
            href: `${generatePath(findMatch?.route?.pattern, { id: findMatch?.match[2] })}`
          }
          return (
            <Link
              target="_blank"
              component={CLink}
              {...lProps}
              {...linkProps}
              underline="hover">{findMatch?.match[3]}
            </Link>
          );
        } else {
          return element
        }
      })

      return parseElements
    },
    [CLink, linkProps, routeMap],
  );

  const parseSubSublog = useCallback(
    (logMessage, mappableRoutes) => {
      const returnMap = mappableRoutes
        .filter(route => {
          const regex = new RegExp('(?!![\\w\\d])' + route.identifier + '(?![\\w\\d])', 'g')
          return logMessage.match(regex)
        })
        .map(route => {
          const regex = new RegExp('(?!![\\w\\d])' + route.identifier + '(?![\\w\\d])', 'g')
          let findIdentifier = regex.exec(logMessage)
          let prefix = ''
          let suffix = ''
          let linkComponent = <></>
          prefix = recurseOpsLog(logMessage.slice(0, findIdentifier.index))
          suffix = recurseOpsLog(logMessage.slice(findIdentifier.index + `${route.identifier}`.length))
          const lProps = CLink ? {
            to: `${generatePath(route?.pattern, { id: findIdentifier[0] })}`
          } : {
            href: `${generatePath(route?.pattern, { id: findIdentifier[0] })}`
          }
          linkComponent = (
            <Link
              target="_blank"
              component={CLink}
              {...lProps}
              {...linkProps}
              underline="hover">{findIdentifier[0]}
            </Link>
          )
          return [...prefix, linkComponent, ...suffix]

        })

      if (returnMap.length > 0) {
        return returnMap
      }
      return recurseOpsLog(logMessage)
    },
    [CLink, linkProps, recurseOpsLog],
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

      const prefill = recurseOpsLog(logMessage).flat(20)

      const prefills = prefill?.map(pf => {
        if (typeof pf === 'string') {
          return parseSubSublog(pf, mappableRoutes)
        }
        return pf
      })

      return prefills


    },
    [CLink, linkProps, log, routeMap],
  );
  const parseBookingRequest = useCallback(
    (log) => {
      const logstr = log ?? ''
      let regex = /(?:(request \([a-zA-Z0-9]{24,}\)\||appointment: \[(.*)\]|request: [a-zA-Z0-9]{24,}|booking \([a-zA-Z0-9]{24,}\)))/i

      let matches = logstr.match(regex)

      let bk = matches?.[0]
      if (bk) {
        const split = bk.split(/: | \(/)
        const id = split[1].substring(0, 24)
        const appt = matches?.[2]
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

          const lProps = CLink ? {
            to: genPattern
          } : {
            href: genPattern
          }
          insertClientLink = (
            <Link
              target="_blank"
              component={CLink}
              {...lProps}
              {...linkProps}
              underline="hover">{customerName}
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

        let genLink
        let bookingcomponent
        if (split?.[0] === 'request' || split?.[0] === 'booking') {
          genLink = routeMap.find(f => f?.resourceName === 'booking')?.pattern ?? null
          const genPattern = genLink ? generatePath(genLink, { id: id.trim() }) : ''
          bookingcomponent = constructLink(genPattern, id)
        } else {
          genLink = routeMap.find(f => f?.resourceName === 'appointment')?.pattern ?? null
          const appts = appt.split(/[ ,]+/)

          bookingcomponent = appts.map(appt => {
            const genPattern = genLink ? generatePath(genLink, { id: appt }) : ''
            return constructLink(genPattern, appt)
          })
        }



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
    [CLink, linkProps, parseSubLog, routeMap],
  );

  const constructLink = (genPattern, text) => {
    const lProps = CLink ? {
      to: genPattern
    } : {
      href: genPattern
    }
    const bookingcomponent = (
      <>
        <Link
          target="_blank"
          component={CLink}
          {...lProps}
          {...linkProps}
          sx={{
            marginRight: 1,
            marginLeft: 1
          }}
          underline="hover">{text.trim()}
        </Link>
      </>
    )
    return bookingcomponent
  }
  const splitLogs = useMemo(
    () => {
      const subStrings = splitString(log?.log_message)
      const splitLogs = subStrings.map((subString, idx) => {
        return (
          <TableRow>
            <TableCell>
              <>
                {parseBookingRequest(subString)}
              </>
            </TableCell>
          </TableRow>
        )
      })
      return (
        <Table size="small">
          <TableBody>
            {splitLogs}
          </TableBody>
        </Table>
      )

    }, [log, parseBookingRequest]
  );
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      height: '100%',
    }}>
      {splitLogs}
      {/* <ReactJson src={{parseBookingRequest}}/> */}
    </Box>

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
