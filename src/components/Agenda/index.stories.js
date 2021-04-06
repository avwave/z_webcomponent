import { Chip } from "@material-ui/core";
import React from "react";
import { withReactContext } from "storybook-react-context";
import { Agenda } from ".";
import { Button } from "../Button";
import isEmpty from "lodash.isempty";

import events from './events'

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
      payload: { events: events },
      type: actions.LOAD_DATA,
    });
  }, [args.columns, args.rows, dispatch]);

  return <Agenda {...args} />;
};

export const Default = DefaultStory.bind({});
Default.args = {
  containerStyle: {
    height: 700,
    maxHeight: "100vh",
  },
  style: { flex: "1 1 auto" },
};
