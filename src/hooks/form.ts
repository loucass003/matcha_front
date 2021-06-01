import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ValidationError } from "../commons/validation/ValidationError";
import { Validator } from "../commons/validation/Validator";

type GetValidatorOutput<T> = T extends Validator<string, infer R> ? R : any;
type GetRulesOutput<T> = { [K in keyof T]: GetValidatorOutput<T[K]> };
type DefaultValue<T> = { [K in keyof T]?: GetValidatorOutput<T[K]> };

type PramFieldsRules<Rules> = {
  [K in keyof Rules]: Validator<any, GetValidatorOutput<Rules[K]>>;
};

type FieldRule<Rules> =
  | Validator<string, any>
  | ((
      value: string,
      fields: PramFieldsRules<Rules>,
      values: GetRulesOutput<Rules>
    ) => Validator<any, any>);

interface FieldsRules {
  [key: string]: FieldRule<this>;
}

interface FormOptions<Rules> {
  checkSubmitOnly?: boolean;
  checkOnLoad?: boolean;
  onSubmit?: (values: GetRulesOutput<Rules>) => void;
  onError?: (
    errors: Record<keyof Rules, string | null>,
    values: GetRulesOutput<Rules>
  ) => void;
  defaults?: DefaultValue<Rules>;
}

type FormFieldsState<Rules> = {
  [K in keyof Rules]: FormFieldState;
};

interface FormFieldState {
  dirty: boolean;
  value: string;
  error: boolean;
  detail: ValidationError;
  errorMessage: string;
}

type FormFieldsBinds<Rules> = {
  [K in keyof Rules]: FormFieldBind;
};

export interface FormFieldBind {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
  detail: ValidationError;
  helperText: string;
  dirty: boolean;
}

interface FormState {
  submited: boolean;
}

export function useForm<F extends FieldsRules>(
  rules: F,
  options: FormOptions<F> = { checkSubmitOnly: true, checkOnLoad: false }
) {
  const [state, setFormState] = useState<FormState>({ submited: false });

  const isFieldRule = (name: keyof F) =>
    !!(rules[name] as Validator<any, any>).and;
  const fieldsRules = Object.keys(rules).filter((name) => isFieldRule(name));

  const [fields, setFieldsState] = useState<FormFieldsState<F>>(
    Object.keys(rules).reduce(
      (fieldsState, fieldName) => ({
        ...fieldsState,
        [fieldName]: {
          value: (options.defaults && options.defaults[fieldName]) || "",
          error: false,
          heperText: "",
          dirty: options.checkOnLoad,
        },
      }),
      {} as FormFieldsState<F>
    )
  );

  const updateFieldState = (
    fieldName: keyof F,
    value: string,
    markDirty: boolean
  ) => {
    const values = Object.values(fieldsRules).reduce(
      (v, name) => ({
        ...v,
        [name]: (fields[name] && fields[name].value) || null,
      }),
      {} as GetRulesOutput<F>
    );
    try {
      const validator = (rules[fieldName] as Validator<any, any>).and
        ? (rules[fieldName] as Validator<any, any>)(value)
        : rules[fieldName](value, rules as PramFieldsRules<F>, values)(value);

      setFieldsState(
        (prevFields) =>
          ({
            ...prevFields,
            [fieldName]: {
              ...prevFields[fieldName],
              value: validator,
              dirty: markDirty,
              error: false,
              errorMessage: "",
            } as FormFieldState,
          } as FormFieldsState<F>)
      );
    } catch (e) {
      setFieldsState(
        (prevFields) =>
          ({
            ...prevFields,
            [fieldName]: {
              ...prevFields[fieldName],
              value,
              dirty: markDirty,
              error: true,
              detail: e,
              errorMessage: e.message,
            } as FormFieldState,
          } as FormFieldsState<F>)
      );
    }
  };

  useEffect(() => {
    Object.keys(rules).forEach((fieldName) => {
      updateFieldState(fieldName, fields[fieldName].value, false);
    });
  }, []);

  const canShowErrors = (field: FormFieldState) =>
    state.submited || (!options.checkSubmitOnly && field.error && field.dirty);

  return {
    fields: Object.keys(rules).reduce(
      (fieldsState, fieldName) => ({
        ...fieldsState,
        [fieldName]: {
          onChange: (event: ChangeEvent<HTMLInputElement>) => {
            updateFieldState(fieldName, event.target.value, true);
          },
          value: fields[fieldName].value,
          error: canShowErrors(fields[fieldName]) && fields[fieldName].error,
          helperText:
            canShowErrors(fields[fieldName]) && fields[fieldName].errorMessage,
          detail: fields[fieldName].detail,
        } as FormFieldBind,
      }),
      {} as FormFieldsBinds<F>
    ),
    handleSubmit: (form: FormEvent) => {
      setFormState((prev) => ({ ...prev, submited: true }));

      const errors = Object.keys(rules).reduce(
        (e, fieldName) => ({
          ...e,
          [fieldName]:
            (fields[fieldName].error && fields[fieldName].errorMessage) || null,
        }),
        {} as Record<keyof F, string | null>
      );
      const values = Object.keys(rules).reduce(
        (v, fieldName) => ({
          ...v,
          [fieldName]: fields[fieldName].value,
        }),
        {} as GetRulesOutput<F>
      );
      const hasErrors = !!Object.values(errors).find((v) => !!v);

      if (options.onSubmit && !hasErrors) options.onSubmit(values);
      if (options.onError && hasErrors) options.onError(errors, values);
      form.preventDefault();
    },
  };
}
