import { Avatar, Button, ButtonGroup, IconButton } from "@material-ui/core";
import { Close, MobileFriendly, PhoneAndroid } from "@material-ui/icons";
import { useFormikContext } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { FormBuilder } from ".";

const FormConsumer = (props) => {
  const formikObject = useFormikContext();
  const {
    values,
    initialValues,
    setValues,
    setFieldValue,
    ...formik
  } = formikObject;

  React.useEffect(() => {
    const dirty = formik.dirty;
    console.log("📢[index.stories.js:356]: ", values, formik?.errors);
  }, [formik.dirty, values, formik]);
  return null;
};

const FormBuilderStory = {
  component: FormBuilder,
  title: "Form/FormBuilder",
  argTypes: {
    variant: {
      control: {
        type: "select",
        toolTip: "select",
        options: ["filled", "standard", "outlined"],
      },
    },
    formFactor: {
      control: {
        type: "select",
        toolTip: "select",
        options: ["default", "card", "toolbar"],
      },
    },
  },
  parameters: {
    docs: {
      source: {
        type: "dynamic",
        toolTip: "dynamic",
      },
    },
  },
};

export default FormBuilderStory;

const DefaultStory = ({ ...args }) => (
  <FormBuilder {...args}>
    <FormConsumer />
  </FormBuilder>
);

export const Default = DefaultStory.bind({});
Default.args = {
  formInline: true,
  loading: false,
  formId: "default",
  reverse: true,
  formLabel: "primary",
  formReadOnly: false,
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
    ["plainComponent", "textOnly"],
    ["readOnly", "email"],
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
      toolTip: "component",
      component: () => <Avatar>H</Avatar>,
    },
    textOnly: {
      type: "textonly",
      toolTip: "textonly",
      label: "Text Only",
      text: "Text Only Value",
    },
    readOnly: {
      type: "text",
      toolTip: "text",
      label: "Read Only",
      initialValues: "not editable",
      validator: () => Yup.string(),

      readOnly: true,
    },
    firstName: {
      type: "text",
      toolTip: "text",
      label: "First Name",
      initialValues: "",

      validator: () => Yup.string(),
      fieldProps: {
        variant: "outlined",
      },
    },
    middleName: {
      type: "text",
      toolTip: "text",
      label: "Middle Name",
      initialValues: "",

      validator: () => Yup.string(),
    },
    lastName: {
      type: "text",
      toolTip: "text",
      label: "Last Name",
      initialValues: "",
      validator: () => Yup.string(),
    },
    multiLine: {
      type: "text",
      toolTip: "text",
      label: "Multi line",

      initialValues: "",
      validator: () => Yup.string(),
      fieldProps: {
        multiline: true,
        rowsMax: 4,
      },
    },
    email: {
      type: "email",
      toolTip: "email",
      label: "Email",
      initialValues: "",
      validator: () => Yup.string().email(),
    },
    aNumber: {
      type: "number",
      toolTip: "number",
      label: "A-Number",

      initialValues: 0,
      validator: () => Yup.number(),
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
        console.log("📢[index.stories.js:101]:", field, data, data);
      },
    },
    startTime: {
      type: "time",
      toolTip: "time",
      label: "Start-Time",
      initialValues: new Date("2021-06-10T12:00:00"),
      validator: () => Yup.date().required(),
      onChange: (field, data) => { },
    },
    selection: {
      type: "select",
      toolTip: "select",
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
      toolTip: "select",
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
      validator: () => Yup.array(), //required
    },
    autocomplete: {
      type: "autocomplete",
      toolTip: "autocomplete",
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
      validator: () => Yup.array(), //required
    },
    radio: {
      type: "radio",
      toolTip: "radio",
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

      validator: () => Yup.string(), //required
    },
    checkbox: {
      type: "checkbox",
      toolTip: "checkbox",
      label: "CheckBox",

      initialValues: false,
      settings: {
        labelField: "label",
        valueField: "id",
      },
      validator: () => Yup.bool(),
    },
    switch: {
      type: "switch",
      toolTip: "switch",
      label: "Switch",

      initialValues: false,
      settings: {
        labelField: "label",
        valueField: "id",
      },
      validator: () => Yup.bool(),
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
  formId: "modify",
};

