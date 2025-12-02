import * as React from "react";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

const Avatar = React.forwardRef(({ className, children, ...props }, ref) => {
  const [imageError, setImageError] = React.useState(false);

  // Check if any AvatarImage child has no src
  const hasNoSrc = React.useMemo(() => {
    let noSrc = false;
    React.Children.forEach(children, (child) => {
      if (child?.type?.displayName === 'AvatarImage') {
        if (!child.props?.src) {
          noSrc = true;
        }
      }
    });
    return noSrc;
  }, [children]);

  const showFallback = imageError || hasNoSrc;

  return (
    <div
      ref={ref}
      className={cn("avatar position-relative d-inline-flex", className)}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (child?.type?.displayName === 'AvatarImage') {
          return React.cloneElement(child, { onError: () => setImageError(true), imageError });
        }
        if (child?.type?.displayName === 'AvatarFallback') {
          return showFallback ? child : null;
        }
        return child;
      })}
    </div>
  );
});
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef(({ className, src, alt, onError, imageError, ...props }, ref) => {
  if (imageError || !src) return null;

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      onError={onError}
      className={cn("rounded-circle w-100 h-100 object-fit-cover", className)}
      {...props}
    />
  );
});
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "d-flex align-items-center justify-content-center w-100 h-100 rounded-circle bg-secondary text-white",
      className
    )}
    {...props}
  >
    <Bot style={{ width: '50%', height: '50%' }} />
  </div>
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
