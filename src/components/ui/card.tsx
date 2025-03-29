import { ReactNode } from "react";

// Card Root Component
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white shadow-lg rounded-xl p-6 w-full hover:shadow-xl transition-shadow duration-300 ${className}`}>
      {children}
    </div>
  );
}

// Card Header
export function CardHeader({ children }: { children: ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

// Card Title
export function CardTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-lg font-bold">{children}</h3>;
}

// Card Content
export function CardContent({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

// Card Footer (Optional)
export function CardFooter({ children }: { children: ReactNode }) {
  return <div className="mt-4 border-t pt-4">{children}</div>;
}
