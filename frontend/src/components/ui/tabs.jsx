import * as React from "react";
import { Tabs as BsTabs, Tab } from 'react-bootstrap';
import { cn } from "@/lib/utils";

const TabsContext = React.createContext({});

const Tabs = ({ defaultValue, value, onValueChange, children, className, ...props }) => {
  const [activeKey, setActiveKey] = React.useState(defaultValue || '');
  const currentKey = value !== undefined ? value : activeKey;

  const handleSelect = (key) => {
    if (value === undefined) {
      setActiveKey(key);
    }
    onValueChange?.(key);
  };

  // Extract TabsList and TabsContent from children
  let tabsList = null;
  let tabsContents = [];

  React.Children.forEach(children, (child) => {
    if (child?.type?.displayName === 'TabsList') {
      tabsList = child;
    } else if (child?.type?.displayName === 'TabsContent') {
      tabsContents.push(child);
    }
  });

  return (
    <TabsContext.Provider value={{ activeKey: currentKey, onSelect: handleSelect }}>
      <div className={cn(className)} {...props}>
        {tabsList}
        {tabsContents.map((content) => (
          <div
            key={content.props.value}
            className={cn(
              "mt-3",
              currentKey === content.props.value ? "d-block" : "d-none",
              content.props.className
            )}
          >
            {content.props.children}
          </div>
        ))}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = React.forwardRef(({ className, children, ...props }, ref) => {
  const { activeKey, onSelect } = React.useContext(TabsContext);

  return (
    <ul ref={ref} className={cn("nav nav-tabs", className)} role="tablist" {...props}>
      {React.Children.map(children, (child) => {
        if (child?.type?.displayName === 'TabsTrigger') {
          return React.cloneElement(child, {
            isActive: activeKey === child.props.value,
            onClick: () => onSelect(child.props.value),
          });
        }
        return child;
      })}
    </ul>
  );
});
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef(({ className, value, isActive, onClick, children, ...props }, ref) => (
  <li className="nav-item" role="presentation">
    <button
      ref={ref}
      className={cn(
        "nav-link",
        isActive && "active",
        className
      )}
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  </li>
));
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef(({ className, value, children, ...props }, ref) => {
  // Rendering is handled by Tabs component
  return null;
});
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
