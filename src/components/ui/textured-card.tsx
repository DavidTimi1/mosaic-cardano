import { cn } from "@/lib/utils";
import React from "react";

const MosaicPattern1 = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M100 100H50V50H100V100Z" fill="currentColor" fillOpacity="0.4" />
    <path d="M50 100H0V50H50V100Z" fill="currentColor" fillOpacity="0.1" />
    <path d="M100 50H50V0H100V50Z" fill="currentColor" fillOpacity="0.2" />
    <path d="M50 50H25V25H50V50Z" fill="currentColor" fillOpacity="0.3" />
    <path d="M75 0H50V25H75V0Z" fill="currentColor" fillOpacity="0.15" />
    <path d="M100 0H75V25H100V0Z" fill="currentColor" fillOpacity="0.05" />
    <path d="M25 100H0V75H25V100Z" fill="currentColor" fillOpacity="0.25" />
  </svg>
);

const MosaicPattern2 = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <polygon points="100,100 50,100 100,50" fill="currentColor" fillOpacity="0.4" />
    <polygon points="50,100 0,100 50,50" fill="currentColor" fillOpacity="0.2" />
    <polygon points="100,50 50,50 100,0" fill="currentColor" fillOpacity="0.15" />
    <polygon points="50,50 0,50 50,0" fill="currentColor" fillOpacity="0.05" />
    <polygon points="75,50 50,50 50,25" fill="currentColor" fillOpacity="0.3" />
    <polygon points="100,25 75,25 100,0" fill="currentColor" fillOpacity="0.25" />
  </svg>
);

const MosaicPattern3 = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M100 100L75 75L100 50Z" fill="currentColor" fillOpacity="0.3" />
    <path d="M75 75L50 100L100 100Z" fill="currentColor" fillOpacity="0.4" />
    <path d="M75 75L50 50L75 25Z" fill="currentColor" fillOpacity="0.1" />
    <path d="M50 100L25 75L50 50Z" fill="currentColor" fillOpacity="0.2" />
    <path d="M100 50L75 25L100 0Z" fill="currentColor" fillOpacity="0.15" />
    <path d="M50 50L25 25L50 0Z" fill="currentColor" fillOpacity="0.05" />
  </svg>
);

const MosaicPattern4 = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect x="60" y="60" width="40" height="40" fill="currentColor" fillOpacity="0.4" />
    <rect x="20" y="80" width="40" height="20" fill="currentColor" fillOpacity="0.2" />
    <rect x="80" y="20" width="20" height="40" fill="currentColor" fillOpacity="0.15" />
    <rect x="40" y="40" width="40" height="40" fill="currentColor" fillOpacity="0.1" />
    <rect x="60" y="0" width="20" height="40" fill="currentColor" fillOpacity="0.05" />
    <rect x="0" y="60" width="40" height="20" fill="currentColor" fillOpacity="0.05" />
    <rect x="20" y="40" width="20" height="20" fill="currentColor" fillOpacity="0.3" />
  </svg>
);

const MosaicPattern5 = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <polygon points="100,100 60,100 80,60 100,60" fill="currentColor" fillOpacity="0.4" />
    <polygon points="60,100 20,100 40,60 80,60" fill="currentColor" fillOpacity="0.2" />
    <polygon points="100,60 80,60 90,30 100,30" fill="currentColor" fillOpacity="0.15" />
    <polygon points="80,60 40,60 50,30 90,30" fill="currentColor" fillOpacity="0.1" />
    <polygon points="40,60 0,60 10,30 50,30" fill="currentColor" fillOpacity="0.05" />
    <polygon points="100,30 90,30 95,10 100,10" fill="currentColor" fillOpacity="0.05" />
    <polygon points="90,30 50,30 55,10 95,10" fill="currentColor" fillOpacity="0.25" />
  </svg>
);

const patterns = [MosaicPattern1, MosaicPattern2, MosaicPattern3, MosaicPattern4, MosaicPattern5];

interface TexturedCardProps extends React.ComponentPropsWithoutRef<"div"> {
  patternId?: 1 | 2 | 3 | 4 | 5;
  patternColor?: string;
  patternOpacity?: string;
}

export const TexturedCard = ({ 
  children, 
  className, 
  patternId = 1,
  patternColor = "text-theme-clay",
  patternOpacity = "opacity-20",
  ...props 
}: TexturedCardProps) => {
  const PatternComponent = patterns[(patternId - 1) % 5] || MosaicPattern1;

  return (
    <div className={cn("relative overflow-hidden", className)} {...props}>
      <div className={cn("absolute bottom-0 right-0 w-32 h-32 pointer-events-none z-0", patternColor, patternOpacity)}>
        <PatternComponent />
      </div>
      <div className="relative z-10 size-full">
        {children}
      </div>
    </div>
  );
};