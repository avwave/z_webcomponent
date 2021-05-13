import React, { useCallback, useContext, useEffect, useState } from "react";
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
import { FormFieldSet } from "./FormBuilder";
import { FormContext, generateValidation } from "./index";
import { withReactContext } from "storybook-react-context";

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
  // decorators: [
  //   withReactContext({
  //     context: FormContext,
  //   }),
  //   (Story) => (
  //     <FormContext.Provider>
  //       <Story />
  //     </FormContext.Provider>
  //   ),
  // ],
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

export function useForceUpdate() {
  const [, setTick] = useState(0);
  const update = useCallback(() => {
    setTick((tick) => tick + 1);
  }, []);
  return update;
}

const NestedStory = ({ ...args }) => {
  const forceUpdate = useForceUpdate();
  const [formState, setFormState] = useState({});

  const [additionalInitial, setAdditionalInitial] = useState();

  const [subForm, setSubForm] = useState(args.subForm);
  const [subformInitialValues, setSubformInitialValues] = useState(
    args.subformInitialValues
  );

  const [subformValidator, setSubformValidator] = useState(
    args.subformValidator
  );

  useEffect(() => {
    setAdditionalInitial(subformInitialValues);
  }, [subformInitialValues]);

  function addSubForm() {
    const subFormXField1 = `subform[${subForm.length}].formfield1`;
    const subFormXField2 = `subform[${subForm.length}].formfield2`;

    setSubForm([
      ...subForm,
      {
        layout: [subFormXField1, subFormXField2],
        form: {
          [subFormXField1]: {
            type: "text",
            label: subFormXField1,
            initialValues: "",
          },
          [subFormXField2]: {
            type: "text",
            label: subFormXField2,
            initialValues: "",
          },
        },
      },
    ]);

    setSubformInitialValues({
      subform: [
        ...subformInitialValues.subform,
        { formfield1: "", formfield2: "" },
      ],
    });
  }

  function addSubSubForm(id) {
    console.log("📢[index.stories.js:351]:addsubsubform", id, subForm);
    const mappedForm = subForm.map((subform, idx) => {
      if (!subform) return undefined;
      const targetSubform = subform.form[`subform[${id}].formfield1`];
      if (targetSubform) {
        console.log("📢[index.stories.js:354]:newsubsubform", subform);
        const subsubformlength = subform?.form?.subform?.length ?? 0;
        const newSubSubform = {
          form: {
            [`subform[${id}].subsubform[${subsubformlength}].subsubform1`]: {
              type: "text",
              label: `subform[${id}].subsubform[${subsubformlength}].subsubform1`,
              initialValues: "",
            },
            [`subform[${id}].subsubform[${subsubformlength}].subsubform2`]: {
              type: "text",
              label: `subform[${id}].subsubform[${subsubformlength}].subsubform2`,
              initialValues: "",
            },
          },
          layout: [
            `subform[${id}].subsubform[${subsubformlength}].subsubform1`,
            `subform[${id}].subsubform[${subsubformlength}].subsubform2`,
          ],
        };
        const newSubform = {
          ...subform,
          form: {
            ...(subform?.form ?? {}),
            subform: [...(subform?.form?.subform ?? []), newSubSubform],
          },
        };
        console.log("📢[index.stories.js:367]:", newSubform);
        return newSubform;
      }
      console.log("returning base form", subform);
      return {
        ...subform,
      };
    });

    console.log("📢[index.stories.js:391]:", mappedForm);
    setSubForm(mappedForm);
  }

  function removeSubForm(id) {
    let subFormSplice = subForm;
    delete subFormSplice[id];
    setSubForm(subFormSplice);
    let subformInitialValuesSplice = subformInitialValues.subform;
    delete subformInitialValues[id];
    setSubformInitialValues({
      subform: subformInitialValuesSplice,
    });
  }

  function removeSubSubForm(parentId, id) {
    console.log("📢[index.stories.js:408]:", subForm, parentId, id);
    let newSubForm = subForm;
    delete newSubForm[parentId].form.subform[id];
    setSubForm(newSubForm);
    forceUpdate();
  }

  console.log("📢[index.stories.js:329]:", subForm, subformValidator);
  return (
    <FormBuilder
      {...args}
      additionalValidation={subformValidator}
      additionalInitial={additionalInitial}
      setValues={formState}
      onSubmit={(values) => {
        //remove spliced subform elements from formik final value array
        let filteredValues = values;
        filteredValues.subform = filteredValues.subform.filter((sf, idx) => {
          return subForm[idx] !== undefined;
        });
        alert(`${JSON.stringify(filteredValues, null, 2)}`);
      }}
      additionalActions={() => (
        <ButtonGroup variant="text">
          <Button onClick={() => addSubForm()}>Add</Button>
        </ButtonGroup>
      )}
    >
      <Card>
        {subForm.map((i, idx) => {
          if (!i) {
            return <React.Fragment key={idx} />;
          }
          console.log("📢[index.stories.js:437]:", i);
          const { subform, subformLayout, ...subformform } = i.form;
          console.log(
            "📢[index.stories.js:434]:",
            subform,
            subformLayout,
            subformform
          );
          return !!subformform ? (
            <FormFieldSet
              formLabel="subform"
              fieldArray="subform"
              key={`subform-${idx}`}
              formLayout={i.layout}
              form={subformform}
              formFactor="toolbar"
              setValues={formState}
              additionalActions={() => (
                <ButtonGroup variant="text">
                  <Button onClick={() => removeSubForm(idx)}>Remove</Button>
                  <Button onClick={() => addSubSubForm(idx)}>Add</Button>
                </ButtonGroup>
              )}
            >
              {(subform ?? []).map((x, subidx) => {
                if (!x) {
                  return <React.Fragment key={idx} />;
                }
                return (
                  <FormFieldSet
                    formLabel="subsubform"
                    fieldArray={`subform[${idx}].subform`}
                    key={`subform-${idx}-subsubform-${subidx}`}
                    formLayout={x.layout}
                    form={x.form}
                    formFactor="toolbar"
                    additionalActions={() => (
                      <ButtonGroup variant="text">
                        <Button onClick={() => removeSubSubForm(idx, subidx)}>
                          Remove
                        </Button>
                      </ButtonGroup>
                    )}
                  />
                );
              })}
            </FormFieldSet>
          ) : (
            <React.Fragment key={`subform-${idx}`} />
          );
        })}
      </Card>
    </FormBuilder>
  );
};

export const Nested = NestedStory.bind({});
Nested.args = {
  ...Default.args,

  subformInitialValues: {
    subform: [],
  },
  subformValidator: {
    subform: Yup.array().of(
      Yup.object().shape({
        formfield1: Yup.string().nullable().required(),
        formfield2: Yup.string().nullable().required(),
      })
    ),
  },
  subForm: [],
  formLayout: ["form1", "form2"],
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
  },
};
