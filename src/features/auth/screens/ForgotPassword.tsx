import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Mail, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Button,
  Text,
  Header,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/design-system";
import { TextInput } from "@/shared/design-system/ui/TextInput";
import { useSignInAction } from "../hooks/useSignInAction";
import { ResetSuccessSheet } from "..";
import { resetPasswordSchema, type ResetPasswordValues } from "../authSchemas";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { onResetPassword, isSubmitting } = useSignInAction();
  const [isSuccessSheetOpen, setIsSuccessSheetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ResetPasswordValues) => {
    const success = await onResetPassword(values.email);
    if (success) {
      setResetEmail(values.email);
      setIsSuccessSheetOpen(true);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-base-100 overflow-hidden text-base-content">
      {/* Background Decorative Circles - Theme Aware */}
      <div className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] border border-base-content/5 rounded-full -translate-y-1/2 pointer-events-none z-0" />
      <div className="absolute top-[-220px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] border border-base-content/5 rounded-full -translate-y-1/2 pointer-events-none z-0" />
      <div className="absolute top-1/2 -right-24 w-64 h-64 bg-primary opacity-[0.06] rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-[-100px] -left-24 w-80 h-80 bg-primary opacity-[0.04] rounded-full blur-3xl pointer-events-none z-0" />

      {/* Subtle Dot Pattern */}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, var(--color-base-content) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Common Header */}
      <Header
        left={
          <button
            onClick={() => navigate("/signin")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-base-content/5 text-base-content transition-transform active:scale-90"
          >
            <ChevronLeft size={20} />
          </button>
        }
        title="Reset Password"
        className="bg-transparent"
      />

      <div className="relative z-10 flex-1 flex flex-col items-center px-6 pt-12 pb-20 gap-8">
        {/* Heading Section */}
        <div className="w-full max-w-[420px] text-center space-y-2 select-none z-10">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "tween",
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.1,
            }}
            className="text-base text-base-content/60 leading-relaxed "
          >
            No worries. Enter your email and we'll send you a recovery link to
            your inbox so you can safely reset your password.
          </motion.p>
        </div>

        <div className="relative z-10 w-full max-w-[420px]">
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
                          placeholder="example@mail.com"
                          leftIcon={<Mail size={18} />}
                          variant="bordered"
                          size="lg"
                          autoFocus
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                isLoading={isSubmitting}
                height={56}
                pill={true}
                className="w-full text-lg font-semibold"
              >
                <Sparkles size={18} className="mr-2" />
                Send Reset Link
              </Button>
            </form>
          </Form>
        </div>
      </div>

      <ResetSuccessSheet
        isOpen={isSuccessSheetOpen}
        onClose={() => {
          setIsSuccessSheetOpen(false);
          navigate("/signin");
        }}
        email={resetEmail}
      />
    </div>
  );
}
