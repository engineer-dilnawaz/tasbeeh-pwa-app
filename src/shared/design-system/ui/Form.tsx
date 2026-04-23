import { Squircle } from "corner-smoothing";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import * as React from "react";
import {
  Controller,
  FormProvider,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Text } from "./Text";

const Form = FormProvider;

import { FormFieldContext, FormItemContext, useFormField } from "./FormContext";

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  layout?: "vertical" | "horizontal";
}

const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, layout = "vertical", ...props }, ref) => {
    const id = React.useId();
    const isHorizontal = layout === "horizontal";

    return (
      <FormItemContext.Provider value={{ id }}>
        <div
          ref={ref}
          className={`flex ${
            isHorizontal
              ? "items-center justify-between gap-4"
              : "flex-col gap-1"
          } w-full ${className || ""}`}
          {...props}
        />
      </FormItemContext.Provider>
    );
  },
);
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }
>(({ className, required, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <label
      ref={ref}
      className={`text-[14px] font-semibold tracking-tight text-base-content ${className || ""}`}
      htmlFor={formItemId}
      {...props}
    >
      {props.children}
      {required && <span className="text-error ml-1">*</span>}
    </label>
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<any, React.HTMLAttributes<any>>(
  ({ children, ...props }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } =
      useFormField();

    if (!React.isValidElement(children)) {
      return <>{children}</>;
    }

    // eslint-disable-next-line react-hooks/refs
    return React.cloneElement(children as any, {
      ref,
      id: formItemId,
      "aria-describedby": !error
        ? `${formDescriptionId}`
        : `${formDescriptionId} ${formMessageId}`,
      "aria-invalid": !!error,
      ...props,
    });
  },
);
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  Omit<React.HTMLAttributes<HTMLParagraphElement>, "color" | "dir">
>(({ className, ...props }, ref) => {
  const { formDescriptionId, error } = useFormField();

  return (
    <AnimatePresence>
      {!error && props.children && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <motion.div
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            exit={{ y: -10 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="pt-1"
          >
            <Text
              ref={ref}
              id={formDescriptionId}
              variant="caption"
              color="subtle"
              className={className || ""}
              {...props}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  Omit<React.HTMLAttributes<HTMLParagraphElement>, "color" | "dir">
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  return (
    <AnimatePresence>
      {body && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <motion.div
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            exit={{ y: -10 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex items-start gap-1 pt-0.5"
          >
            <AlertCircle size={12} className="shrink-0 text-error mt-px" />
            <Text
              ref={ref}
              id={formMessageId}
              variant="caption"
              className={`text-error font-semibold text-[11px] leading-snug ${className || ""}`}
              {...props}
            >
              {body}
            </Text>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
FormMessage.displayName = "FormMessage";

// ── Form Group (iOS Style Container) ──

export interface FormGroupProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const FormGroup: React.FC<FormGroupProps> = ({
  title,
  description,
  children,
  className = "",
}) => {
  const childArray = React.Children.toArray(children);

  return (
    <div className={`flex flex-col gap-2 ${className} w-full`}>
      {(title || description) && (
        <div className="px-2 mb-1 flex flex-col gap-0.5">
          {title && (
            <Text
              variant="body"
              weight="semibold"
              className="text-base-content/60 text-xs uppercase tracking-widest pl-1"
            >
              {title}
            </Text>
          )}
          {description && (
            <Text variant="caption" color="subtle" className="pl-1">
              {description}
            </Text>
          )}
        </div>
      )}
      <Squircle
        cornerRadius={24}
        cornerSmoothing={0.8}
        className="bg-base-100 border border-base-content/5 flex flex-col"
      >
        {childArray.map((child, index) => (
          <React.Fragment key={index}>
            <div className="p-4">{child}</div>
            {index < childArray.length - 1 && (
              <div className="h-px bg-base-content/5 ml-4" />
            )}
          </React.Fragment>
        ))}
      </Squircle>
    </div>
  );
};

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormGroup,
  FormItem,
  FormLabel,
  FormMessage,
};
