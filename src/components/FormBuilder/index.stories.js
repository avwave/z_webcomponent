import React, { useState } from "react";
import * as Yup from "yup";

import { action, actions } from "@storybook/addon-actions";
import { FormBuilder } from ".";
import { min } from "moment";
import {
  Avatar,
  Button,
  ButtonGroup,
  Card,
  IconButton,
  ListItemText,
} from "@material-ui/core";
import { AccountTree, Close } from "@material-ui/icons";
import { useFormikContext } from "formik";

const FormBuilderStory = {
  component: FormBuilder,
  title: "Form/FormBuilder",
  argTypes: {
    variant: {
      control: {
        type: "select",
        options: ["filled", "standard", "outlined"],
      },
    },
    formFactor: {
      control: {
        type: "select",
        options: ["default", "card", "toolbar"],
      },
    },
  },
  parameters: {
    docs: {
      source: {
        type: "dynamic",
      },
    },
  },
};

export default FormBuilderStory;

const DefaultStory = ({ ...args }) => <FormBuilder {...args} />;

export const Default = DefaultStory.bind({});
Default.args = {
  onChange:(values)=>{console.log(values)},
  formId:'default',
  reverse: true,
  formLabel: "primary",
  formSubtitle: "secondary",
  submitLabel: "Submit",
  resetLabel: "Reset",
  columns: 2,
  formFactor: "card",
  hasReset: true,
  additionalActions: () => (
    <ButtonGroup variant="text">
      <Button>CloseAction</Button>
      <IconButton>
        <Close />
      </IconButton>
    </ButtonGroup>
  ),
  formLayout: [
    ["plainComponent", "readOnly", "email"],
    ["firstName", "middleName", "lastName"],
    ["startDate", "startTime"],
    "aNumber",
    ["selection", "multipleSelection"],
    "autocomplete",
    ["radio", "checkbox", "switch"],
    "multiLine",
  ],
  form: {
    plainComponent: {
      type: "component",
      component: () => <Avatar>H</Avatar>,
    },
    readOnly: {
      type: "text",
      label: "Read Only",
      initialValues: "not editable",
      validator: () => Yup.string().required(),

      readOnly: true,
    },
    firstName: {
      type: "text",
      label: "First Name",
      initialValues: "",

      validator: () => Yup.string().required(),
      fieldProps: {
        variant: "outlined",
      },
    },
    middleName: {
      type: "text",
      label: "Middle Name",
      initialValues: "",

      validator: () => Yup.string().required(),
    },
    lastName: {
      type: "text",
      label: "Last Name",
      initialValues: "",
      validator: () => Yup.string().required(),
    },
    multiLine: {
      type: "text",
      label: "Multi line",

      initialValues: "",
      validator: () => Yup.string().required(),
      fieldProps: {
        multiline: true,
        rowsMax: 4,
      },
    },
    email: {
      type: "email",
      label: "Email",
      initialValues: "",
      validator: () => Yup.string().email().required(),
      hidden: true,
    },
    aNumber: {
      type: "number",
      label: "A-Number",

      initialValues: 0,
      validator: () => Yup.number().required(),
    },
    startDate: {
      type: "date",
      label: "Start-Date",

      disableFuture: true,
      disablePast: false,
      initialValues: new Date(),
      useLocalTime: true,
      validator: () => Yup.date().max(new Date()),
      onChange: (field, data) => {
        console.log("📢[index.stories.js:101]:", field, data, data.toDate());
      },
    },
    startTime: {
      type: "time",
      label: "Start-Time",

      disableFuture: false,
      disablePast: true,
      initialValues: new Date(),
      useLocalTime: true,
      validator: () => Yup.date().required(),
      onChange: (field, data) => {},
    },
    selection: {
      type: "select",
      label: "Selection",

      initialValues: "",
      options: [
        { value: 10, label: "Thing one" },
        { value: 11, label: "Thing two" },
        { value: 12, label: "Thing three" },
      ],
      settings: {
        default: "",
        multiple: false,
        labelField: "label",
        valueField: "value",
      },
      validator: () => Yup.number().required(), //required
    },
    multipleSelection: {
      type: "select",
      label: "Multiple Selection",

      initialValues: [],
      options: [
        { id: "10", label: "Thing one" },
        { id: "11", label: "Thing two" },
        { id: "12", label: "Thing three" },
      ],
      settings: {
        default: "",
        multiple: true,
        labelField: "label",
        valueField: "id",
      },
      onChange: (fieldName, event) => {
        console.log("📢[index.stories.js:150]:", fieldName, event);
      },
      validator: () => Yup.array().min(1), //required
    },
    autocomplete: {
      type: "autocomplete",
      label: "Autocomplete",

      initialValues: [],
      options: [
        { id: 101, label: "one" },
        { id: 102, label: "two" },
        { id: 103, label: "three" },
        { id: 104, label: "four" },
        { id: 5, label: "five" },
        { id: 6, label: "six" },
      ],
      settings: {
        default: "",
        multiple: true,
        labelField: "label",
        valueField: "id",
      },
      validator: () => Yup.array().min(1), //required
    },
    radio: {
      type: "radio",
      label: "Radio",

      initialValues: "",
      options: [
        { id: "1", label: "one" },
        { id: "2", label: "two" },
        { id: "3", label: "three" },
        { id: "4", label: "four" },
        { id: "5", label: "five" },
        { id: "6", label: "six" },
      ],
      settings: {
        labelField: "label",
        valueField: "id",
        inline: true,
      },

      validator: () => Yup.string().required(), //required
    },
    checkbox: {
      type: "checkbox",
      label: "CheckBox",

      initialValues: false,
      settings: {
        labelField: "label",
        valueField: "id",
      },
      validator: () => Yup.bool().oneOf([true]),
    },
    switch: {
      type: "switch",
      label: "Switch",

      initialValues: false,
      settings: {
        labelField: "label",
        valueField: "id",
      },
      validator: () => Yup.bool().oneOf([true]),
    },
  },
  onSubmit: (values) => {
    console.log("📢[index.stories.js:113]:", values);
    alert(`${JSON.stringify(values, null, 2)}`);
  },
};

