import React, { useState } from "react";
import { withReactContext } from "storybook-react-context";
import { Grid } from ".";
import GridProvider, {actions, GridContext, gridReducer} from '../GridContext';

const GridStory = {
  component: Grid,
  title: "Grid/Grid",
  decorators: [
    withReactContext({
      reducer: gridReducer,
      context: GridContext,
      initialState: { columns: [] },
    }),
    (Story) => (
      <GridProvider>
        <Story />
      </GridProvider>
    ),
  ],
};

export default GridStory;

let defaultItems = [
  {
    hasProgress: true,
    id: "col1",
    columnTitle: "Col1",
    columnSubtitle: "ColSub1",
    items: [
      { id: "id1-1", title: "Elem one", variant: "default" },
      {
        id: "id1-2",
        title: "Elem two",
        subtitle: "(scheduled)",
        variant: "scheduled",
      },
      { id: "id1-3", title: "Elem three", variant: "default" },
    ],
  }
  ,
  {
    hasProgress: false,
    id: "col2",
    columnTitle: "Col2",
    columnSubtitle: "ColSub2",
    items: [
      { id: "id2-1", title: "Elem one", variant: "default" },
      {
        id: "id2-2",
        title: "Elem two",
        subtitle: "(closed)",
        variant: "closed",
      },
      { id: "id2-3", title: "Elem three", variant: "default" },
    ],
  },
  {
    hasProgress: false,
    id: "col3",
    columnTitle: "Col3",
    columnSubtitle: "ColSub3",
    items: [
      { id: "id3-1", title: "Elem one", variant: "default" },
      {
        id: "id3-2",
        title: "Elem two",
        subtitle: "(available)",
        variant: "available",
      },
      { id: "id3-3", title: "Elem three", variant: "default" },
    ],
  },
  {
    hasProgress: false,
    id: "col4",
    columnTitle: "Col4",
    columnSubtitle: "ColSub4",
    items: [
      { id: "id4-1", title: "Elem one", variant: "default" },
      {
        id: "id4-2",
        title: "Elem two",
        subtitle: "(scheduled)",
        variant: "scheduled",
      },
      { id: "id4-3", title: "Elem three", variant: "default" },
    ],
  },
];

const DefaultStory = ({ ...args }) => {
  return <Grid {...args} />;
};

export const Default = DefaultStory.bind({});
Default.args = {
  columns: defaultItems,
};


export const Filled = ({...args}) => {
  const [state, dispatch] = React.useContext(GridContext);
  const [selectColumn, setSelectColumn] = useState('');

  function onColumnSelect(colId) {
    setSelectColumn(colId)
  }
  React.useEffect(() => {
    dispatch({
      payload: { columns: defaultItems },
      type: actions.LOAD_COLUMNS,
    });
    dispatch({
      payload: { onColumnSelect },
      type: actions.SET_ONCOLUMNSELECT,
    });
  }, [dispatch]);
  return <><Grid title="Checklist"/><div>event: selected col: {selectColumn} </div></>;
};

