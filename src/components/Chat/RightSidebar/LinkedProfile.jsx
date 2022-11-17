import React, { useState } from "react";
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
  Link,
  Select,
  MenuItem,
} from "@material-ui/core";
import { TextInputField, InputDialog } from "./";
import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  RecoilRoot,
} from "recoil";
import { chatProfileStatusAtom } from "../recoilStates";
import { fuzzyDate, personNameShort } from "../../utils/format";


// TODO: linked user link

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  avatar: { marginRight: theme.spacing(2) },
  avatarSection: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(2),
  },
  avatarSectionTextWrapper: {},
  profileName: { fontWeight: "600" },
  profileLink: {},
  statusSection: {
    margin: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    paddingRight: theme.spacing(1), paddingLeft: theme.spacing(1) 
  },
  LinkedProfileDialogContentContainer: {
    padding: theme.spacing(2),
    minWidth: "200px",
  },
  selectContainer: { marginBottom: theme.spacing(2) },
  formControl: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    minWidth: 120,
  },
  commentContainer: {
    marginTop: theme.spacing(2.5),
  },
  clinicAffiliationContainer: { margin: theme.spacing(1), paddingRight: theme.spacing(1), paddingLeft: theme.spacing(1) },
  clinicTitle: { fontWeight: "bold" },
  clinicDescription: {},
}));

