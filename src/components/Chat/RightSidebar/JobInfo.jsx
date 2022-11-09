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
  
  export const JobInfo = ({
    title = "JobInfo",
    jobsInfo,
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
            <Typography className={classes.subHeaders}>Joined:</Typography>
            <Typography className={classes.infoText}>
              {fuzzyDate(jobsInfo?.date_created)}
            </Typography>
  
            <Typography className={classes.subHeaders}>Activated:</Typography>
            <Typography className={classes.infoText}>
              {fuzzyDate(jobsInfo?.date_first_activated)}
            </Typography>

            <Typography className={classes.subHeaders}>Jobs Done:</Typography>
            <Typography className={classes.infoText}>
              {jobsInfo?.jobs_finished}
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    );
  };
  