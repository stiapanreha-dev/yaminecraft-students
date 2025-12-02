import * as React from "react";
import { Dropdown } from 'react-bootstrap';
import { cn } from "@/lib/utils";

const DropdownMenu = ({ children }) => {
  return <Dropdown>{children}</Dropdown>;
};

const DropdownMenuTrigger = React.forwardRef(({ asChild, children, className, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    return (
      <Dropdown.Toggle as="div" ref={ref} className={cn("d-inline-block", className)} {...props}>
        {children}
      </Dropdown.Toggle>
    );
  }
  return (
    <Dropdown.Toggle ref={ref} variant="outline-secondary" className={cn(className)} {...props}>
      {children}
    </Dropdown.Toggle>
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = React.forwardRef(({ className, align = "end", children, ...props }, ref) => (
  <Dropdown.Menu ref={ref} align={align} className={cn(className)} {...props}>
    {children}
  </Dropdown.Menu>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef(({ className, children, onClick, ...props }, ref) => (
  <Dropdown.Item ref={ref} className={cn("d-flex align-items-center gap-2", className)} onClick={onClick} {...props}>
    {children}
  </Dropdown.Item>
));
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuLabel = React.forwardRef(({ className, children, ...props }, ref) => (
  <Dropdown.Header ref={ref} className={cn("fw-semibold", className)} {...props}>
    {children}
  </Dropdown.Header>
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <Dropdown.Divider ref={ref} className={cn(className)} {...props} />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuGroup = ({ children }) => <>{children}</>;

const DropdownMenuPortal = ({ children }) => <>{children}</>;

const DropdownMenuSub = ({ children }) => <>{children}</>;

const DropdownMenuRadioGroup = ({ children }) => <>{children}</>;

const DropdownMenuSubTrigger = DropdownMenuItem;
const DropdownMenuSubContent = DropdownMenuContent;
const DropdownMenuCheckboxItem = DropdownMenuItem;
const DropdownMenuRadioItem = DropdownMenuItem;

const DropdownMenuShortcut = ({ className, children, ...props }) => (
  <span className={cn("ms-auto small text-muted", className)} {...props}>
    {children}
  </span>
);

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
