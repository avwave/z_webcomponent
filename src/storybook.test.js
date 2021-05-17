import initStoryshots, {
  snapshotWithOptions,
} from "@storybook/addon-storyshots";
import TimeGrid from "react-big-calendar/lib/TimeGrid";
import { render } from "@testing-library/react";
import { Agenda } from "./components/Agenda";

const reactTestingLibrarySerializer = {
  print: (val, serialize, indent) => serialize(val.container.firstChild),
  test: (val) => val && val.hasOwnProperty("container"),
};

initStoryshots({
  storyKindRegex: /^((?!.*?Table|Example|FormBuilder).)*$/,
  test: snapshotWithOptions((story) => ({
    createNodeMock: (element) => {
        if (element.type === 'div') {
          return {scrollHeight: 0};
          // return document.createElement('div');
        }
        if (element.type === 'input') {
          return document.createElement('input');
        }
    },
  })),
});