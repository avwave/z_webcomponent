import "../src/reset.css";
import "../src/index.css";
import { withReactContext } from "storybook-react-context";
import { muiTheme } from 'storybook-addon-material-ui'

const zennyaTheme = {
  themeName: 'Zennya Theme',
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

export const decorators = [withReactContext, muiTheme([zennyaTheme])];
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  }
};
