import { useState } from "react";
import type { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import styles from "./Form.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

export function Input({ name, type = "text", ...rest }: InputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  
  const errorObj = errors[name];
  const errorMessage = errorObj?.message as string | undefined;

  return (
    <div className={styles.fieldGroup}>
      <div
        className={`${styles.inputWrapper} ${
          errorMessage ? styles.inputWrapperError : ""
        }`}
      >
        <input
          {...register(name)}
          id={name}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={styles.inputField}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.toggleBtn}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden" }}
          >
            <div className={styles.fieldError} role="alert">
              {errorMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
