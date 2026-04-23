import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/design-system";
import { TextInput } from "@/shared/design-system/ui/TextInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { signInSchema, type SignInValues } from "../authSchemas";

interface SignInFormProps {
  onSubmit: (values: SignInValues) => void;
  isLoading: boolean;
}

export function SignInForm({ onSubmit, isLoading }: SignInFormProps) {
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-6"
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-base-content/70 ml-1">
                  Email Address
                </FormLabel>
                <FormControl>
                  <TextInput
                    {...field}
                    type="email"
                    placeholder="example@mail.com"
                    leftIcon={<Mail size={18} />}
                    variant="bordered"
                    size="lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-base-content/70 ml-1">
                  Password
                </FormLabel>
                <FormControl>
                  <TextInput
                    {...field}
                    type="password"
                    placeholder="••••••••"
                    leftIcon={<Lock size={18} />}
                    variant="bordered"
                    size="lg"
                  />
                </FormControl>
                <FormMessage />
                <div className="flex justify-end mt-1">
                  <Link 
                    to="/forgot-password" 
                    className="text-xs font-medium text-primary hover:underline transition-all"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          height={56}
          pill={true}
          className="w-full text-lg font-semibold"
        >
          Login
        </Button>
      </form>
    </Form>
  );
}
