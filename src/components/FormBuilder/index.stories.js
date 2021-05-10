import React from "react";
import * as Yup from "yup";

import { action, actions } from "@storybook/addon-actions";
import { FormBuilder } from ".";
import { min } from "moment";

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
  formLabel: "Form Label",
  submitLabel: "Submit",
  resetLabel: "Reset",
  columns: 2,
  formFactor: "card",
  form: {
    name: {
      type: "text",
      label: "Name",
      initialValues: "",
      validator: () => Yup.string().required(),
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
      validator: () => Yup.date().max(new Date()),
    },
    startTime: {
      type: "time",
      label: "Start-Time",

      disableFuture: false,
      disablePast: true,
      initialValues: new Date(),
      validator: () => Yup.date().min(new Date()),
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
      validator: () => Yup.boolean()
    },
    switch: {
      type: "switch",
      label: "Switch",

      initialValues: false,
      settings: {
        labelField: "label",
        valueField: "id",
      },
      validator: () => Yup.boolean()
    },
  },
  onSubmit: (values) => {
    console.log("📢[index.stories.js:113]:", values);
    alert(`${JSON.stringify(values, null, 2)}`);
  },
};
