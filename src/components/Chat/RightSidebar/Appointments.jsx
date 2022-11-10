import {
  Typography,
  Backdrop,
  CircularProgress,
  LinearProgress,
  Toolbar,
  Tooltip,
  withStyles,
  makeStyles,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Box,
  DialogTitle,
  Dialog,
  Button,
  InputLabel,
  FormControl,
  DialogContent,
  DialogActions,
  TextField,
  ListItem,
  ListItemText,
  List,
  ListItemIcon,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  CardMedia,
  CardActions,
  Collapse,
  Paper,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
  Link,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from "@material-ui/icons/Close";
import { InputDialog } from "./InputDialog";
import clsx from "clsx";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React, { useState } from "react";
import { fuzzyDate, personNameShort } from "../../utils/format";





// TODO: Change Link around line 130 when we get the react page equivalent of it

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    "& .MuiCardHeader-root": { paddingBottom: 0 },
    "& .MuiCardContent-root": { paddingTop: 0 },
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  cardTitle: { fontWeight: "600" },
  subHeaders: { fontWeight: "600", padding: theme.spacing(1) },
  infoText: { textAlign: "center", padding: theme.spacing(1) },
}));

export const Appointments = ({
  title = "Appointments",
  appointmentsList,
  API_URL,
}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(true);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        disableTypography
        action={
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        }
        title={<Typography className={classes.cardTitle}> {title} </Typography>}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>DATE</TableCell>
                <TableCell>SERVICE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointmentsList.list.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell component="th" scope="row">
                    <Link
                      href={`${API_URL}/#/admin/bookings?appointment_id=${appointment.id}`}
                    >
                      {appointment.id}
                    </Link>
                  </TableCell>
                  <TableCell align="right">
                    {fuzzyDate(appointment.date_standby_start)}
                  </TableCell>
                  <TableCell align="right">{appointment.type.label}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Collapse>
    </Card>
  );
};
