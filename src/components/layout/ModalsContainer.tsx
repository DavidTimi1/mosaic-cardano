"use client";

import React from 'react';
import { useModals } from '@/contexts/modals-context';
import { MODALS } from '@/lib/modals';
import CreateProjectModal from '../project/CreateProjectModal';
import PricingModal from '../modals/PricingModal';

export const ModalsContainer = () => {
  const { isOpen, closeModal } = useModals();

  return (
    <>
      <CreateProjectModal 
        isOpen={isOpen(MODALS.CREATE_PROJECT)} 
        onClose={() => closeModal(MODALS.CREATE_PROJECT)} 
      />
      <PricingModal
        isOpen={isOpen(MODALS.PRICING)}
        onClose={() => closeModal(MODALS.PRICING)}
      />
      {/* Add other global modals here */}
    </>
  );
};
