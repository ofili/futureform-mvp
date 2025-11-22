'use client';

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type DialogProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  className?: string;
};

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  // no DOM access on server
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return open ? createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-hidden={open ? undefined : true}
    >
      <div className="fixed inset-0 bg-black/40" onClick={() => onOpenChange?.(false)} />
      <div className="relative z-10">{children}</div>
    </div>,
    document.body
  ) : null;
}

/* DialogContent — center card */
export function DialogContent({ children, className = "", onClose }: { children?: React.ReactNode; className?: string; onClose?: () => void }) {
  return (
    <div className={cn("w-full max-w-2xl rounded-lg bg-white shadow-lg overflow-hidden", className)}>
      {children}
    </div>
  );
}

export function DialogHeader({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={cn("px-6 pt-6 pb-4", className)}>{children}</div>;
}

export function DialogTitle({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <h3 className={cn("text-lg font-semibold", className)}>{children}</h3>;
}

export function DialogDescription({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <p className={cn("text-sm text-muted-foreground mt-1.5", className)}>{children}</p>;
}

export function DialogBody({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={cn("px-6 py-4", className)}>{children}</div>;
}

export function DialogFooter({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={cn("px-6 pb-6 pt-4 flex justify-end gap-2", className)}>{children}</div>;
}
