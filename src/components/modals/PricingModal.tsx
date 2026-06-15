import React from 'react';
import { X } from 'lucide-react';
import { PricingSection } from '../landing/PricingSection';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  if (!isOpen) return null;

  const modalVariants = {
    hidden: { opacity: 1 },
    visible: { opacity: 1 }
  };

  return (
    <div className="fixed inset-0 bg-theme-forest/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-theme-parchment w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative animate-in zoom-in-95 duration-300">
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-50 text-theme-on-surface/50 hover:text-theme-forest transition-colors cursor-pointer"
        >
          <X size={24} />
        </button>

        <PricingSection containerVariants={modalVariants} isModal={true} />
      </div>
    </div>
  );
}
