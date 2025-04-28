import { checkTouched, checkValidation, inputHelper } from "@/app/helpers";
import React, { useEffect, useState } from "react";
import { FormManagerProps, Values } from "./types";

const FormManager = ({
  initialValues,
  children,
  yupSchema,
  onSubmit,
}: FormManagerProps) => {
  let initialTouchValue: any = {};
  Object.keys(initialValues).map((x) => {
    initialTouchValue[x] = false;
  });

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const [values, setValues] = useState({ ...initialValues });
  const [errors, setErrors] = useState({ ...initialValues });
  const [submitDisable, setSubmitDisable] = useState(false);
  const [touched, setTouched] = useState(initialTouchValue);

  const handleBlur = async (e: React.FocusEvent<any>) => {
    const tempTouched = checkTouched(touched, e);
    const tempErrors = await checkValidation(yupSchema, { ...values });
    const tempInitialValues: any = {};
    Object.keys(initialValues).map((item) => {
      if (Number.isInteger(initialTouchValue && initialTouchValue[item]))
        tempInitialValues[item] = "";
      else tempInitialValues[item] = "";
    });
    setErrors(tempErrors ?? { ...tempInitialValues });
    setSubmitDisable(tempErrors ? true : false);
    setTouched(tempTouched);
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    const tempData = inputHelper({ ...values }, e);
    const tempData2 = inputHelper({ ...values }, e);
    const tempErrors = checkValidation(yupSchema, tempData2);
    setSubmitDisable(tempErrors ? true : false);
    const tempInitialValues: any = {};
    Object.keys(initialValues).map((item) => {
      if (Number.isInteger(initialTouchValue && initialTouchValue[item]))
        tempInitialValues[item] = "";
      else tempInitialValues[item] = "";
    });
    setErrors(tempErrors ?? { ...tempInitialValues });
    setValues(tempData);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const tempErrors = checkValidation(yupSchema, values);
    const touchedTrue: any = {};
    Object.keys(initialValues).map((x) => {
      touchedTrue[x] = true;
    });
    setTouched(touchedTrue);
    const tempInitialValues: any = {};
    Object.keys(initialValues).map((item) => {
      if (Number.isInteger(initialTouchValue && initialTouchValue[item]))
        tempInitialValues[item] = "";
      else tempInitialValues[item] = "";
    });
    setErrors(tempErrors ?? { ...tempInitialValues });
    setSubmitDisable(tempErrors ? true : false);
    if (!tempErrors) {
      onSubmit(values);
    }
  };

  return (
    <form method="post" onSubmit={handleSubmit}>
      {children({
        errors,
        handleBlur,
        handleChange,
        touched,
        values,
        submitDisable,
      })}
    </form>
  );
};

export default FormManager;
