export interface TasbeehFormValues {
  title: string;
  target: number;
}

export interface TasbeehFormProps {
  initialValues?: TasbeehFormValues;
  onSubmit: (values: TasbeehFormValues) => void;
  onCancel?: () => void;
}
