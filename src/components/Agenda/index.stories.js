import { Chip } from "@material-ui/core";
import React from "react";
import { withReactContext } from "storybook-react-context";
import { Agenda } from ".";
import { Button } from "../Button";
import isEmpty from "lodash.isempty";

import { baseEvents, daySummary, heightBugEvents , progressEvents} from './events'

import AgendaProvider, {
  AgendaReducer,
  AgendaContext,
  actions,
  initState,
} from "./AgendaContext";

const AgendaStory = {
  component: Agenda,
  title: "Agenda/Agenda",
  decorators: [
    withReactContext({
      reducer: AgendaReducer,
      context: AgendaContext,
      initialState: { ...initState },
    }),
    (Story) => (
      <AgendaProvider>
        <Story />
      </AgendaProvider>
    ),
  ],
};

export default AgendaStory;

const DefaultStory = ({ ...args }) => {
  const [state, dispatch] = React.useContext(AgendaContext);
  React.useEffect(() => {
    dispatch({
      payload: { events: args.events, summaries: args.summaries },
      type: actions.LOAD_DATA,
    });
  }, [args.events, args.summaries, dispatch]);

  return <Agenda {...args} />;
};

export const Default = DefaultStory.bind({});
Default.args = {
  containerStyle: {
    height: 750,
  },
  popup: true,
  style: { flex: "1 1 auto" },
  events: [...baseEvents],
};

export const CustomDayHeader = DefaultStory.bind({});
CustomDayHeader.args = {
  ...Default.args,
  summaries: [...daySummary],
};


export const VariableHeightEventsBug = DefaultStory.bind({})
VariableHeightEventsBug.args = {
  ...Default.args,
  events: [...heightBugEvents],
};


export const ProgressEvent = DefaultStory.bind({})
ProgressEvent.args = {
  ...Default.args,
  events: [...progressEvents],
  summaries: [],
}