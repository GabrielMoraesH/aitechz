import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps } from "react";

import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "outline" | "light";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function buttonStyles(variant: ButtonVariant = "primary") {
  return `${styles.button} ${styles[variant]}`;
}

export function Button({
  className = "",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${buttonStyles(variant)} ${className}`.trim()}
      {...props}
    />
  );
}

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  className?: string;
  variant?: ButtonVariant;
};

export function ButtonLink({
  className = "",
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={`${buttonStyles(variant)} ${className}`.trim()}
      {...props}
    />
  );
}
