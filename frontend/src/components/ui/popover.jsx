import * as React from "react";
import { OverlayTrigger, Popover as BsPopover } from 'react-bootstrap';
import { cn } from "@/lib/utils";

const PopoverContext = React.createContext({});

const Popover = ({ children }) => {
  const [show, setShow] = React.useState(false);

  return (
    <PopoverContext.Provider value={{ show, setShow }}>
      {children}
    </PopoverContext.Provider>
  );
};

const PopoverTrigger = React.forwardRef(({ asChild, children, ...props }, ref) => {
  const { setShow } = React.useContext(PopoverContext);

  const handleClick = () => setShow((prev) => !prev);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { ref, onClick: handleClick, ...props });
  }

  return (
    <button ref={ref} onClick={handleClick} {...props}>
      {children}
    </button>
  );
});
PopoverTrigger.displayName = "PopoverTrigger";

const PopoverAnchor = React.forwardRef(({ children, ...props }, ref) => (
  <span ref={ref} {...props}>
    {children}
  </span>
));
PopoverAnchor.displayName = "PopoverAnchor";

const PopoverContent = React.forwardRef(({ className, children, align = "center", ...props }, ref) => {
  const { show, setShow } = React.useContext(PopoverContext);

  if (!show) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "position-absolute z-3 bg-white border rounded shadow p-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
