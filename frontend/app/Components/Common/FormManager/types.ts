import React, { JSX } from "react";
import { AnyObjectSchema } from "yup";
export interface FormManagerProps {
  children: (arg0: childrenProps) => JSX.Element | JSX.Element[];
  initialValues: Values;
  yupSchema: AnyObjectSchema;
  onSubmit: (values: Values) => void | Promise<any>;
}

interface childrenProps {
  handleBlur: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;

  values: Values;
  errors: Values;
  touched: Values;
  submitDisable: boolean;
}
export interface Values {
  [field: string]: any;
}