export const Dates = DefaultStory.bind({});
Dates.args = {
  ...Default.args,
  formLayout: [
    ["date", "time"],
    ["datetime", "daterange"],
  ],
  form: {
    daterange: {
      type: "dateRange",
      toolTip: "dateRange",
      label: "Ranges",
      initialValues: {
        startDate: new Date("November 17, 2020 03:24:00"),
        endDate: new Date("December 17, 2020 07:24:00"),
      },
      validator: () =>
        Yup.object().shape({
          startDate: Yup.date(),
          endDate: Yup.date(),
        }), //required
    },
    date: {
      type: "date",
      toolTip: "date",
      label: "Date",
      disableFuture: true,
      disablePast: false,
      initialValues: "",
      useLocalTime: true,
      validator: () => Yup.date().required().nullable(),
      onChange: (field, data) => {
        console.log("📢[index.stories.js:101]:", field, data, data);
      },
    },
    time: {
      type: "time",
      toolTip: "time",
      label: "Time",
      initialValues: new Date("2021-06-10T12:00:00"),
      validator: () => Yup.date(),
      onChange: (field, data) => { },
    },
    datetime: {
      type: "datetime-local",
      toolTip: "datetime-local",
      label: "DateTime",
      initialValues: new Date("2021-06-10T12:00:00"),
      validator: () => Yup.date().required().nullable().max(new Date()),
      onChange: (field, data) => { },
    },
  },
  formId: "dates",
};

export const Phone = DefaultStory.bind({});
Phone.args = {
  ...Default.args,
  formLayout: [["phone", "fillPhone"]],
  form: {
    phone: {
      type: "phone",
      toolTip: "phone",
      label: "Phone",
      initialValues: "",
      validator: () =>
        Yup.string()
          .required()
          .nullable()
          .max(15)
          .matches(
            /^\+(63\d{10}|(?!63)\d{1,3}\d{10})$/,
            "invalid phone number format"
          )
          .label(" "),
      onChange: (field, data) => {
        console.log("📢[index.stories.js:101]:", field, data, data);
      },
      icon: <MobileFriendly />,
    },
    fillPhone: {
      type: "phone",
      toolTip: "phone",
      label: "Phone",
      initialValues: "+639166831131",
      validator: () =>
        Yup.string()
          .required()
          .nullable()
          .max(15)
          .matches(
            /^\+(63\d{10}|(?!63)\d{1,3}\d{10})$/,
            "invalid phone number format"
          )
          .label(" "),
      onChange: (field, data) => {
        console.log("📢[index.stories.js:101]:", field, data, data);
      },
      icon: <PhoneAndroid />,
    },
  },
  formId: "phone",
};

export const Checkboxes = DefaultStory.bind({});
Checkboxes.args = {
  ...Default.args,
  formLayout: ["checkboxes"],
  form: {
    checkboxes: {
      type: "checkboxes",
      toolTip: "checkboxes",
      label: "CheckBoxes",
      initialValues: ["2", "5"],
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
        labelPlacement: "end",
      },

      validator: () => Yup.array(), //required
    },
  },
  formId: "chkboxes",
};

export const DateRange = DefaultStory.bind({});
DateRange.args = {
  ...Default.args,
  formLayout: ["daterange"],
  form: {
    daterange: {
      type: "dateRange",
      toolTip: "dateRange",
      label: "Ranges",
      initialValues: {},
      validator: () =>
        Yup.object().shape({
          startDate: Yup.date(),
          endDate: Yup.date(),
        }), //required
    },
  },
  formId: "daterange",
};

export const Duration = DefaultStory.bind({});
Duration.args = {
  ...Default.args,
  formLayout: ["duration"],
  form: {
    duration: {
      type: "duration",
      toolTip: "duration",
      label: "Duration",
      initialValues: 60400,
      validator: () =>
        Yup.number().required().nullable()
    },
  },
  formId: "duration",
};

export const Persist = DefaultStory.bind({});
Persist.args = {
  ...Default.args,
  formId: "persist",
  usePersist: true,
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
            add
          </Button>
        </ButtonGroup>
      )}
    >
      <FormConsumer />
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
  formId: "decouple",
};

