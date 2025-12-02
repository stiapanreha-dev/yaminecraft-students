import * as React from "react";
import { cn } from "@/lib/utils";

const Separator = React.forwardRef(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
    <hr
      ref={ref}
      className={cn(
        orientation === "horizontal" ? "w-100 my-2" : "vr mx-2",
        className
      )}
      {...props}
    />
  )
);

Separator.displayName = "Separator";

export { Separator };