const LinkedProfileDialogContent = ({
  status,
  setStatus,
  subStatus,
  setSubStatus,
  commentValue,
  setCommentValue,
}) => {
  const classes = useStyles();

  // status

  const [openStatus, setOpenStatus] = useState(false);

  const handleChangeStatus = (event) => {
    setStatus(event.target.value);
  };

  const handleCloseStatus = () => {
    setOpenStatus(false);
  };

  const handleOpenStatus = () => {
    setOpenStatus(true);
  };

  // substatus
  const [openSubStatus, setOpenSubStatus] = useState(false);

  const handleChangeSubStatus = (event) => {
    setSubStatus(event.target.value);
  };

  const handleCloseSubStatus = () => {
    setOpenSubStatus(false);
  };

  const handleOpenSubStatus = () => {
    setOpenSubStatus(true);
  };

  // comment

  const handleChangeComment = (event) => {
    setCommentValue(event.target.value);
  };

  const SecondOne = () => {
    switch (status) {
      case "recruiting":
        return (
          <FormControl className={classes.formControl}>
            <InputLabel id="substatus-select-label">Sub-Status</InputLabel>
            <Select
              labelId="substatus-select-label"
              id="substatus-select"
              open={openSubStatus}
              onClose={handleCloseSubStatus}
              onOpen={handleOpenSubStatus}
              value={subStatus}
              onChange={handleChangeSubStatus}
            >
              <MenuItem value="screening">Screening</MenuItem>
              <MenuItem value="scheduling_for_interview">
                Scheduling Interview
              </MenuItem>
              <MenuItem value="for_interview">Scheduled For Interview</MenuItem>
              <MenuItem value="no_show">No Show</MenuItem>
              <MenuItem value="on_hold">On Hold</MenuItem>
              <MenuItem value="dead_pool">Dead Pool</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="declined_offer">Declined Offer</MenuItem>
              <MenuItem value="withdrawn">Withdrawn</MenuItem>
            </Select>
          </FormControl>
        );
      case "onboarding":
        return (
          <FormControl className={classes.formControl}>
            <InputLabel id="substatus-select-label">Sub-Status</InputLabel>
            <Select
              labelId="substatus-select-label"
              id="substatus-select"
              open={openSubStatus}
              onClose={handleCloseSubStatus}
              onOpen={handleOpenSubStatus}
              value={subStatus}
              onChange={handleChangeSubStatus}
            >
              <MenuItem value="evaluation">Evaluation</MenuItem>
              <MenuItem value="training">Training</MenuItem>
              <MenuItem value="investigation">Investigation</MenuItem>
              <MenuItem value="ob_on_hold">On Hold</MenuItem>
              <MenuItem value="returning">Returning</MenuItem>
            </Select>
          </FormControl>
        );

      case "discarded":
        return (
          <FormControl className={classes.formControl}>
            <InputLabel id="substatus-select-label">Sub-Status</InputLabel>
            <Select
              labelId="substatus-select-label"
              id="substatus-select"
              open={openSubStatus}
              onClose={handleCloseSubStatus}
              onOpen={handleOpenSubStatus}
              value={subStatus}
              onChange={handleChangeSubStatus}
              disabled
            ></Select>
          </FormControl>
        );
      case "active":
        return (
          <FormControl className={classes.formControl}>
            <InputLabel id="substatus-select-label">Sub-Status</InputLabel>
            <Select
              labelId="substatus-select-label"
              id="substatus-select"
              open={openSubStatus}
              onClose={handleCloseSubStatus}
              onOpen={handleOpenSubStatus}
              value={subStatus}
              onChange={handleChangeSubStatus}
              disabled
            ></Select>
          </FormControl>
        );

      case "on_leave":
        return (
          <FormControl className={classes.formControl}>
            <InputLabel id="substatus-select-label">Sub-Status</InputLabel>
            <Select
              labelId="substatus-select-label"
              id="substatus-select"
              open={openSubStatus}
              onClose={handleCloseSubStatus}
              onOpen={handleOpenSubStatus}
              value={subStatus}
              onChange={handleChangeSubStatus}
            >
              <MenuItem value="rest_day">Rest Day</MenuItem>
              <MenuItem value="vacation">Vacation</MenuItem>
              <MenuItem value="sick">Sick</MenuItem>
              <MenuItem value="injured_on_job">Injured On Job</MenuItem>
              <MenuItem value="grieving">Grieving</MenuItem>
              <MenuItem value="emergency">Emergency</MenuItem>
              <MenuItem value="others">Others</MenuItem>
            </Select>
          </FormControl>
        );

      case "suspended":
        return (
          <FormControl className={classes.formControl}>
            <InputLabel id="substatus-select-label">Sub-Status</InputLabel>
            <Select
              labelId="substatus-select-label"
              id="substatus-select"
              open={openSubStatus}
              onClose={handleCloseSubStatus}
              onOpen={handleOpenSubStatus}
              value={subStatus}
              onChange={handleChangeSubStatus}
            >
              <MenuItem value="training">Trainings</MenuItem>
              <MenuItem value="investigation">Investigation</MenuItem>
            </Select>
          </FormControl>
        );
      case "blocked":
        return (
          <FormControl className={classes.formControl}>
            <InputLabel id="substatus-select-label">Sub-Status</InputLabel>
            <Select
              labelId="substatus-select-label"
              id="substatus-select"
              open={openSubStatus}
              onClose={handleCloseSubStatus}
              onOpen={handleOpenSubStatus}
              value={subStatus}
              onChange={handleChangeSubStatus}
            >
              <MenuItem value="pending_deactivation">
                Pending Deactivation
              </MenuItem>
              <MenuItem value="termination">Termination</MenuItem>
              <MenuItem value="demand_letter">Demand Letter</MenuItem>
              <MenuItem value="decision">Decision</MenuItem>
              <MenuItem value="case_filed">Case Filed</MenuItem>
              <MenuItem value="good_standing">Good Standing</MenuItem>
              <MenuItem value="blacklisted">Blacklisted</MenuItem>
              <MenuItem value="lockdown">Due To Lockdown</MenuItem>
            </Select>
          </FormControl>
        );
      case "operations":
        return (
          <FormControl className={classes.formControl}>
            <InputLabel id="substatus-select-label">Sub-Status</InputLabel>
            <Select
              labelId="substatus-select-label"
              id="substatus-select"
              open={openSubStatus}
              onClose={handleCloseSubStatus}
              onOpen={handleOpenSubStatus}
              value={subStatus}
              onChange={handleChangeSubStatus}
              disabled
            ></Select>
          </FormControl>
        );
      default:
        return (
          <FormControl className={classes.formControl}>
            <InputLabel id="substatus-select-label">Sub-Status</InputLabel>
            <Select
              labelId="substatus-select-label"
              id="substatus-select"
              open={openSubStatus}
              onClose={handleCloseSubStatus}
              onOpen={handleOpenSubStatus}
              value={subStatus}
              onChange={handleChangeSubStatus}
              disabled
            ></Select>
          </FormControl>
        );
    }
  };

  return (
    <Box className={classes.LinkedProfileDialogContentContainer}>
      <Box className={classes.selectContainer}>
        <FormControl className={classes.formControl}>
          <InputLabel id="first-select-label">Status</InputLabel>
          <Select
            labelId="first-select-label"
            id="first-select"
            open={openStatus}
            onClose={handleCloseStatus}
            onOpen={handleOpenStatus}
            value={status}
            onChange={handleChangeStatus}
          >
            <MenuItem value="recruiting">Recruiting</MenuItem>
            <MenuItem value="onboarding">Onboarding</MenuItem>
            <MenuItem value="discarded">Discarded</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="on_leave">On Leave</MenuItem>
            <MenuItem value="suspended">Suspended</MenuItem>
            <MenuItem value="blocked">Blocked</MenuItem>
            <MenuItem value="operations">Operations</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box className={classes.selectContainer}>
        <SecondOne />
      </Box>
      <Box className={classes.commentContainer}>
        <TextField
          id="comment-field"
          label="Comment"
          multiline
          rows={4}
          value={commentValue}
          onChange={handleChangeComment}
        />
      </Box>
    </Box>
  );
};

