import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CardWrapperProps } from "@/interfaces";

export const CardWrapper = ({
  children,
  title,
  description,
  action,
  footer,
  className = "",
}: CardWrapperProps) => {
  return (
    <Card className={className}>
      {(title || description || action) && (
        <CardHeader className="gap-2">
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
          {action && (
            <CardAction>
              {action}
            </CardAction>
          )}
        </CardHeader>
      )}
      {/* Main Dynamic Content Body */}
      <CardContent>{children}</CardContent>
      {/* Footer Block: Conditionally renders if a footer element is passed */}
      {footer && <CardFooter className="flex-col items-start gap-1.5 text-sm">{footer}</CardFooter>}
    </Card>
  );
};
