import "../src/reset.css";
import "../src/index.css";
import DataGridProvider from "../src/components/DataGrid/DataGridContext";
import AgendaProvider from "../src/components/Agenda/AgendaContext";
import CheckboxProvider from "../src/components/CheckList/checklistContext";
import GridProvider from "../src/components/Grid/GridContext";
import { AnalyticsProvider } from "../src/components/SegmentIO";
import { MuiThemeProvider, createTheme } from "@material-ui/core";


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

const theme = createTheme();

const withDataGridContextProvider = (Story, context) => {
  return (
    <MuiThemeProvider theme={theme}>
      <AnalyticsProvider writeKey='kBESU3nop3e0nTVniD0rIKSvOGjvz64T' appIdentifier='STORYBOOK'>
        <GridProvider>
          <CheckboxProvider>
            <AgendaProvider>
              <DataGridProvider>
                <Story />
              </DataGridProvider>
            </AgendaProvider>
          </CheckboxProvider>
        </GridProvider>
      </AnalyticsProvider>
    </MuiThemeProvider>
  );
};

const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {
    source: {
      type: 'code'
    }
  }
};

const preview = {
  parameters,
  decorators: [withDataGridContextProvider],
}

export default preview
