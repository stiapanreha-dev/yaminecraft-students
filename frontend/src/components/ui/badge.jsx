import * as React from "react";
import { Badge as BsBadge } from 'react-bootstrap';
import { cn } from "@/lib/utils";

const variantMap = {
  default: 'primary',
  secondary: 'secondary',
  destructive: 'danger',
  outline: 'outline-secondary',
  success: 'success',
  warning: 'warning',
};

function Badge({ className, variant = 'default', children, ...props }) {
  const bsVariant = variantMap[variant] || variant;

  // Handle outline variant specially
  if (variant === 'outline') {
    return (
      <span
        className={cn(
          "badge border border-secondary text-secondary",
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }

  return (
    <BsBadge
      bg={bsVariant}
      className={cn(className)}
      {...props}
    >
      {children}
    </BsBadge>
  );
}

export { Badge };
