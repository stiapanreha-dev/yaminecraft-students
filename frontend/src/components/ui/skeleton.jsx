import * as React from "react";
import { Placeholder } from 'react-bootstrap';
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("placeholder-glow", className)}
      {...props}
    >
      <span className="placeholder w-100 rounded"></span>
    </div>
  );
}

export { Skeleton };
