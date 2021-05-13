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
import { Close } from "@material-ui/icons";

const FormBuilderStory = {
  component: FormBuilder,
  title: "Form/FormBuilder",
  argTypes: {
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
  formLabel: "primary",
  formSubtitle: "secondary",
  submitLabel: "Submit",
  resetLabel: "Reset",
  columns: 2,
  formFactor: "card",
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
        variant: "standard",
      },
    },
    email: {
      type: "email",
      label: "Email",
      initialValues: "",
      validator: () => Yup.string().email().required(),
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
        { value: 0, label: "Thing one" },
        { value: 1, label: "Thing two" },
        { value: 2, label: "Thing three" },
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
        { id: "0", label: "Thing one" },
        { id: "1", label: "Thing two" },
        { id: "2", label: "Thing three" },
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
        { id: 1, label: "one" },
        { id: 2, label: "two" },
        { id: 3, label: "three" },
        { id: 4, label: "four" },
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
      validator: () => Yup.boolean(),
    },
    switch: {
      type: "switch",
      label: "Switch",

      initialValues: false,
      settings: {
        labelField: "label",
        valueField: "id",
      },
      validator: () => Yup.boolean(),
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
    ></FormBuilder>
  );
};

export const Nested = NestedStory.bind({});
Nested.args = {
  ...Default.args,
  formLayout: [["form1", "form2"], "subform"],
  form: {
    form1: {
      type: "text",
      label: "form 1",
      initialValues: "a",
      validator: () => Yup.string().nullable().required(),
    },
    form2: {
      type: "text",
      label: "form 2",
      initialValues: "b",
      validator: () => Yup.string().nullable().required(),
    },
    subform: {
      type: "fieldarray",
      label: "subform",
      validator: () =>
        Yup.array().of(
          Yup.object().shape({
            subform1: Yup.string().nullable().required(),
            subform2: Yup.string().nullable().required(),
            subsubform: Yup.array().of(
              Yup.object().shape({
                subsubform1: Yup.string().nullable().required(),
              })
            ),
          })
        ),
      formLayout: [["subform1", "subform2"], "subsubform"],
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
