import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'info' | 'purple';
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gitclub focus:ring-offset-2',
          {
            'border-transparent bg-gitclub text-white': variant === 'default',
            'text-slate-900 border-slate-200': variant === 'outline',
            'border-transparent bg-emerald-100 text-emerald-800': variant === 'success',
            'border-transparent bg-amber-100 text-amber-800': variant === 'warning',
            'border-transparent bg-blue-100 text-blue-800': variant === 'info',
            'border-transparent bg-purple-100 text-purple-800': variant === 'purple',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';
