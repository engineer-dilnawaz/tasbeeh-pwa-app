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
import { Lock, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { signUpSchema, type SignUpValues } from "../authSchemas";

interface SignUpFormProps {
  onSubmit: (values: SignUpValues) => void;
  isLoading: boolean;
}

export function SignUpForm({ onSubmit, isLoading }: SignUpFormProps) {
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-base-content/70 ml-1">
                  Full Name
                </FormLabel>
                <FormControl>
                  <TextInput
                    {...field}
                    placeholder="Dilnawaz Khan"
                    leftIcon={<User size={18} />}
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
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-base-content/70 ml-1">
                  Confirm Password
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
          Register
        </Button>
      </form>
    </Form>
  );
}
