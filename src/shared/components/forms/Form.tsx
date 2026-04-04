import type { ReactNode } from "react";
import { FormProvider } from "react-hook-form";
import type { UseFormReturn, FieldValues } from "react-hook-form";

interface FormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  children: ReactNode;
  className?: string;
  noValidate?: boolean;
}

/**
 * A centralized headless wrapper connecting the global React Hook Form context.
 * Enables inner components like <Input /> to access context seamlessly.
 */
export function Form<T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
  noValidate = true,
}: FormProps<T>) {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className} noValidate={noValidate}>
        {children}
      </form>
    </FormProvider>
  );
}
