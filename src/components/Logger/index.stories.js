import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import React from "react";
import ReactJson from "react-json-view";
import { Logger } from ".";

const LoggerStory = {
  component: Logger,
  title: "Logger",
};

export default LoggerStory;


export const auditLogs = [
  {
    "id": "6347d18e5a2008ccd2265b51",
    "log_type": "CLIENT_ACTION",
    "log_message": "1412 | ray client teegland submitted a provider rating of 5.0 for request: 6347ac6d5a20c6a04c827450",
    "request_id": "6347ac6d5a20c6a04c827450",
    "consult_request_id": null,
    "special_care_request_id": null,
    "client_id": 1412,
    "provider_id": 1417,
    "date_created": "2022-10-13T08:51:26Z"
  },
  {
    "id": "6347bad5c2dcc16537917f43",
    "log_type": "SERVER_ACTION",
    "log_message": "Maxicare Email Notification Sent to client: 1412",
    "request_id": "6347ac6d5a20c6a04c827450",
    "consult_request_id": null,
    "special_care_request_id": null,
    "client_id": 1412,
    "provider_id": null,
    "date_created": "2022-10-13T07:14:29Z"
  },
  {
    "id": "6347bad6c2dcc16537917f48",
    "log_type": "SERVER_ACTION",
    "log_message": "1 | zennya System ended the request: 6347ac6d5a20c6a04c827450",
    "request_id": "6347ac6d5a20c6a04c827450",
    "consult_request_id": null,
    "special_care_request_id": null,
    "client_id": 1412,
    "provider_id": 1417,
    "date_created": "2022-10-13T07:14:30Z"
  },
  {
    "id": "6347bad2c2dcc16537917f3d",
    "log_type": "SERVER_ACTION",
    "log_message": "Request (6347ac6d5a20c6a04c827450) | Appointment (11238) has elapsed its total duration, it should now end",
    "request_id": "6347ac6d5a20c6a04c827450",
    "consult_request_id": null,
    "special_care_request_id": null,
    "client_id": 1412,
    "provider_id": 1417,
    "date_created": "2022-10-13T07:14:26Z"
  }, {
    "id": "6347bacd5a20c6a04c827524",
    "log_type": "PROVIDER_ACTION",
    "log_message": "provider 1417 | RayProv Rimorin ended the all steps under'1099 | Specimen and Kit Hand-Over' in request: 6347ac6d5a20c6a04c827450",
    "request_id": "6347ac6d5a20c6a04c827450",
    "consult_request_id": null,
    "special_care_request_id": null,
    "client_id": 1412,
    "provider_id": 1417,
    "date_created": "2022-10-13T07:14:21Z"
  },
]

const activityLogs = [
  {
    "id": "6304adcbc2dce2e8a1d97459",
    "log_type": "CUSTOMER",
    "log_message": "Sending booking confirmation notification for request: 6304ad9b5a2070ff34f3b6f7",
    "user_id": "1",
    "resource_type": "CUSTOMER",
    "resource_id": "32",
    "change_sets": null,
    "date_created": "2022-08-23T10:36:59Z"
  },
  {
    "id": "6306f5455a209d491b8d68a3",
    "log_type": "CUSTOMER",
    "log_message": "1412 | ray client teegland updated booking location for request: 6304ad9b5a2070ff34f3b6f7 FROM Makati Ave, 1225 Makati, Philippines TO China Bank Building, 8745, Paseo de Roxas, Salcedo, Bel-Air, Makati 1st District, Makati, Southern Manila District, Metro Manila, 1226, Philippines",
    "user_id": "1412",
    "resource_type": "CUSTOMER",
    "resource_id": "32",
    "change_sets": null,
    "date_created": "2022-08-25T04:06:29Z"
  },
  {
    "id": "630c2bb0c2dc5149b1b95cb3",
    "log_type": "CUSTOMER",
    "log_message": "Initiating voice notification for unconfirmed booking for customer profile {wlpCustomer 32 | d teegland}",
    "user_id": "1",
    "resource_type": "CUSTOMER",
    "resource_id": "32",
    "change_sets": null,
    "date_created": "2022-08-29T03:00:00Z"
  }, {
    "id": "633295145a20dea26c2743a7",
    "log_type": "CUSTOMER",
    "log_message": "{1419 | White Label Staff} of Maxicare created a booking (633295125a20dea26c2743a3) for client {wlpCustomer 32 | d teegland}",
    "user_id": "1419",
    "resource_type": "CUSTOMER",
    "resource_id": "32",
    "change_sets": null,
    "date_created": "2022-09-27T06:15:48Z"
  }
]