const ModifyStory = ({ ...args }) => {
  const [formState, setFormState] = useState({});

  return (
    <FormBuilder
      {...args}
      setValues={formState}
      additionalActions={() => (
        <ButtonGroup variant="text">
          <Button
            onClick={() =>
              setFormState({
                firstName: "STEEL RAIN",
                autocomplete: [
                  { id: 3, label: "three" },

                  { id: 5, label: "five" },
                ],
              })
            }
          >
            Modify
          </Button>
        </ButtonGroup>
      )}
    />
  );
};

export const Modify = ModifyStory.bind({});
Modify.args = {
  ...Default.args,
  formId:'modify',
};

export const Checkboxes = DefaultStory.bind({});
Checkboxes.args = {
  ...Default.args,
  formLayout: [
    "checkboxes"
  ],
  form: {
    checkboxes: {
      type: "checkboxes",
      label: "CheckBoxes",
      initialValues: ['2', '5'],
      options: [
        { id: "1", label: "one" },
        { id: "2", label: "two" },
        { id: "3", label: "three" },
        { id: "4", label: "four" },
        { id: "5", label: "five" },
        { id: "6", label: "six" },
      ],
      settings: {
        labelField: "label",
        valueField: "id",
        inline: true,
        labelPlacement: 'end'
      },

      validator: () => Yup.array(), //required
    },
  },
  formId:'chkboxes',
  
};

export const Persist = DefaultStory.bind({});
Persist.args = {
  ...Default.args,
  formId:'persist',
  usePersist: true
};

const FormConsumer = (props) => {
  const formikObject = useFormikContext();
  const {values, initialValues, setValues, setFieldValue, ...formik} = formikObject

  React.useEffect(() => {
      const dirty = formik.dirty
      console.log("📢[index.stories.js:356]: ", values, formik);
  }, [formik.dirty, values, formik]);
  return null;
};

const NestedStory = ({ ...args }) => {
  const [formState, setFormState] = useState({});

  return (
    <FormBuilder
      {...args}
      setValues={formState}
      additionalActions={() => (
        <ButtonGroup variant="text">
          <Button
            onClick={() =>
              setFormState({
                firstName: "STEEL RAIN",
                autocomplete: [
                  { id: 3, label: "three" },

                  { id: 5, label: "five" },
                ],
              })
            }
          >
            Nested
          </Button>
        </ButtonGroup>
      )}
    >
      <FormConsumer/>
    </FormBuilder>
  );
};

const DecoupleStory = ({ ...args }) => {
  const [triggerSubmit, setTriggerSubmit] = useState(false);
  const [triggerReset, setTriggerReset] = useState(false);

  return (
    <>
      <FormBuilder
        {...args}
        triggerReset={triggerReset}
        triggerSubmit={triggerSubmit}
        onTriggerReset={() => setTriggerReset(false)}
        onTriggerSubmit={() => setTriggerSubmit(false)}
      />
      <ButtonGroup>
        <Button onClick={() => setTriggerSubmit(true)}>Trigger Submit</Button>
        <Button onClick={() => setTriggerReset(true)}>Trigger Reset</Button>
      </ButtonGroup>
    </>
  );
};

export const Decouple = DecoupleStory.bind({});
Decouple.args = {
  ...Default.args,
  decouple: true,
  formId:'decouple',
};

export const Reversed = DecoupleStory.bind({});
Reversed.args = {
  ...Default.args,
  formId:'reversed',
  reverse: true,
  additionalActions: () => {},
};

export const Nested = NestedStory.bind({});
Nested.args = {
  ...Default.args,
  formId:'nested',
  formLayout: [["form1", "form2"], "subform"],
  form: {
    form1: {
      type: "text",
      label: "form 1",
      initialValues: "",
      validator: () => Yup.string().nullable().required(),
    },
    form2: {
      type: "text",
      label: "form 2",
      initialValues: "",
      validator: () => Yup.string().nullable().required(),
    },
    subform: {
      type: "fieldarray",
      label: "subform",
      //note: only root level form nodes can have validation
      validator: () =>
        Yup.array().required().nullable().min(1).of(
          Yup.object().shape({
            subform1: Yup.string().nullable().required(),
            subform2: Yup.string().nullable().required(),
            subsubform: Yup.array().min(1).of(
              Yup.object().shape({
                subsubform1: Yup.array().min(1).required(),
              })
            ),
          })
        ),
      formLayout: ["subform1", ["subform2", "subsubform"]],
      formValueTemplate: {
        subform1: ``,
        subform2: ``,
        subsubform: [],
      },
      formTemplate: {
        subform1: {
          type: "text",
          label: "subform 1",
          initialValues: "",
        },
        subform2: {
          type: "text",
          label: "subform 2",
          initialValues: "",
        },
        subsubform: {
          type: "fieldarray",
          label: "subsubform",
          inline: true,
          formLayout: ["subsubform1"],
          formValueTemplate: {
            subsubform1: ``,
          },
          formTemplate: {
            subsubform1: {
              type: "text",
              label: "subsubform 1",
              initialValues: "",
            },
          },
          form: [],
        },
      },
      form: [],
    },
  },
};
