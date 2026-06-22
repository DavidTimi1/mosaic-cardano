"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { ModalId } from '@/lib/modals';

interface ModalsContextType {
  openModal: (modalId: ModalId) => void;
  closeModal: (modalId: ModalId) => void;
  isOpen: (modalId: ModalId) => boolean;
}

const ModalsContext = createContext<ModalsContextType | null>(null);

export const ModalsProvider = ({ children }: { children: ReactNode }) => {
  const [modalsState, setModalsState] = useState<Record<string, boolean>>({});

  const openModal = useCallback((modalId: ModalId) => {
    setModalsState((prev) => ({ ...prev, [modalId]: true }));
  }, []);

  const closeModal = useCallback((modalId: ModalId) => {
    setModalsState((prev) => ({ ...prev, [modalId]: false }));
  }, []);

  const isOpen = useCallback((modalId: ModalId) => {
    return !!modalsState[modalId];
  }, [modalsState]);

  return (
    <ModalsContext.Provider value={{ openModal, closeModal, isOpen }}>
      {children}
    </ModalsContext.Provider>
  );
};

export const useModals = () => {
  const context = useContext(ModalsContext);
  if (!context) {
    throw new Error('useModals must be used within a ModalsProvider');
  }
  return context;
};
