import { XIcon } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface CloseButtonProps {
    onClick: () => void;
    className?: string;
    [key: string]: unknown;
}

export const CloseButton = ({ className, onClick, ...props }: CloseButtonProps) => {
    const defaultClass = "absolute right-4 top-4";
    return (
        <Button size="icon" variant="ghost" onClick={onClick} className={cn(defaultClass, className)} {...props}>
            <XIcon size={20} />
        </Button>
    );
}