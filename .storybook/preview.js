import "../src/reset.css";
import "../src/index.css";
import { withReactContext } from "storybook-react-context";
import { muiTheme } from "storybook-addon-material-ui";

import { addDecorator } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";
import { withConsole } from "@storybook/addon-console";
import "@storybook/addon-console";

import { initialize, mswDecorator } from "msw-storybook-addon";

initialize();

addDecorator(withKnobs);
addDecorator((storyFn, context) => withConsole()(storyFn)(context));

const zennyaTheme = {
  themeName: "Zennya Theme",
  palette: {
    primary: {
      main: "#74BACD",
    },
    secondary: {
      main: "#ffa726",
    },
    error: {
      main: "#F59B94",
    },
    link: {
      main: "#3474B7",
    },
    default: {
      main: "#C4C4C4",
    },
  },
};

export const decorators = [
  withReactContext,
  muiTheme([zennyaTheme]),
  mswDecorator,
];
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {
    source: {
      type: "code",
    },
  },
};
