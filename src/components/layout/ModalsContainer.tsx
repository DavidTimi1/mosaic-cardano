"use client";

import React from 'react';
import { useModals } from '@/contexts/modals-context';
import { MODALS } from '@/lib/modals';
import CreateProjectModal from '../project/CreateProjectModal';

export const ModalsContainer = () => {
  const { isOpen, closeModal } = useModals();

  return (
    <>
      <CreateProjectModal 
        isOpen={isOpen(MODALS.CREATE_PROJECT)} 
        onClose={() => closeModal(MODALS.CREATE_PROJECT)} 
      />
      {/* Add other global modals here */}
    </>
  );
};
