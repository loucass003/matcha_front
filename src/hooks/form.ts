import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Validator } from "../validation/Validator";

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
  errorMessage: string;
}

type FormFieldsBinds<Rules> = {
  [K in keyof Rules]: FormFieldBind;
};

interface FormFieldBind {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
  helperText: string;
}

interface FormState {
  submited: boolean;
}

export function useForm<F extends FieldsRules>(
  rules: F,
  options: FormOptions<F> = { checkSubmitOnly: true }
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
          dirty: false,
        },
      }),
      {} as FormFieldsState<F>
    )
  );

  const updateFieldState = (
    fieldName: keyof F,
    value: string,
    checkError: boolean
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
              ...(checkError
                ? {
                    error: false,
                    errorMessage: "",
                  }
                : {}),
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
              ...(checkError
                ? {
                    error: true,
                    errorMessage: e.message,
                  }
                : {}),
            } as FormFieldState,
          } as FormFieldsState<F>)
      );
    }
  };

  useEffect(() => {
    const hasDefaults =
      options.defaults &&
      !!Object.keys(options.defaults).find(
        (name) => options.defaults && !!options.defaults[name]
      );

    Object.keys(rules).forEach((fieldName) => {
      updateFieldState(
        fieldName,
        fields[fieldName].value,
        hasDefaults || !options.checkSubmitOnly
      );
    });
  }, []);

  return {
    fields: Object.keys(rules).reduce(
      (fieldsState, fieldName) => ({
        ...fieldsState,
        [fieldName]: {
          onChange: (event: ChangeEvent<HTMLInputElement>) => {
            updateFieldState(
              fieldName,
              event.target.value,
              state.submited || !options.checkSubmitOnly
            );
          },
          value: fields[fieldName].value,
          error: fields[fieldName].error,
          helperText: fields[fieldName].errorMessage,
        } as FormFieldBind,
      }),
      {} as FormFieldsBinds<F>
    ),
    handleSubmit: (form: FormEvent) => {
      setFormState((prev) => ({ ...prev, submited: true }));
      Object.keys(rules).forEach((fieldName) => {
        updateFieldState(fieldName, fields[fieldName].value, true);
      });

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
