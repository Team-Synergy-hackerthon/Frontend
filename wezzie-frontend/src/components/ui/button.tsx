import * as React from "react";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "./loading";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  className,
  variant = "default",
  size = "md",
  isLoading,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5",
        variant === "default" &&
          "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        variant === "outline" &&
          "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
        variant === "ghost" &&
          "text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
        size === "sm" && "px-3 py-2 text-sm",
        size === "md" && "px-4 py-3 text-base",
        size === "lg" && "px-6 py-4 text-lg",
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner className="mr-2" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}