const routeMap = [
  {
    resourceName: 'booking',
    pattern: '/scheduled-bookings/:id'
  },
  {
    resourceName: 'wlpCustomer',
    pattern: '/client-profile/:id'
  },
  {
    resourceName: 'resource_id',
    pattern: '/client-profile/:id'
  },
  {
    resourceName: 'user_id',
    pattern: '/user-profile/:id'
  },
  {
    resourceName: 'provider_id',
    pattern: '/provider-profile/:id'
  },
  {
    resourceName: 'client_id',
    pattern: '/client-profile/:id'
  },
  {
    resourceName: 'wlpPartner',
    pattern: '/'
  }

]
const ActivityLogStory = ({ logs, ...args }) => {
  return (
    <>
      <ReactJson src={{ routeMap }} />
      <Table>
        <TableHead>
          <TableCell variant="footer">Raw log</TableCell>
          <TableCell variant="footer">Formatted log</TableCell>
        </TableHead>
        <TableBody>
          {logs?.map((log, idx) => {
            return (
              <TableRow key={idx}>
                <TableCell><ReactJson src={log} /></TableCell>
                <TableCell>
                  <Logger
                    log={log}
                    routeMap={routeMap}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}

export const ActivityLog = ActivityLogStory.bind({});
ActivityLog.args = {
  logs: activityLogs
}

export const AuditLog = ActivityLogStory.bind({});
AuditLog.args = {
  logs: auditLogs
}


export const OPSLog = ActivityLogStory.bind({});
OPSLog.args = {
  logs: [
    {
      "id": "6343c4565a20e0d38c538198",
      "log_type": "ACCOUNT",
      "log_message": "Login pin code sent for 1490 | gabrielle floirendo",
      "user_id": "1",
      "resource_type": "CLIENT",
      "resource_id": "1490",
      "change_sets": null,
      "date_created": "2022-10-10T07:05:58Z"
    },
    {
      "id": "635272995a20988849cdbdaf",
      "log_type": "CUSTOMER",
      "log_message": "{wlpCustomer 47 | gabrielle floirendo}, a customer of {wlpPartner 1 | Maxicare} is trying to perform birthdate validation.",
      "user_id": "1",
      "resource_type": "CUSTOMER",
      "resource_id": "47",
      "change_sets": null,
      "date_created": "2022-10-21T10:21:13Z"
    },
    {
      "id": "633295145a20dea26c2743a7",
      "log_type": "CUSTOMER",
      "log_message": "{client_id 10101 | Person of interest } of Maxicare created a booking (633295125a20dea26c2743a3) for client {wlpCustomer 2 | two man}  and {wlpCustomer 32 | d teegland}",
      "user_id": "1419",
      "resource_type": "CUSTOMER",
      "resource_id": "32",
      "change_sets": null,
      "date_created": "2022-09-27T06:15:48Z"
    },
    {
      "id": "63567e41c2dcd747952ca952",
      "log_type": "CUSTOMER",
      "log_message": "Initiating voice notification for unconfirmed booking for customer profile {wlpCustomer 131 | JOSIAH ADOLFO}",
      "user_id": "1",
      "resource_type": "CUSTOMER",
      "resource_id": "131",
      "change_sets": null,
      "date_created": "2022-10-24T12:00:01Z"
    },
    {
      "id": "63567e41c2dcd747952ca952",
      "log_type": "CUSTOMER",
      "log_message": "user id 1 {wlpCustomer 131 | JOSIAH ADOLFO}",
      "user_id": "1",
      "resource_type": "CUSTOMER",
      "resource_id": "131",
      "change_sets": null,
      "date_created": "2022-10-24T12:00:01Z"
    }
  ]
}