export const Reversed = DecoupleStory.bind({});
Reversed.args = {
  ...Default.args,
  formId: "reversed",
  reverse: true,
  additionalActions: () => { },
};

export const Nested = NestedStory.bind({});
Nested.args = {
  ...Default.args,
  formId: "nested",
  formReadOnly: false,
  formLayout: [["form1", "form2"], "subform"],
  form: {
    form1: {
      type: "text",
      toolTip: "text",
      label: "form 1",
      initialValues: "",
      forceColumnWidth: 6,
      validator: () => Yup.string().required(),
    },
    form2: {
      type: "text",
      toolTip: "text",
      label: "form 2",
      initialValues: "",
      validator: () => Yup.string().nullable(),
    },
    subform: {
      type: "fieldarray",
      toolTip: "fieldarray",
      label: "subform",
      inline: true,
      bordered: true,
      initialValues: [
        {
          subform1: "sf1",
          subform2: "sf2",
          subsubform: [
            {
              subsubform1: "ssf1",
            },
            {
              subsubform1: "ssf1-2",
            },
          ],
        },
      ],
      //note: only root level form nodes can have validation
      validator: () =>
        Yup.array().of(
          Yup.object().shape({
            subform1: Yup.string().nullable().required(),
            subform2: Yup.string().nullable().required(),
            subsubform: Yup.array().of(
              Yup.object().shape({
                subsubform1: Yup.array(),
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
          toolTip: "text",
          label: "subform 1",
          initialValues: "",
        },
        subform2: {
          type: "text",
          toolTip: "text",
          label: "subform 2",
          forceColumnWidth: 1,
          initialValues: "",
        },
        subsubform: {
          type: "fieldarray",
          toolTip: "fieldarray",
          label: "subsubform",
          inline: true,
          formLayout: ["subsubform1"],
          formValueTemplate: {
            subsubform1: ``,
          },
          formTemplate: {
            subsubform1: {
              type: "text",
              toolTip: "text",
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


const WizardStory = ({ ...args }) => {

}

export const Wizard = DefaultStory.bind({})
Wizard.args = {
  ...Default.args,
  formId: "nested",
  formLayout: ["questions"],
  form: {
    questions: {
      "type": "wizardFieldArray",
      "label": "Question",
      "stepVariant": "text",
      "inline": true,
      "stepperProps": {
          color: 'default',
          progressColor: 'secondary',
          prefix: 'Question',
          isDense: true,
      },
      "formLayout": [
        "6",
        "7",
        "8"
      ],
      "formValueTemplate": {
        "6": "",
        "7": "",
        "8": ""
      },
      "formTemplate": {
        "6": {
          type: "radio",
          toolTip: "radio",
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
        },
        "7": {
          "type": "radio",
          "initialValues": "",
          "label": "Odio sit accusantium et aut ea. Dolores officia ducimus. Dolor dolore reprehenderit vitae et. Ut atque voluptatem labore quos. Reprehenderit officia esse modi laboriosam ad ad qui. Dolor at eveniet odit.",
          "options": [
            {
              "label": "ut sunt dolor",
              "id": 38
            },
            {
              "label": "nobis quia officia",
              "id": 36
            },
            {
              "label": "omnis quasi minus",
              "id": 35
            },
            {
              "label": "eum sapiente voluptatibus",
              "id": 37
            }
          ],
          "settings": {
            "labelField": "label",
            "valueField": "id",
            "inline": false
          }
        },
        "8": {
          "type": "radio",
          "initialValues": "",
          "label": "Dolorem aut eos minus perspiciatis quaerat. Alias eligendi maxime voluptatum dolorem enim harum enim deserunt ex. Sit et modi laboriosam sunt eius. Beatae rerum in nihil voluptatibus est natus quo quis incidunt.",
          "options": [
            {
              "label": "Kansas",
              "id": 32
            },
            {
              "label": "animi nihil reprehenderit",
              "id": 33
            },
            {
              "label": "sunt voluptatem vel",
              "id": 34
            }
          ],
          "settings": {
            "labelField": "label",
            "valueField": "id",
            "inline": false
          }
        }
      },
      "initialValues": [
        {
          "6": "",
          "7": "",
          "8": ""
        }
      ],
      "form": []
    },
  },

}