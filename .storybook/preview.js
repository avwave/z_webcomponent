import "../src/reset.css";
import "../src/index.css";
import DataGridProvider from "../src/components/DataGrid/DataGridContext";
import AgendaProvider from "../src/components/Agenda/AgendaContext";
import CheckboxProvider from "../src/components/CheckList/checklistContext";
import GridProvider from "../src/components/Grid/GridContext";
import { AnalyticsProvider } from "../src/components/SegmentIO";
import { ThemeProvider } from "@mui/styles";
import { AppBar, Toolbar, createTheme } from "@mui/material";



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
  const Default = (
    <ThemeProvider theme={theme}>
      
        <GridProvider>
          <CheckboxProvider>
            <AgendaProvider>
              <DataGridProvider>
                <Story />
              </DataGridProvider>
            </AgendaProvider>
          </CheckboxProvider>
        </GridProvider>
      
    </ThemeProvider>
  );
  if (context?.componentId === 'segmentio') {
    return (
      <AnalyticsProvider writeKey='kBESU3nop3e0nTVniD0rIKSvOGjvz64T' appIdentifier='STORYBOOK'>
        {Default}
      </AnalyticsProvider>
    )
  }
  return Default
};

const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    expanded: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {
    source: {
      type: 'auto'
    },
    story: {
      inline: true
    }
  }
};

const preview = {
  parameters,
  decorators: [withDataGridContextProvider],
}

export default preview
