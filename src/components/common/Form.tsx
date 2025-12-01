"use client";
import {
  DefaultValues,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";

type FormProps<TFormValues extends Record<string, unknown>> = {
  onSubmit: SubmitHandler<TFormValues>;
  className?: string;
  children: (
    methods: UseFormReturn<TFormValues>
  ) => React.ReactNode | React.ReactNode[];
  data?: DefaultValues<TFormValues>;
};

const Form = <
  TFormValues extends Record<string, unknown> = Record<string, unknown>
>({
  onSubmit,
  children,
  className,
  data,
}: FormProps<TFormValues>) => {
  const methods = useForm<TFormValues>({
    defaultValues: data,
  });
  return (
    <form onSubmit={methods.handleSubmit(onSubmit)} className={className}>
      {children(methods)}
    </form>
  );
};

export default Form;
