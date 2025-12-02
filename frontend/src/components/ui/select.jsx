import * as React from "react";
import { Form } from 'react-bootstrap';
import { cn } from "@/lib/utils";

const Select = React.forwardRef(({ children, value, onValueChange, defaultValue, ...props }, ref) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || '');
  const currentValue = value !== undefined ? value : internalValue;

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <SelectContext.Provider value={{ value: currentValue, onValueChange: handleChange }}>
      {children}
    </SelectContext.Provider>
  );
});
Select.displayName = "Select";

const SelectContext = React.createContext({});

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const { value, onValueChange } = React.useContext(SelectContext);

  // Find SelectValue and SelectContent in children
  let selectValueChild = null;
  let otherChildren = [];

  React.Children.forEach(children, (child) => {
    if (child?.type?.displayName === 'SelectValue') {
      selectValueChild = child;
    } else {
      otherChildren.push(child);
    }
  });

  return (
    <Form.Select
      ref={ref}
      value={value}
      onChange={onValueChange}
      className={cn(className)}
      {...props}
    >
      {selectValueChild && !value && (
        <option value="" disabled>{selectValueChild.props.placeholder}</option>
      )}
      {otherChildren}
    </Form.Select>
  );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = ({ placeholder }) => {
  return null; // Handled by SelectTrigger
};
SelectValue.displayName = "SelectValue";

const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => {
  // In Bootstrap, options are rendered directly inside Form.Select
  return <>{children}</>;
});
SelectContent.displayName = "SelectContent";

const SelectGroup = ({ children }) => <>{children}</>;
SelectGroup.displayName = "SelectGroup";

const SelectLabel = React.forwardRef(({ className, children, ...props }, ref) => (
  <option ref={ref} disabled className={cn("fw-semibold", className)} {...props}>
    {children}
  </option>
));
SelectLabel.displayName = "SelectLabel";

const SelectItem = React.forwardRef(({ className, children, value, ...props }, ref) => (
  <option ref={ref} value={value} className={cn(className)} {...props}>
    {children}
  </option>
));
SelectItem.displayName = "SelectItem";

const SelectSeparator = () => null;

const SelectScrollUpButton = () => null;
const SelectScrollDownButton = () => null;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
