import { FormFieldBind } from "../../hooks/form";

interface FormFieldDetailsProps {
  field: FormFieldBind;
}

export function FormFieldDetails({ field }: FormFieldDetailsProps) {
  return (
    <span>
      {field.error &&
        Array.isArray(field.detail.reasons) &&
        field.detail.reasons.map(({ text }) => <li key={text}>{text}</li>)}
    </span>
  );
}
