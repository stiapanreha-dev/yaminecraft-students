import * as React from "react";
import { Modal } from 'react-bootstrap';
import { cn } from "@/lib/utils";

const Dialog = ({ open, onOpenChange, children }) => {
  return (
    <Modal show={open} onHide={() => onOpenChange?.(false)} centered>
      {children}
    </Modal>
  );
};

const DialogTrigger = ({ asChild, children, onClick, ...props }) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick, ...props });
  }
  return <button onClick={onClick} {...props}>{children}</button>;
};

const DialogPortal = ({ children }) => <>{children}</>;

const DialogOverlay = () => null;

const DialogClose = ({ asChild, children, onClick, ...props }) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick, ...props });
  }
  return <button onClick={onClick} {...props}>{children}</button>;
};

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn(className)} {...props}>
    {children}
  </div>
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({ className, children, ...props }) => (
  <Modal.Header closeButton className={cn(className)} {...props}>
    {children}
  </Modal.Header>
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, children, ...props }) => (
  <Modal.Footer className={cn("d-flex justify-content-end gap-2", className)} {...props}>
    {children}
  </Modal.Footer>
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <Modal.Title ref={ref} className={cn("fs-5 fw-semibold", className)} {...props}>
    {children}
  </Modal.Title>
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef(({ className, children, ...props }, ref) => (
  <p ref={ref} className={cn("text-muted small", className)} {...props}>
    {children}
  </p>
));
DialogDescription.displayName = "DialogDescription";

const DialogBody = ({ className, children, ...props }) => (
  <Modal.Body className={cn(className)} {...props}>
    {children}
  </Modal.Body>
);
DialogBody.displayName = "DialogBody";

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogBody,
};
