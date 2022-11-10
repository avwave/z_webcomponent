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
  textWrapper:{display:"flex"},
  adId: { fontWeight: "600", padding: theme.spacing(0.5) },
  postId: { padding: theme.spacing(0.5) },
}));

export const AdRefs = ({ title = "Adrefs", adrefsList }) => {
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
          {adrefsList?.list.map((adref) => (
            <Box className={classes.textWrapper}>
              <Tooltip title={fuzzyDate(adref?.date)}>
                <Typography  className={classes.adId}>{adref?.ad_id}</Typography>
              </Tooltip>
              <Tooltip title={adref?.ad_title}>
                <Typography  className={classes.postId}>
                  {adref?.post_id}
                </Typography>
              </Tooltip>
            </Box>
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
};
