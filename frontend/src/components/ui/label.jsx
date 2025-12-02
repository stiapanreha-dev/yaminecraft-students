import * as React from "react";
import { Form } from 'react-bootstrap';
import { cn } from "@/lib/utils";

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <Form.Label
    ref={ref}
    className={cn("fw-medium", className)}
    {...props}
  />
));

Label.displayName = "Label";

export { Label };
