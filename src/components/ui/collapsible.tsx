'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface CollapsibleProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    defaultOpen?: boolean;
    children: React.ReactNode;
    className?: string;
}

const CollapsibleContext = React.createContext<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
}>({
    open: false,
    onOpenChange: () => { },
});

const Collapsible = ({
    open,
    onOpenChange,
    defaultOpen = false,
    children,
    className,
    ...props
}: CollapsibleProps) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);

    const isControlled = open !== undefined;
    const currentOpen = isControlled ? open : isOpen;

    const handleOpenChange = (newOpen: boolean) => {
        if (!isControlled) {
            setIsOpen(newOpen);
        }
        onOpenChange?.(newOpen);
    };

    return (
        <CollapsibleContext.Provider
            value={{ open: currentOpen!, onOpenChange: handleOpenChange }}
        >
            <div className={cn('w-full', className)} {...props}>
                {children}
            </div>
        </CollapsibleContext.Provider>
    );
};

const CollapsibleTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, children, asChild, ...props }, ref) => {
    const { open, onOpenChange } = React.useContext(CollapsibleContext);

    const Comp = asChild ? React.Fragment : 'button';
    const childProps = asChild && React.isValidElement(children) ? children.props : {};

    return (
        // @ts-ignore
        <Comp
            ref={ref}
            type="button"
            className={cn('flex items-center justify-between', className)}
            onClick={() => onOpenChange(!open)}
            {...props}
            {...childProps}
        >
            {children}
        </Comp>
    );
});
CollapsibleTrigger.displayName = 'CollapsibleTrigger';

const CollapsibleContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    const { open } = React.useContext(CollapsibleContext);

    if (!open) return null;

    return (
        <div
            ref={ref}
            className={cn('overflow-hidden animate-in slide-in-from-top-1 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-1', className)}
            {...props}
        >
            {children}
        </div>
    );
});
CollapsibleContent.displayName = 'CollapsibleContent';

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