export const LinkedProfile = ({
  profileLink = "#",
  profileLinkText = "View the profile",
  handleOpenStatusDialog,
  handleCloseStatusDialog,
  handleAcceptStatusDialog,
  displayStatus = false,
  displayClinic = false,
  clinicAffiliation,
  conversationInfo,
  chatProfileStatus
}) => {

  const classes = useStyles();
  const [openStatusDialog, setOpenStatusDialog] = useState(false);

  const [status, setStatus] = useState("");
  const [subStatus, setSubStatus] = useState("");
  const [commentValue, setCommentValue] = useState("");

  return (
    <Card className={classes.root}>
      <Box className={classes.avatarSection}>
        <Avatar alt={personNameShort(conversationInfo?.linked_user)} src={conversationInfo?.linked_user?.profile_picture_url} className={classes.avatar} />
        <Box className={classes.avatarSectionTextWrapper}>
          <Typography className={classes.profileName}>{personNameShort(conversationInfo?.linked_user)}</Typography>
          <Link href={profileLink} className={classes.profileLink}>
            {profileLinkText}
          </Link>
        </Box>
      </Box>
      {displayClinic && (
        <Box className={classes.clinicAffiliationContainer}>
          <Typography className={classes.clinicTitle} component="span">
            Clinic Affiliation:{" "}
          </Typography>
          <Typography className={classes.description} component="span">
            {clinicAffiliation?.[0]?.clinic?.label}
          </Typography>
        </Box>
      )}
      {displayStatus && (
        <Box className={classes.statusSection}>
          <InputDialog
            title="Update Status"
            edge="end"
            open={openStatusDialog}
            iconButton={
              <Typography>{chatProfileStatus?.status_label}</Typography>
            }
            handleAccept={() =>
              handleAcceptStatusDialog(
                openStatusDialog,
                setOpenStatusDialog,
                status,
                setStatus,
                subStatus,
                setSubStatus,
                commentValue,
                setCommentValue
              )
            }
            handleClose={() =>
              handleCloseStatusDialog(openStatusDialog, setOpenStatusDialog)
            }
            handleClickOpen={() =>
              handleOpenStatusDialog(
                openStatusDialog,
                setOpenStatusDialog,
                setStatus,
                setSubStatus,
                setCommentValue
              )
            }
            dialogContent={
              <LinkedProfileDialogContent
                status={status}
                setStatus={setStatus}
                subStatus={subStatus}
                setSubStatus={setSubStatus}
                commentValue={commentValue}
                setCommentValue={setCommentValue}
              />
            }
          />
          <Box>
            <ListItemText
              primary={chatProfileStatus?.status_reason}
              secondary={`- ${
                chatProfileStatus?.status_updated_by?.display_name
              } | ${fuzzyDate(chatProfileStatus?.status_last_updated)}`}
            />
          </Box>
        </Box>
      )}
    </Card>
  );
};
