import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon
  error?: string
  label?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon: Icon, error, label, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          )}
          <input
            className={cn(
              "block w-full px-3 py-3 border border-gray-300 rounded-lg",
              "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "disabled:opacity-70 disabled:cursor-not-allowed",
              "transition-colors duration-200",
              Icon && "pl-10",
              error && "border-red-500 focus:ring-red-500 focus:border-red-500",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="text-red-500 text-xs animate-in slide-in-from-top-2">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'