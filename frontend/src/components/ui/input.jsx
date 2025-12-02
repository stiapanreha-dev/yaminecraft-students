import * as React from "react";
import { Form } from 'react-bootstrap';
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <Form.Control
      type={type}
      ref={ref}
      className={cn(className)}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
