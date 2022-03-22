import { Button } from "@material-ui/core";
import { useMemo } from "react";
import ReactJson from "react-json-view";
import { useBranch } from "./BranchProvider";

const BranchIoStory = {
  title: "Branchio",
};

const BRANCH_API_KEY = "key_test_da5JuEJY92qGmtCJzg98lhogvzm0gF1p";

export default BranchIoStory;

export const Default = () => {
  const { branchData } = useBranch({ apiKey: BRANCH_API_KEY });
  return <ReactJson src={branchData} />;
};

export const CloseJourneyEvent = () => {
  const { branchStatus, closeJourney, openJourney } = useBranch({
    apiKey: BRANCH_API_KEY,
  });
  const debugStatus = useMemo(() => {
    console.log("index.stories.js (27)", branchStatus);
    return <ReactJson src={branchStatus} />;
  }, [branchStatus]);
  return (
    <>
      {debugStatus}
      <Button onClick={() => openJourney()}>Open Journey</Button>
      <Button onClick={() => closeJourney()}>Close Journey</Button>
    </>
  );
};

export const LogEvent = () => {
  const { branchStatus, logEvent } = useBranch({
    apiKey: BRANCH_API_KEY,
  });
  const debugStatus = useMemo(() => {
    console.log("index.stories.js (27)", branchStatus);
    return <ReactJson src={branchStatus} />;
  }, [branchStatus]);
  return (
    <>
      {debugStatus}
      <Button
        onClick={() =>
          logEvent("testEvent", { value: Math.random(), event: "test" })
        }
      >
        Log Event
      </Button>
    </>
  );
};

export const SetIdentity = () => {
  const {
    branchStatus,
    setBranchIdentity,
    getBranchIdentity,
    hasIdentity,
    branchLogout,
  } = useBranch({
    apiKey: BRANCH_API_KEY,
  });
  const debugStatus = useMemo(() => {
    console.log("index.stories.js (27)", branchStatus);
    return <ReactJson src={{ branchStatus, getBranchIdentity }} />;
  }, [branchStatus, getBranchIdentity]);

  return (
    <>
      {debugStatus}
      <Button
        disabled={hasIdentity}
        onClick={() => setBranchIdentity("FA_TEST_ZN_1234")}
      >
        Set Identity = 'FA_TEST_ZN_1234'
      </Button>
      <Button onClick={() => branchLogout()}>Logout</Button>
    </>
  );
};
