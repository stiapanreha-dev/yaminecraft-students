import * as React from "react";
import { Button as BsButton } from 'react-bootstrap';
import { cn } from "@/lib/utils";

const variantMap = {
  default: 'primary',
  primary: 'primary',
  destructive: 'danger',
  outline: 'outline-primary',
  secondary: 'secondary',
  ghost: 'link',
  link: 'link',
  accent: 'accent',
};

const sizeMap = {
  default: undefined,
  sm: 'sm',
  lg: 'lg',
  icon: 'sm',
};

const Button = React.forwardRef(
  ({ className, variant = 'default', size = 'default', asChild = false, children, ...props }, ref) => {
    const bsVariant = variantMap[variant] || variant;
    const bsSize = sizeMap[size];

    // Handle icon size with custom styling
    const iconClass = size === 'icon' ? 'btn-icon' : '';

    return (
      <BsButton
        ref={ref}
        variant={bsVariant}
        size={bsSize}
        className={cn(iconClass, className)}
        {...props}
      >
        {children}
      </BsButton>
    );
  }
);

Button.displayName = "Button";

export { Button };
